import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Heart, MapPin, Clock, Navigation, Loader2, Info, Footprints } from 'lucide-react';
import MapView from '../components/MapView';
import { walkAPI } from '../lib/api';
import { FEATURED_ROUTES, getCachedRouteData } from '../constants/featuredRoutes';
import '../styles/RouteDetail.css';

export default function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [featuredRoute, setFeaturedRoute] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadFeaturedRoute = async () => {
    setIsLoading(true);
    setError(null);

    // Find the featured route by ID
    const featured = FEATURED_ROUTES.find(r => r.id === parseInt(id));
    
    if (!featured) {
      setError('Route not found');
      setIsLoading(false);
      return;
    }

    setFeaturedRoute(featured);

    try {
      // Get cached route data (or fetch if not cached)
      const completeRouteData = await getCachedRouteData(
        parseInt(id),
        async (start, end, type, units) => {
          const response = await walkAPI.createWalkRoute(start, end, type, units);
          if (!response.success) {
            throw new Error('Failed to generate walking route');
          }
          return response;
        }
      );

      console.log('✅ Route loaded:', completeRouteData.preGenerated ? '(from cache)' : '(freshly generated)');
      setRouteData(completeRouteData);
      
      if (completeRouteData.error) {
        setError('Failed to load route map. Showing estimated route information.');
      }
    } catch (err) {
      console.error('❌ Error loading route:', err);
      setError('Failed to load route. Showing basic route information.');
      // Still show the featured route info even if loading fails
      setRouteData(featured);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && featuredRoute) {
      navigator.share({
        title: featuredRoute.name,
        text: featuredRoute.description,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: In production, save to backend
    const message = isFavorited ? 'Removed from favorites' : 'Added to favorites';
    console.log(message);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="route-detail-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          className="loading-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={64} style={{ color: 'var(--strava-orange)' }} />
          </motion.div>
          <h3 className="loading-title">
            🗺️ Generating Your Walking Route
          </h3>
          <p className="loading-description">
            Creating the optimal path from UST to your destination...
          </p>
          <motion.div
            className="loading-progress"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && !featuredRoute) {
    return (
      <div className="route-detail-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          style={{ textAlign: 'center', padding: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Info size={64} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Route Not Found</h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          <button className="back-button" onClick={() => {
            navigate('/');
            setTimeout(() => {
              const featuredSection = document.getElementById('featured-routes');
              if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}>
            <ArrowLeft size={18} />
            Featured Routes
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="route-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
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

      <div className="route-detail-container">
        {/* Back Button */}
        <motion.button
          className="back-button"
          onClick={() => {
            navigate('/');
            setTimeout(() => {
              const featuredSection = document.getElementById('featured-routes');
              if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          Featured Routes
        </motion.button>

        {/* Page Header with Route Info */}
        <motion.div
          className="route-detail-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="route-detail-header-content">
            <div className="route-detail-info">
              <h1 className="route-detail-title">
                {featuredRoute?.name || 'Featured Route'}
              </h1>
              <p className="route-detail-description">
                {featuredRoute?.description}
              </p>
              
              {/* Route Stats */}
              <div className="route-stats">
                <div className="route-stat">
                  <MapPin size={20} />
                  <span>
                    {routeData?.distance ? `${routeData.distance.toFixed(2)} km` : `${featuredRoute?.distance} km`}
                  </span>
                </div>
                <div className="route-stat">
                  <Clock size={20} />
                  <span>
                    {routeData?.formattedTime || `${featuredRoute?.duration} min`}
                  </span>
                </div>
                <div className="route-stat">
                  <Footprints size={20} />
                  <span>{featuredRoute?.type || 'Walking'}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="route-actions">
              <motion.button
                className={`action-button favorite ${isFavorited ? 'active' : ''}`}
                onClick={handleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={18} fill={isFavorited ? 'white' : 'none'} />
                {isFavorited ? 'Saved' : 'Save'}
              </motion.button>
              
              <motion.button
                className="action-button share"
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={18} />
                Share
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && featuredRoute && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Info size={20} />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="route-detail-grid">
          
          {/* Map Section */}
          <motion.div
            className="map-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="map-section-header">
              <h3 className="map-section-title">
                <Navigation size={24} />
                Walking Route
              </h3>
              <p className="map-section-description">
                View your path on the interactive map below
              </p>
            </div>

            <div className="map-container">
              {routeData ? (
                <MapView route={routeData} />
              ) : (
                <div className="map-unavailable">
                  <p>Map unavailable</p>
                </div>
              )}
            </div>

            {/* Route Information - Below Map */}
            <div className="route-info-below-map">
              {/* Start Location */}
              <div className="location-info">
                <div className="location-label start">
                  <MapPin size={18} />
                  <span>Start Point</span>
                </div>
                <p className="location-text">
                  {featuredRoute?.startLocation}
                </p>
              </div>

              {/* End Location */}
              <div className="location-info">
                <div className="location-label destination">
                  <MapPin size={18} />
                  <span>Destination</span>
                </div>
                <p className="location-text">
                  {featuredRoute?.endLocation}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Turn-by-Turn Directions Section */}
          {routeData?.steps && routeData.steps.length > 0 && (
            <motion.div
              className="route-details-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Turn-by-Turn Directions */}
              <div className="directions-section">
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
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
