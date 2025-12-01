import axios from 'axios';

// Backend API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// MapQuest API configuration
const MAPQUEST_API_KEY = import.meta.env.VITE_MAPQUEST_API_KEY || 'YOUR_MAPQUEST_API_KEY';
const MAPQUEST_BASE_URL = 'https://www.mapquestapi.com';

// Backend API endpoints
export const routesAPI = {
  // Get all routes
  getRoutes: () => api.get('/routes'),
  
  // Get a specific route by ID
  getRoute: (id) => api.get(`/routes/${id}`),
  
  // Create a new route
  createRoute: (routeData) => api.post('/routes', routeData),
  
  // Update a route
  updateRoute: (id, routeData) => api.put(`/routes/${id}`, routeData),
  
  // Delete a route
  deleteRoute: (id) => api.delete(`/routes/${id}`),
  
  // Get user's saved routes
  getSavedRoutes: () => api.get('/routes/saved'),
  
  // Get shared/community routes
  getSharedRoutes: () => api.get('/routes/shared'),
  
  // Save a route to user's collection
  saveRoute: (routeId) => api.post(`/routes/${routeId}/save`),
  
  // Share a route
  shareRoute: (routeId) => api.post(`/routes/${routeId}/share`),
};

// Walk API - Creates optimal walking routes
export const walkAPI = {
  // Create a walking route using the backend /walk endpoint
  createWalkRoute: async (fromAddr, toAddr, routeType = 'walking', units = 'metric', waypoints = []) => {
    try {
      // Validate route type - only walking and running allowed
      if (routeType !== 'walking' && routeType !== 'running') {
        throw new Error('Only walking and running route types are supported');
      }

      // Filter out empty waypoints
      const validWaypoints = waypoints.filter(wp => wp && wp.trim());

      const response = await api.post('/walk', {
        from_addr: fromAddr,
        to: toAddr,
        route_type: routeType,
        units: units,
        waypoints: validWaypoints,
      });
      return response.data;
    } catch (error) {
      console.error('Walk Route Error:', error);
      throw error;
    }
  },
};

// MapQuest API functions
export const mapQuestAPI = {
  // Get directions between two points (deprecated - use walkAPI.createWalkRoute instead)
  getDirections: async (start, end, options = {}) => {
    try {
      const response = await axios.get(`${MAPQUEST_BASE_URL}/directions/v2/route`, {
        params: {
          key: MAPQUEST_API_KEY,
          from: start,
          to: end,
          routeType: options.routeType || 'pedestrian',
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      console.error('MapQuest Directions Error:', error);
      throw error;
    }
  },

  // Search for places
  searchPlaces: async (query, location) => {
    try {
      const response = await axios.get(`${MAPQUEST_BASE_URL}/search/v2/search`, {
        params: {
          key: MAPQUEST_API_KEY,
          q: query,
          location: location,
        },
      });
      return response.data;
    } catch (error) {
      console.error('MapQuest Search Error:', error);
      throw error;
    }
  },

  // Geocode an address
  geocode: async (address) => {
    try {
      const response = await axios.get(`${MAPQUEST_BASE_URL}/geocoding/v1/address`, {
        params: {
          key: MAPQUEST_API_KEY,
          location: address,
        },
      });
      return response.data;
    } catch (error) {
      console.error('MapQuest Geocode Error:', error);
      throw error;
    }
  },

  // Reverse geocode coordinates
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await axios.get(`${MAPQUEST_BASE_URL}/geocoding/v1/reverse`, {
        params: {
          key: MAPQUEST_API_KEY,
          location: `${lat},${lng}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('MapQuest Reverse Geocode Error:', error);
      throw error;
    }
  },
};

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableMethods: ['get', 'put', 'head', 'delete', 'options', 'post'],
};

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (retryCount) => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(2, retryCount);
  const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
  return Math.min(delay + jitter, RETRY_CONFIG.maxDelay);
};

/**
 * Check if request should be retried
 */
const shouldRetry = (error, retryCount) => {
  // Don't retry if max retries reached
  if (retryCount >= RETRY_CONFIG.maxRetries) {
    return false;
  }

  // Don't retry if no config (means request wasn't sent)
  if (!error.config) {
    return false;
  }

  // Only retry certain HTTP methods
  const method = error.config.method?.toLowerCase();
  if (!RETRY_CONFIG.retryableMethods.includes(method)) {
    return false;
  }

  // Retry on network errors
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return true;
  }

  // Retry on specific status codes
  const status = error.response?.status;
  return RETRY_CONFIG.retryableStatuses.includes(status);
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Initialize retry count
    config.retryCount = config.retryCount || 0;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Handle unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Check if we should retry
    if (shouldRetry(error, config.retryCount)) {
      config.retryCount = (config.retryCount || 0) + 1;
      
      const delay = getRetryDelay(config.retryCount);
      
      console.log(
        `Retrying request (attempt ${config.retryCount}/${RETRY_CONFIG.maxRetries}) ` +
        `after ${Math.round(delay)}ms delay...`
      );

      // Wait before retrying
      await sleep(delay);

      // Retry the request
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
