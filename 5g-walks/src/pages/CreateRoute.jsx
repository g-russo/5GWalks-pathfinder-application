import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Loader2, AlertCircle, MapPin, Clock, Footprints, Navigation } from 'lucide-react';
import RouteForm from '../components/RouteForm';
import MapView from '../components/MapView';
import { walkAPI, routesAPI } from '../lib/api';
import '../styles/CreateRoute.css';

export default function CreateRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create walking route using the backend /walk endpoint
      const walkResponse = await walkAPI.createWalkRoute(
        formData.startLocation,
        formData.endLocation,
        formData.routeType,
        'metric' // Using metric system (kilometers)
      );

      // Check if the API call was successful
      if (!walkResponse.success) {
        throw new Error('Failed to generate walking route');
      }

      // Extract route information
      const newRouteData = {
        ...formData,
        distance: walkResponse.distance || 0,
        duration: walkResponse.time_seconds ? walkResponse.time_seconds / 60 : 0, // Convert to minutes
        formattedTime: walkResponse.formatted_time || 'N/A',
        shape: walkResponse.shape || [],
        steps: walkResponse.steps || [],
        locations: walkResponse.locations || [],
        staticMapUrl: walkResponse.static_map_url,
        directionsLink: walkResponse.directions_link,
        units: walkResponse.units || 'km',
      };

      console.log('Route data received:', newRouteData); // Debug log
      setRouteData(newRouteData);
    } catch (err) {
      console.error('Error generating walking route:', err);
      setError(err.response?.data?.detail || 'Failed to generate walking route. Please check your locations and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!routeData) return;

    try {
      const response = await routesAPI.createRoute(routeData);
      navigate(`/route/${response.data.id}`);
    } catch (err) {
      console.error('Error saving route:', err);
      setError('Failed to save route. Please try again.');
    }
  };

  return (
    <div className="create-route-page">
      <div className="create-container">
        {/* Page Header */}
        <motion.div
          className="create-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="create-title">Create Your Walking Route</h1>
          <p className="create-subtitle">
            Design the perfect walking or running route. Set your starting point, destination, and we'll find the optimal path for you.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="create-grid">
          {/* Left Column - Form */}
          <motion.div
            className="form-column"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="form-wrapper">
              <RouteForm
                onSubmit={handleFormSubmit}
                initialData={location.state}
              />

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="error-banner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AlertCircle size={18} />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column - Map Preview */}
          <motion.div
            className="map-column"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="map-wrapper">
              <AnimatePresence mode="wait">
                {/* Loading State */}
                {isLoading && (
                  <motion.div
                    key="loading"
                    className="map-state loading-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="spinner" size={48} />
                    <h3>Generating Walking Route</h3>
                    <p>Finding the optimal pedestrian path for your journey...</p>
                  </motion.div>
                )}

                {/* Route Preview */}
                {routeData && !isLoading && (
                  <motion.div
                    key="preview"
                    className="route-preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="preview-header">
                      <h3>Route Preview</h3>
                      <div className="route-stats">
                        <div className="stat">
                          <MapPin size={16} />
                          <span>{routeData?.distance ? routeData.distance.toFixed(2) : '0.00'} km</span>
                        </div>
                        <div className="stat">
                          <Clock size={16} />
                          <span>{routeData?.duration ? Math.round(routeData.duration) : 0} min</span>
                        </div>
                        <div className="stat">
                          <Footprints size={16} />
                          <span>{routeData?.routeType || 'Walking'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Route Locations Info */}
                    {(routeData?.startLocation || routeData?.endLocation) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        style={{
                          padding: '1rem',
                          background: '#f9fafb',
                          borderRadius: '12px',
                          marginBottom: '1rem',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        {routeData.startLocation && (
                          <div style={{ marginBottom: '0.75rem' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              marginBottom: '0.25rem'
                            }}>
                              <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#22c55e',
                              }} />
                              <span style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Start Point
                              </span>
                            </div>
                            <p style={{ 
                              margin: 0, 
                              paddingLeft: '1.25rem',
                              fontSize: '0.9rem',
                              color: 'var(--jet-black)',
                              fontWeight: 500,
                            }}>
                              {routeData.startLocation}
                            </p>
                          </div>
                        )}
                        {routeData.endLocation && (
                          <div>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              marginBottom: '0.25rem'
                            }}>
                              <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#ef4444',
                              }} />
                              <span style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Destination
                              </span>
                            </div>
                            <p style={{ 
                              margin: 0, 
                              paddingLeft: '1.25rem',
                              fontSize: '0.9rem',
                              color: 'var(--jet-black)',
                              fontWeight: 500,
                            }}>
                              {routeData.endLocation}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    <div className="map-container">
                      <MapView route={routeData} />
                    </div>

                    {/* Turn-by-Turn Directions */}
                    {routeData?.steps && routeData.steps.length > 0 && (
                      <motion.div
                        className="directions-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        style={{
                          marginTop: '2rem',
                          padding: '1.5rem',
                          background: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          marginBottom: '1.5rem',
                          paddingBottom: '1rem',
                          borderBottom: '2px solid #f3f4f6'
                        }}>
                          <Navigation size={24} style={{ color: 'var(--strava-orange)' }} />
                          <h3 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 700, 
                            margin: 0,
                            color: 'var(--jet-black)'
                          }}>
                            Turn-by-Turn Directions
                          </h3>
                        </div>
                        
                        <div style={{ 
                          maxHeight: '500px', 
                          overflowY: 'auto',
                          paddingRight: '0.5rem'
                        }}>
                          {routeData.steps.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1rem',
                                background: index % 2 === 0 ? '#f9fafb' : 'white',
                                borderRadius: '12px',
                                marginBottom: '0.75rem',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s ease',
                              }}
                              whileHover={{ 
                                scale: 1.01,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                              }}
                            >
                              <div style={{
                                minWidth: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--strava-orange) 0%, #ff6b35 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                boxShadow: '0 2px 8px rgba(252, 76, 2, 0.3)',
                                flexShrink: 0,
                              }}>
                                {index + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ 
                                  margin: '0 0 0.5rem 0', 
                                  fontSize: '0.95rem', 
                                  lineHeight: '1.6',
                                  color: 'var(--jet-black)',
                                  fontWeight: 500,
                                }}>
                                  {step.narrative.replace(/Go for[^.]*\.?\s*/gi, '')}
                                </p>
                                {typeof step.distance === 'number' && (
                                  <div style={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.25rem 0.75rem',
                                    background: '#f3f4f6',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                    fontWeight: 600,
                                  }}>
                                    <MapPin size={14} />
                                    {step.distance < 0.1 
                                      ? '0.00 m'
                                      : step.distance < 1 
                                        ? `${Math.round(step.distance * 1000)} m` 
                                        : `${step.distance.toFixed(2)} km`}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      className="btn-save-route"
                      onClick={handleSaveRoute}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ marginTop: '1.5rem' }}
                    >
                      <Save size={18} />
                      <span>Save This Route</span>
                    </motion.button>
                  </motion.div>
                )}

                {/* Empty State */}
                {!routeData && !isLoading && (
                  <motion.div
                    key="empty"
                    className="map-state empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="empty-icon">
                      <Footprints size={48} />
                    </div>
                    <h3>Your Walking Route Will Appear Here</h3>
                    <p>Fill in the form to generate your optimal walking or running route and see it visualized on the map.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
