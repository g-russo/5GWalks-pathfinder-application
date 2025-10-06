import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Loader2, AlertCircle, MapPin, Clock, Footprints, Navigation, Route as RouteIcon } from 'lucide-react';
import RouteForm from '../components/RouteForm';
import MapView from '../components/MapView';
import DotGrid from '../components/DotGrid';
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
      {/* Grid Background with Glowing Lines */}
      <div className="grid-background">
        <div className="grid-pattern"></div>
        {/* Horizontal glowing lines */}
        <div className="glow-line glow-line-horizontal glow-line-1"></div>
        <div className="glow-line glow-line-horizontal glow-line-2"></div>
        <div className="glow-line glow-line-horizontal glow-line-3"></div>
        {/* Vertical glowing lines */}
        <div className="glow-line glow-line-vertical glow-line-4"></div>
        <div className="glow-line glow-line-vertical glow-line-5"></div>
        <div className="glow-line glow-line-vertical glow-line-6"></div>
      </div>

      {/* Hero Section */}
      <section className="create-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>

        {/* Interactive DotGrid Layer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#332e2e"
            baseOpacity={0.3}
            activeColor="#CC4200"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        <div className="create-hero-container">
          <motion.div
            className="create-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="create-hero-icon">
              <RouteIcon size={48} />
            </div>
            <h1 className="create-hero-title">
              <span className="title-white">Create Your</span> <span className="text-gradient">Walking Route</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="create-section">
        <div className="create-container">

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
                    <h3>Generating Route</h3>
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
                      <h3><Navigation size={24} />Route Details</h3>
                      <p className="preview-description">View your path on the interactive map below</p>
                    </div>

                    <div className="route-stats-preview">
                      <div className="stat">
                        <MapPin size={18} />
                        <span>{routeData?.distance ? routeData.distance.toFixed(2) : '0.00'} km</span>
                      </div>
                      <div className="stat">
                        <Clock size={18} />
                        <span>{routeData?.duration ? Math.round(routeData.duration) : 0} min</span>
                      </div>
                      <div className="stat">
                        <Footprints size={18} />
                        <span>{routeData?.routeType || 'Walking'}</span>
                      </div>
                    </div>

                    <div className="map-container">
                      <MapView route={routeData} />
                    </div>

                    {/* Route Locations Info - Below Map */}
                    {(routeData?.startLocation || routeData?.endLocation) && (
                      <div className="route-info-below-map">
                        {routeData.startLocation && (
                          <div className="location-info">
                            <div className="location-label start">
                              <MapPin size={18} />
                              <span>Start Point</span>
                            </div>
                            <p className="location-text">
                              {routeData.startLocation}
                            </p>
                          </div>
                        )}
                        {routeData.endLocation && (
                          <div className="location-info">
                            <div className="location-label destination">
                              <MapPin size={18} />
                              <span>Destination</span>
                            </div>
                            <p className="location-text">
                              {routeData.endLocation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Turn-by-Turn Directions */}
                    {routeData?.steps && routeData.steps.length > 0 && (
                      <motion.div
                        className="directions-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <div className="directions-header">
                          <Navigation size={20} />
                          <span>Turn-by-Turn Directions</span>
                        </div>
                        
                        <div className="directions-list">
                          {routeData.steps.map((step, index) => (
                            <div 
                              key={index}
                              className="direction-step"
                            >
                              <div className="step-number">
                                {index + 1}
                              </div>
                              <div className="step-content">
                                <p className="step-narrative">
                                  {step.narrative.replace(/Go for[^.]*\.?\s*/gi, '')}
                                </p>
                                {typeof step.distance === 'number' && step.distance >= 0.05 && (
                                  <p className="step-distance">
                                    {step.distance < 1 
                                      ? `${Math.round(step.distance * 1000)} m` 
                                      : `${step.distance.toFixed(2)} km`}
                                  </p>
                                )}
                              </div>
                            </div>
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
      </section>
    </div>
  );
}
