import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';

export default function MapView({ route, center, zoom = 13 }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize MapQuest map
    const initMap = () => {
      // This is a placeholder. In production, you would use the actual MapQuest API
      // Example: L.mapquest.map(mapRef.current, { ... });
      
      console.log('Initializing map with:', { route, center, zoom });
      
      // For now, display a placeholder
      if (mapRef.current && !mapInstance) {
        const placeholder = document.createElement('div');
        placeholder.className = 'map-placeholder';
        placeholder.innerHTML = `
          <div class="map-placeholder-content">
            <h3>Map View</h3>
            <p>MapQuest map will be rendered here</p>
            ${route ? `<p>Route: ${route.name}</p>` : ''}
            ${center ? `<p>Center: ${center.lat}, ${center.lng}</p>` : ''}
          </div>
        `;
        mapRef.current.appendChild(placeholder);
        setMapInstance(true);
      }
    };

    initMap();

    return () => {
      // Cleanup map instance if needed
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [route, center, zoom, mapInstance]);

  return (
    <Card className="map-view-container">
      <div 
        ref={mapRef} 
        className="map-view"
        style={{
          width: '100%',
          height: '400px',
          minHeight: '300px',
          position: 'relative',
          borderRadius: '0.5rem',
          overflow: 'hidden',
        }}
      />
    </Card>
  );
}
