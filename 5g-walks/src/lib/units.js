/**
 * Unit conversion and localization utilities
 */

/**
 * Unit types supported
 */
export const UNIT_TYPES = {
  METRIC: 'metric',      // kilometers
  IMPERIAL: 'imperial',  // miles
  METERS: 'meters',      // meters/kilometers
};

/**
 * Unit configurations
 */
export const UNIT_CONFIG = {
  [UNIT_TYPES.METRIC]: {
    label: 'Kilometers',
    shortLabel: 'km',
    apiUnit: 'k',
    distanceThreshold: 1, // Show km if >= 1km, else show meters
  },
  [UNIT_TYPES.IMPERIAL]: {
    label: 'Miles',
    shortLabel: 'mi',
    apiUnit: 'm',
    distanceThreshold: 0.1, // Show miles if >= 0.1mi, else show feet
  },
  [UNIT_TYPES.METERS]: {
    label: 'Meters',
    shortLabel: 'm',
    apiUnit: 'k', // Use metric API, convert display
    distanceThreshold: 1000, // Always show in meters unless >= 1000m
  },
};

/**
 * Convert kilometers to other units
 */
export const convertDistance = (km, targetUnit) => {
  if (!km || typeof km !== 'number') return 0;
  
  switch (targetUnit) {
    case UNIT_TYPES.IMPERIAL:
      return km * 0.621371; // km to miles
    case UNIT_TYPES.METERS:
      return km * 1000; // km to meters
    case UNIT_TYPES.METRIC:
    default:
      return km;
  }
};

/**
 * Format distance with appropriate unit
 * @param {number} km - Distance in kilometers
 * @param {string} unitType - Target unit type
 * @param {number} decimals - Decimal places (default: 2)
 */
export const formatDistance = (km, unitType = UNIT_TYPES.METRIC, decimals = 2) => {
  if (!km || typeof km !== 'number') return '0';
  
  const config = UNIT_CONFIG[unitType] || UNIT_CONFIG[UNIT_TYPES.METRIC];
  
  switch (unitType) {
    case UNIT_TYPES.IMPERIAL: {
      const miles = km * 0.621371;
      if (miles < config.distanceThreshold) {
        const feet = miles * 5280;
        return `${Math.round(feet)} ft`;
      }
      return `${miles.toFixed(decimals)} mi`;
    }
    
    case UNIT_TYPES.METERS: {
      const meters = km * 1000;
      if (meters < config.distanceThreshold) {
        return `${Math.round(meters)} m`;
      }
      const displayKm = meters / 1000;
      return `${displayKm.toFixed(decimals)} km`;
    }
    
    case UNIT_TYPES.METRIC:
    default: {
      if (km < config.distanceThreshold) {
        const meters = km * 1000;
        return `${Math.round(meters)} m`;
      }
      return `${km.toFixed(decimals)} km`;
    }
  }
};

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @param {string} locale - Locale for formatting
 */
export const formatDuration = (seconds, locale = 'en-US') => {
  if (!seconds || typeof seconds !== 'number') return '0 min';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} h`);
  if (minutes > 0) parts.push(`${minutes} min`);
  if (secs > 0 && hours === 0) parts.push(`${secs} s`);
  
  return parts.join(' ') || '0 min';
};

/**
 * Get API unit parameter based on unit type
 */
export const getApiUnit = (unitType) => {
  const config = UNIT_CONFIG[unitType] || UNIT_CONFIG[UNIT_TYPES.METRIC];
  return config.apiUnit;
};

/**
 * Get unit label
 */
export const getUnitLabel = (unitType, short = false) => {
  const config = UNIT_CONFIG[unitType] || UNIT_CONFIG[UNIT_TYPES.METRIC];
  return short ? config.shortLabel : config.label;
};
