const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Check if user set a custom URL in localStorage (useful for development overrides)
    let storedUrl = localStorage.getItem('mm_test_backend_url');
    if (storedUrl === 'https://api-wp-events.infoviz.co') {
      localStorage.removeItem('mm_test_backend_url');
      storedUrl = null;
    }
    if (storedUrl) return storedUrl;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co';
};

export const BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  auth: {
    sendOtp: `${BASE_URL}/api/auth/send-otp`,
    verifyOtp: `${BASE_URL}/api/auth/verify-otp`,
    refreshToken: `${BASE_URL}/api/auth/refresh-token`,
    logout: `${BASE_URL}/api/auth/logout`,
  },
  events: {
    base: `${BASE_URL}/api/events`,
    byId: (id: string) => `${BASE_URL}/api/events/${id}`,
    publish: (id: string) => `${BASE_URL}/api/events/${id}/publish`,
  },
  pois: {
    base: `${BASE_URL}/api/pois`,
    byId: (id: string) => `${BASE_URL}/api/pois/${id}`,
    categories: `${BASE_URL}/api/pois/categories`,
  },
  routes: {
    eventRoutes: (eventId: string) => `${BASE_URL}/api/events/${eventId}/routes`,
    general: `${BASE_URL}/api/routes`,
  },
  notifications: {
    base: `${BASE_URL}/api/notifications`,
    byEvent: (eventId: string) => `${BASE_URL}/api/notifications/${eventId}`,
  },
} as const;
