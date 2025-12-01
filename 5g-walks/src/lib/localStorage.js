/**
 * LocalStorage utility for managing user preferences and recent searches
 */

const STORAGE_KEYS = {
  PREFERENCES: '5g_walks_preferences',
  RECENT_SEARCHES: '5g_walks_recent_searches',
  SAVED_ROUTES: '5g_walks_saved_routes',
};

const DEFAULT_PREFERENCES = {
  units: 'metric', // 'metric' (km), 'imperial' (miles), 'meters'
  locale: 'en-US',
  routeType: 'walking',
  maxRecentSearches: 10,
};

/**
 * Safely get data from localStorage with error handling
 */
const safeGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Safely set data to localStorage with error handling
 */
const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
};

/**
 * Get user preferences
 */
export const getPreferences = () => {
  return safeGet(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
};

/**
 * Update user preferences (merges with existing)
 */
export const updatePreferences = (updates) => {
  const current = getPreferences();
  const updated = { ...current, ...updates };
  return safeSet(STORAGE_KEYS.PREFERENCES, updated);
};

/**
 * Reset preferences to defaults
 */
export const resetPreferences = () => {
  return safeSet(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
};

/**
 * Get recent searches
 */
export const getRecentSearches = () => {
  return safeGet(STORAGE_KEYS.RECENT_SEARCHES, []);
};

/**
 * Add a search to recent searches
 * @param {Object} search - { from: string, to: string, timestamp: number }
 */
export const addRecentSearch = (search) => {
  const searches = getRecentSearches();
  const prefs = getPreferences();
  
  // Add timestamp if not present
  const newSearch = {
    ...search,
    timestamp: search.timestamp || Date.now(),
  };
  
  // Remove duplicate if exists (same from and to)
  const filtered = searches.filter(
    s => !(s.from === newSearch.from && s.to === newSearch.to)
  );
  
  // Add to beginning
  filtered.unshift(newSearch);
  
  // Keep only max number of recent searches
  const trimmed = filtered.slice(0, prefs.maxRecentSearches);
  
  return safeSet(STORAGE_KEYS.RECENT_SEARCHES, trimmed);
};

/**
 * Clear all recent searches
 */
export const clearRecentSearches = () => {
  return safeSet(STORAGE_KEYS.RECENT_SEARCHES, []);
};

/**
 * Remove a specific recent search by index
 */
export const removeRecentSearch = (index) => {
  const searches = getRecentSearches();
  if (index >= 0 && index < searches.length) {
    searches.splice(index, 1);
    return safeSet(STORAGE_KEYS.RECENT_SEARCHES, searches);
  }
  return false;
};

/**
 * Get all saved routes
 */
export const getSavedRoutes = () => {
  return safeGet(STORAGE_KEYS.SAVED_ROUTES, []);
};

/**
 * Save a route to localStorage
 * @param {Object} route - Route object with name, startLocation, endLocation, distance, etc.
 */
export const saveRoute = (route) => {
  const routes = getSavedRoutes();
  
  // Generate unique ID if not present
  const newRoute = {
    ...route,
    id: route.id || `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    savedAt: route.savedAt || Date.now(),
  };
  
  // Check for duplicates based on start/end locations and name
  const isDuplicate = routes.some(r => 
    r.name === newRoute.name &&
    r.startLocation === newRoute.startLocation &&
    r.endLocation === newRoute.endLocation
  );
  
  if (isDuplicate) {
    console.warn('Route already exists in saved routes');
    return false;
  }
  
  // Add to beginning of array
  routes.unshift(newRoute);
  
  return safeSet(STORAGE_KEYS.SAVED_ROUTES, routes);
};

/**
 * Remove a saved route by ID
 */
export const removeRoute = (routeId) => {
  const routes = getSavedRoutes();
  const filtered = routes.filter(r => r.id !== routeId);
  return safeSet(STORAGE_KEYS.SAVED_ROUTES, filtered);
};

/**
 * Get a specific route by ID
 */
export const getRouteById = (routeId) => {
  const routes = getSavedRoutes();
  return routes.find(r => r.id === routeId) || null;
};

/**
 * Update an existing route
 */
export const updateRoute = (routeId, updates) => {
  const routes = getSavedRoutes();
  const index = routes.findIndex(r => r.id === routeId);
  
  if (index !== -1) {
    routes[index] = { ...routes[index], ...updates, updatedAt: Date.now() };
    return safeSet(STORAGE_KEYS.SAVED_ROUTES, routes);
  }
  
  return false;
};

/**
 * Clear all saved routes
 */
export const clearSavedRoutes = () => {
  return safeSet(STORAGE_KEYS.SAVED_ROUTES, []);
};
