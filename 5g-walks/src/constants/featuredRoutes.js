// Featured walking routes starting from University of Santo Tomas - Manila
// Pre-generated route data for instant loading

export const FEATURED_ROUTES = [
  {
    id: 1,
    name: 'UST to BGC Skyline Walk',
    description: 'From historic UST campus to modern Bonifacio Global City with stunning high-rise views',
    distance: 8.5,
    duration: 105,
    type: 'Walking',
    startLocation: 'University of Santo Tomas, España Boulevard, Manila',
    endLocation: 'Bonifacio Global City, Taguig',
    image: '/featured-routes/bgc.webp',
    // Pre-generated route data will be fetched on first load
    preGenerated: false,
  },
  {
    id: 2,
    name: 'UST to Rizal Park Heritage Trail',
    description: 'Walk from UST to historic Luneta featuring monuments and lush gardens',
    distance: 4.2,
    duration: 55,
    type: 'Walking',
    startLocation: 'University of Santo Tomas, España Boulevard, Manila',
    endLocation: 'Rizal Park, Manila',
    image: '/featured-routes/luneta-park.webp',
    preGenerated: false,
  },
  {
    id: 3,
    name: 'UST to Ayala Triangle Gardens',
    description: 'Journey from UST to peaceful urban oasis in Makati business district',
    distance: 7.8,
    duration: 95,
    type: 'Walking',
    startLocation: 'University of Santo Tomas, España Boulevard, Manila',
    endLocation: 'Ayala Triangle Gardens, Makati',
    image: '/featured-routes/ayala-triangle.webp',
    preGenerated: false,
  },
  {
    id: 4,
    name: 'UST to Manila Bay Sunset Promenade',
    description: 'Scenic route from UST to waterfront walk along Roxas Boulevard with bay views',
    distance: 5.5,
    duration: 70,
    type: 'Walking',
    startLocation: 'University of Santo Tomas, España Boulevard, Manila',
    endLocation: 'Manila Bay, Roxas Boulevard, Manila',
    image: '/featured-routes/manila-bay.webp',
    preGenerated: false,
  },
  {
    id: 5,
    name: 'UST to UP Diliman Academic Oval',
    description: 'Cross-city walk from UST to tree-lined university route in Quezon City',
    distance: 6.5,
    duration: 80,
    type: 'Walking',
    startLocation: 'University of Santo Tomas, España Boulevard, Manila',
    endLocation: 'UP Diliman Academic Oval, Quezon City',
    image: '/featured-routes/up-diliman.webp',
    preGenerated: false,
  },
  {
    id: 6,
    name: 'UST to Intramuros Walled City',
    description: 'Historic journey from UST to colonial-era fortified city with Spanish architecture',
    distance: 3.8,
    duration: 50,
    type: 'Walking',
    startLocation: 'University of Santo Tomas, España Boulevard, Manila',
    endLocation: 'Fort Santiago, Manila',
    image: '/featured-routes/intramuros.webp',
    preGenerated: false,
  },
];

// Cache for storing pre-generated route data
const routeCache = new Map();

/**
 * Get cached route data or fetch from API
 * @param {number} routeId - The ID of the featured route
 * @param {Function} fetchFunction - The API function to fetch route data
 * @returns {Promise<Object>} Complete route data with shape, steps, etc.
 */
export async function getCachedRouteData(routeId, fetchFunction) {
  const cacheKey = `route_${routeId}`;
  
  // Check if we have cached data
  if (routeCache.has(cacheKey)) {
    console.log('✅ Using cached route data for route:', routeId);
    return routeCache.get(cacheKey);
  }

  // Find the featured route
  const featuredRoute = FEATURED_ROUTES.find(r => r.id === routeId);
  if (!featuredRoute) {
    throw new Error('Route not found');
  }

  console.log('🔄 Fetching fresh route data for:', featuredRoute.name);
  
  try {
    // Fetch route data from API
    const routeData = await fetchFunction(
      featuredRoute.startLocation,
      featuredRoute.endLocation,
      'walking',
      'metric'
    );

    // Combine featured route info with API response
    const completeRouteData = {
      ...featuredRoute,
      distance: routeData.distance || featuredRoute.distance,
      duration: routeData.time_seconds ? routeData.time_seconds / 60 : featuredRoute.duration,
      formattedTime: routeData.formatted_time || `${featuredRoute.duration} min`,
      shape: routeData.shape || [],
      steps: routeData.steps || [],
      locations: routeData.locations || [],
      staticMapUrl: routeData.static_map_url,
      directionsLink: routeData.directions_link,
      units: routeData.units || 'km',
      preGenerated: true,
      cachedAt: new Date().toISOString(),
    };

    // Store in cache
    routeCache.set(cacheKey, completeRouteData);
    console.log('💾 Cached route data for:', featuredRoute.name);

    return completeRouteData;
  } catch (error) {
    console.error('❌ Error fetching route data:', error);
    // Return featured route data without map details
    return {
      ...featuredRoute,
      error: 'Failed to load route map',
    };
  }
}

/**
 * Pre-generate and cache all featured routes
 * Call this on app initialization to warm up the cache
 * @param {Function} fetchFunction - The API function to fetch route data
 */
export async function preGenerateAllRoutes(fetchFunction) {
  console.log('🚀 Pre-generating all featured routes...');
  
  const promises = FEATURED_ROUTES.map(route => 
    getCachedRouteData(route.id, fetchFunction).catch(err => {
      console.error(`Failed to pre-generate route ${route.id}:`, err);
      return null;
    })
  );

  await Promise.all(promises);
  console.log('✅ All featured routes pre-generated!');
}

/**
 * Clear the route cache (useful for development/testing)
 */
export function clearRouteCache() {
  routeCache.clear();
  console.log('🗑️ Route cache cleared');
}
