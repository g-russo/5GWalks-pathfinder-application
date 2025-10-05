import { useEffect, useRef, useState } from 'react';

export default function MapView({ route }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); // Store map instance
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapRef.current || !route) return;

    // Prevent double initialization
    if (mapInstanceRef.current) {
      return;
    }

    // Load MapQuest Leaflet library
    const loadMapQuestLibrary = () => {
      // Check if script already exists
      if (document.getElementById('mapquest-js')) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);

      // Load Leaflet JS
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.onload = () => {
        // Load MapQuest CSS
        const mapquestCSS = document.createElement('link');
        mapquestCSS.rel = 'stylesheet';
        mapquestCSS.href = 'https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.css';
        document.head.appendChild(mapquestCSS);

        // Load MapQuest JS
        const mapquestScript = document.createElement('script');
        mapquestScript.id = 'mapquest-js';
        mapquestScript.src = 'https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.js';
        mapquestScript.onload = initializeMap;
        document.head.appendChild(mapquestScript);
      };
      document.head.appendChild(leafletScript);
    };

    const initializeMap = () => {
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;

      try {
        console.log('🗺️ Initializing map with route data:', route);
        console.log('📍 Shape points:', route.shape);
        console.log('📌 Locations:', route.locations);
        
        // Get the API key
        const apiKey = import.meta.env.VITE_MAPQUEST_API_KEY || 'bwZXOjnaffJU1JrjI2qV6cLJPtinN1D6';
        
        // Set the API key globally for MapQuest
        if (window.L.mapquest) {
          window.L.mapquest.key = apiKey;
        }
        
        // Initialize the map with API key
        const map = window.L.mapquest.map(mapRef.current, {
          center: route.locations && route.locations[0] 
            ? [route.locations[0].lat, route.locations[0].lng]
            : [40.7128, -74.0060],
          layers: window.L.mapquest.tileLayer('map', {
            key: apiKey
          }),
          zoom: 13
        });

        // Store map instance
        mapInstanceRef.current = map;

        // Add route polyline if shape points exist
        console.log('🔍 Checking if shape exists:', route.shape, 'Length:', route.shape?.length);
        if (route.shape && route.shape.length > 0) {
          console.log('✅ Creating polyline with', route.shape.length, 'points');
          const polyline = window.L.polyline(route.shape, {
            color: '#FC4C02',
            weight: 5,
            opacity: 0.8,
            smoothFactor: 1
          }).addTo(map);
          
          console.log('✅ Polyline added to map');

          // Fit map to route bounds
          map.fitBounds(polyline.getBounds(), {
            padding: [50, 50]
          });

          // Add markers for start and end
          if (route.locations && route.locations.length >= 2) {
            // Start marker (green)
            window.L.marker([route.locations[0].lat, route.locations[0].lng], {
              icon: window.L.mapquest.icons.marker({
                primaryColor: '#22c55e',
                secondaryColor: '#16a34a',
                shadow: true
              })
            }).addTo(map)
              .bindPopup(`<strong>Start:</strong> ${route.locations[0].display}`);

            // End marker (red)
            const lastIndex = route.locations.length - 1;
            window.L.marker([route.locations[lastIndex].lat, route.locations[lastIndex].lng], {
              icon: window.L.mapquest.icons.marker({
                primaryColor: '#ef4444',
                secondaryColor: '#dc2626',
                shadow: true
              })
            }).addTo(map)
              .bindPopup(`<strong>End:</strong> ${route.locations[lastIndex].display}`);
          }
        } else {
          console.log('⚠️ No shape points found, attempting alternative route display');
          
          // Alternative: Use MapQuest Directions API to draw route
          if (route.locations && route.locations.length >= 2 && route.startLocation && route.endLocation) {
            console.log('🔄 Using directions layer fallback');
            
            window.L.mapquest.directions().route({
              start: route.startLocation,
              end: route.endLocation,
              options: {
                routeType: 'pedestrian',
                enhancedNarrative: true,
                locale: 'en_US',
                unit: route.units === 'km' ? 'k' : 'm'
              }
            });
            
            // Add markers for start/end
            if (route.locations[0]) {
              window.L.marker([route.locations[0].lat, route.locations[0].lng], {
                icon: window.L.mapquest.icons.marker({
                  primaryColor: '#22c55e',
                  shadow: true
                })
              }).addTo(map).bindPopup(`<strong>Start:</strong> ${route.locations[0].display}`);
            }
            
            if (route.locations[1]) {
              window.L.marker([route.locations[1].lat, route.locations[1].lng], {
                icon: window.L.mapquest.icons.marker({
                  primaryColor: '#ef4444',
                  shadow: true
                })
              }).addTo(map).bindPopup(`<strong>End:</strong> ${route.locations[1].display}`);
            }
          }
        }

        setMapLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError(error.message);
        
        // Show error state
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="map-error" style="padding: 2rem; text-align: center; background: rgba(239, 68, 68, 0.1); border-radius: 12px;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
              <p style="color: #ef4444; font-weight: 600; margin-bottom: 0.5rem;">Unable to load map</p>
              <p style="color: #6b7280; font-size: 0.875rem;">
                ${error.message.includes('API Key') 
                  ? 'API configuration issue. Please contact support.' 
                  : 'If you have an ad blocker enabled, please allow MapQuest tiles to load.'}
              </p>
            </div>
          `;
        }
      }
    };

    loadMapQuestLibrary();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [route]);

  // If no route data, show placeholder
  if (!route) {
    return (
      <div ref={mapRef} className="map-container map-placeholder-simple">
        <div className="map-placeholder-content">
          <div className="placeholder-icon">🗺️</div>
          <h3>Map Preview</h3>
          <p>Your route will be visualized here</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="map-container" style={{ width: '100%', height: '100%', minHeight: '400px' }}></div>
  );
}
