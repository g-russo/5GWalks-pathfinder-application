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
  createWalkRoute: async (fromAddr, toAddr, routeType = 'walking', units = 'metric') => {
    try {
      // Validate route type - only walking and running allowed
      if (routeType !== 'walking' && routeType !== 'running') {
        throw new Error('Only walking and running route types are supported');
      }

      const response = await api.post('/walk', {
        from_addr: fromAddr,
        to: toAddr,
        route_type: routeType,
        units: units,
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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
