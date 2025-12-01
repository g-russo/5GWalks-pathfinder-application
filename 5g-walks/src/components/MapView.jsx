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
        
        // Initialize the map with Leaflet (not MapQuest)
        const map = window.L.map(mapRef.current, {
          center: route.locations && route.locations[0] 
            ? [route.locations[0].lat, route.locations[0].lng]
            : [14.5995, 120.9842], // Default to Manila
          zoom: 13,
          zoomControl: true
        });

        // Add OpenStreetMap tile layer (free and reliable)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

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
            // Start marker (green) - labeled as "START"
            const startIcon = window.L.divIcon({
              html: `
                <div style="position: relative;">
                  <div style="
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  ">
                    <span style="transform: rotate(45deg); font-weight: bold; font-size: 11px;">S</span>
                  </div>
                </div>
              `,
              className: '',
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [0, -36]
            });
            
            window.L.marker([route.locations[0].lat, route.locations[0].lng], {
              icon: startIcon
            }).addTo(map)
              .bindPopup(`
                <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
                  <div style="font-weight: bold; color: #22c55e; margin-bottom: 8px; font-size: 14px;">START POINT</div>
                  <div style="color: #374151; font-size: 13px;">${route.locations[0].display}</div>
                </div>
              `);

            // Waypoint markers (orange) - numbered stops
            if (route.locations.length > 2) {
              for (let i = 1; i < route.locations.length - 1; i++) {
                const stopNumber = i;
                const waypointIcon = window.L.divIcon({
                  html: `
                    <div style="position: relative;">
                      <div style="
                        background: linear-gradient(135deg, #FC4C02 0%, #CC4200 100%);
                        color: white;
                        width: 36px;
                        height: 36px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                      ">
                        <span style="transform: rotate(45deg); font-weight: bold; font-size: 14px;">${stopNumber}</span>
                      </div>
                    </div>
                  `,
                  className: '',
                  iconSize: [36, 36],
                  iconAnchor: [18, 36],
                  popupAnchor: [0, -36]
                });
                
                window.L.marker([route.locations[i].lat, route.locations[i].lng], {
                  icon: waypointIcon
                }).addTo(map)
                  .bindPopup(`
                    <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
                      <div style="font-weight: bold; color: #FC4C02; margin-bottom: 8px; font-size: 14px;">STOP ${stopNumber}</div>
                      <div style="color: #374151; font-size: 13px;">${route.locations[i].display}</div>
                    </div>
                  `);
              }
            }

            // End marker (red) - labeled as "END"
            const lastIndex = route.locations.length - 1;
            const endIcon = window.L.divIcon({
              html: `
                <div style="position: relative;">
                  <div style="
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  ">
                    <span style="transform: rotate(45deg); font-weight: bold; font-size: 11px;">E</span>
                  </div>
                </div>
              `,
              className: '',
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [0, -36]
            });
            
            window.L.marker([route.locations[lastIndex].lat, route.locations[lastIndex].lng], {
              icon: endIcon
            }).addTo(map)
              .bindPopup(`
                <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
                  <div style="font-weight: bold; color: #ef4444; margin-bottom: 8px; font-size: 14px;">END POINT</div>
                  <div style="color: #374151; font-size: 13px;">${route.locations[lastIndex].display}</div>
                </div>
              `);
          }
        } else {
          console.log('⚠️ No shape points found, attempting alternative route display');
          
          // Alternative: Add markers only (if no route shape available)
          if (route.locations && route.locations.length >= 2) {
            console.log('📍 Adding markers for all locations');
            
            // Start marker
            const startIcon = window.L.divIcon({
              html: `
                <div style="position: relative;">
                  <div style="
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  ">
                    <span style="transform: rotate(45deg); font-weight: bold; font-size: 11px;">S</span>
                  </div>
                </div>
              `,
              className: '',
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [0, -36]
            });
            
            window.L.marker([route.locations[0].lat, route.locations[0].lng], {
              icon: startIcon
            }).addTo(map)
              .bindPopup(`
                <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
                  <div style="font-weight: bold; color: #22c55e; margin-bottom: 8px; font-size: 14px;">START POINT</div>
                  <div style="color: #374151; font-size: 13px;">${route.locations[0].display}</div>
                </div>
              `);
            
            // Waypoint markers (if any)
            if (route.locations.length > 2) {
              for (let i = 1; i < route.locations.length - 1; i++) {
                const stopNumber = i;
                const waypointIcon = window.L.divIcon({
                  html: `
                    <div style="position: relative;">
                      <div style="
                        background: linear-gradient(135deg, #FC4C02 0%, #CC4200 100%);
                        color: white;
                        width: 36px;
                        height: 36px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                      ">
                        <span style="transform: rotate(45deg); font-weight: bold; font-size: 14px;">${stopNumber}</span>
                      </div>
                    </div>
                  `,
                  className: '',
                  iconSize: [36, 36],
                  iconAnchor: [18, 36],
                  popupAnchor: [0, -36]
                });
                
                window.L.marker([route.locations[i].lat, route.locations[i].lng], {
                  icon: waypointIcon
                }).addTo(map)
                  .bindPopup(`
                    <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
                      <div style="font-weight: bold; color: #FC4C02; margin-bottom: 8px; font-size: 14px;">STOP ${stopNumber}</div>
                      <div style="color: #374151; font-size: 13px;">${route.locations[i].display}</div>
                    </div>
                  `);
              }
            }
            
            // End marker
            const lastIndex = route.locations.length - 1;
            const endIcon = window.L.divIcon({
              html: `
                <div style="position: relative;">
                  <div style="
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  ">
                    <span style="transform: rotate(45deg); font-weight: bold; font-size: 11px;">E</span>
                  </div>
                </div>
              `,
              className: '',
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [0, -36]
            });
            
            window.L.marker([route.locations[lastIndex].lat, route.locations[lastIndex].lng], {
              icon: endIcon
            }).addTo(map)
              .bindPopup(`
                <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
                  <div style="font-weight: bold; color: #ef4444; margin-bottom: 8px; font-size: 14px;">END POINT</div>
                  <div style="color: #374151; font-size: 13px;">${route.locations[lastIndex].display}</div>
                </div>
              `);

            // Fit map to all markers
            const bounds = window.L.latLngBounds(
              route.locations.map(loc => [loc.lat, loc.lng])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
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
