import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';

// In-memory cache for the JWT Access Token (prevents XSS vulnerabilities)
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => inMemoryAccessToken;

// Dynamic resolver for API Base URL
export const getDynamicBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    let storedUrl = localStorage.getItem('mm_test_backend_url');
    if (storedUrl === 'https://api-wp-events.infoviz.co') {
      localStorage.removeItem('mm_test_backend_url');
      storedUrl = null;
    }
    if (storedUrl) return storedUrl;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co';
};

const api = axios.create({
  baseURL: getDynamicBaseURL(),
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Outgoing request interceptor to inject active Bearer JWT token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Dynamically update baseURL if base configuration changed in localStorage
  config.baseURL = getDynamicBaseURL();
  
  return config;
});

// Silent token refresh response queue state
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Response interceptor to catch 401 and perform silent token refreshes
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Detect unauthorized access codes
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log(`[API Interceptor] Auth error (401) on ${originalRequest.url}. Triggering silent refresh...`);
      
      if (isRefreshing) {
        // Queue this request until refresh call resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post(API_ENDPOINTS.auth.refreshToken, {}, { withCredentials: true })
          .then(({ data }) => {
            const newToken = data.accessToken;
            setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log('[API Interceptor] Token refreshed successfully. Retrying original request.');
            processQueue(null, newToken);
            resolve(api(originalRequest));
          })
          .catch((refreshError) => {
            console.error('[API Interceptor] Token refresh failed. Redirecting user to session clear...', refreshError);
            setAccessToken(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('mm_test_refresh_token'); // Clean up old tokens from legacy sessions
              localStorage.removeItem('mm_test_event_id');
              localStorage.removeItem('mm_test_event');
              window.location.href = '/';
            }
            processQueue(refreshError, null);
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
