import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api, { setAccessToken } from '../../lib/api-client';

interface ApiContextType {
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  token: string;
  setToken: (token: string) => void;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  selectedEvent: any | null;
  setSelectedEvent: (event: any | null) => void;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backendUrl, setBackendUrlState] = useState(process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co');
  const [token, setTokenState] = useState('');
  const [selectedEventId, setSelectedEventIdState] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount and attempt silent token refresh
  useEffect(() => {
    const initializeSession = async () => {
      let activeUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co';
      if (typeof window !== 'undefined') {
        let storedUrl = localStorage.getItem('mm_test_backend_url');
        const storedEventId = localStorage.getItem('mm_test_event_id');
        const storedEvent = localStorage.getItem('mm_test_event');

        if (storedUrl === 'https://api-wp-events.infoviz.co') {
          localStorage.removeItem('mm_test_backend_url');
          storedUrl = null;
        }

        if (storedUrl) {
          setBackendUrlState(storedUrl);
          activeUrl = storedUrl;
        } else {
          setBackendUrlState(activeUrl);
        }
        if (storedEventId) setSelectedEventIdState(storedEventId);
        if (storedEvent) {
          try {
            setSelectedEvent(JSON.parse(storedEvent));
          } catch (_) {
            // ignore
          }
        }
      }

      try {
        // Silently restore access token from the HTTP-only refresh cookie or storage
        let storedRefreshToken = '';
        if (typeof window !== 'undefined') {
          storedRefreshToken = localStorage.getItem('mm_test_refresh_token') || '';
        }
        const response = await axios.post(
          `${activeUrl}/api/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );
        const data = response.data;
        if (data && data.accessToken) {
          setTokenState(data.accessToken);
          setAccessToken(data.accessToken);
        }
      } catch (err) {
        console.log('[ApiContext] Silent refresh on mount failed or user is not logged in.');
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  const setBackendUrl = (url: string) => {
    setBackendUrlState(url);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_test_backend_url', url);
    }
  };

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    setAccessToken(newToken); // Sync with in-memory Axios client
  };

  const setSelectedEventId = (id: string) => {
    setSelectedEventIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_test_event_id', id);
    }
  };

  const updateSelectedEvent = (event: any | null) => {
    setSelectedEvent(event);
    setSelectedEventIdState(event ? event.id : '');
    if (typeof window !== 'undefined') {
      if (event) {
        localStorage.setItem('mm_test_event', JSON.stringify(event));
        localStorage.setItem('mm_test_event_id', event.id);
      } else {
        localStorage.removeItem('mm_test_event');
        localStorage.removeItem('mm_test_event_id');
      }
    }
  };

  const logout = async () => {
    try {
      let activeUrl = (typeof window !== 'undefined' && localStorage.getItem('mm_test_backend_url')) || '';
      if (activeUrl === 'https://api-wp-events.infoviz.co') {
        if (typeof window !== 'undefined') localStorage.removeItem('mm_test_backend_url');
        activeUrl = '';
      }
      if (!activeUrl) {
        activeUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co';
      }
      let storedRefreshToken = '';
      if (typeof window !== 'undefined') {
        storedRefreshToken = localStorage.getItem('mm_test_refresh_token') || '';
      }
      await axios.post(`${activeUrl}/api/auth/logout`, { refreshToken: storedRefreshToken }, { withCredentials: true });
    } catch (err) {
      console.error('[ApiContext] Logout request failed:', err);
    } finally {
      setTokenState('');
      setAccessToken(null); // Clear Axios in-memory active token
      setSelectedEventIdState('');
      setSelectedEvent(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mm_test_refresh_token');
        localStorage.removeItem('mm_test_event_id');
        localStorage.removeItem('mm_test_event');
      }
    }
  };

  // Modernized adapter routing fetch options seamlessly into our Axios client wrapper
  const apiFetch = async (endpoint: string, options: any = {}) => {
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const method = (options.method || 'GET').toLowerCase();
    
    let body = options.body;
    if (body && typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {
        // Keep as string
      }
    }

    try {
      const response = await api.request({
        url,
        method,
        data: body,
        headers: options.headers || {},
      });
      return response;
    } catch (err: any) {
      // Re-throw formatted errors to align with fetch catch behaviors
      let errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'API query failed';
      if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
        const detailsStr = err.response.data.details
          .map((d: any) => `${d.path.replace(/^body\./, '')}: ${d.message}`)
          .join('; ');
        errorMsg = `${errorMsg}: ${detailsStr}`;
      }
      throw new Error(errorMsg);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        backendUrl,
        setBackendUrl,
        token,
        setToken,
        selectedEventId,
        setSelectedEventId,
        selectedEvent,
        setSelectedEvent: updateSelectedEvent,
        apiFetch,
        logout,
        loading,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
