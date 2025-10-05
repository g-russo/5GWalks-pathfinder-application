import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Loader2, AlertCircle, MapPin, Clock } from 'lucide-react';
import RouteForm from '../components/RouteForm';
import MapView from '../components/MapView';
import { mapQuestAPI, routesAPI } from '../lib/api';
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
      // Get directions from MapQuest
      const directions = await mapQuestAPI.getDirections(
        formData.startLocation,
        formData.endLocation,
        { routeType: formData.routeType }
      );

      // Extract route information
      const route = directions.route;
      const newRouteData = {
        ...formData,
        distance: route.distance,
        duration: route.time / 60, // Convert to minutes
        shape: route.shape,
        legs: route.legs,
      };

      setRouteData(newRouteData);
    } catch (err) {
      console.error('Error generating route:', err);
      setError('Failed to generate route. Please check your locations and try again.');
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
          <h1 className="create-title">Create Your Route</h1>
          <p className="create-subtitle">
            Design the perfect walking route. Set your starting point, destination, and let us handle the rest.
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
                    <h3>Generating Route</h3>
                    <p>Finding the best path for your journey...</p>
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
                          <span>{routeData.distance.toFixed(2)} km</span>
                        </div>
                        <div className="stat">
                          <Clock size={16} />
                          <span>{Math.round(routeData.duration)} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="map-container">
                      <MapView route={routeData} />
                    </div>

                    <motion.button
                      className="btn-save-route"
                      onClick={handleSaveRoute}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                      <MapPin size={48} />
                    </div>
                    <h3>Your Route Will Appear Here</h3>
                    <p>Fill in the form to generate your walking route and see it come to life on the map.</p>
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
