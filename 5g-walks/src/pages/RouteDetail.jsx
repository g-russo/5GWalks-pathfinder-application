import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Heart, MapPin, Clock, Navigation, Loader2, Info, Footprints } from 'lucide-react';
import MapView from '../components/MapView';
import { walkAPI } from '../lib/api';
import { FEATURED_ROUTES, getCachedRouteData } from '../constants/featuredRoutes';
import '../styles/CreateRoute.css';

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
      <div className="create-route-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <motion.div
          className="loading-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ display: 'inline-block', marginBottom: '1.5rem' }}
          >
            <Loader2 size={64} style={{ color: 'var(--strava-orange)' }} />
          </motion.div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--jet-black)', marginBottom: '0.75rem' }}>
            🗺️ Generating Your Walking Route
          </h3>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
            Creating the optimal path from UST to your destination...
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, var(--strava-orange), #ff8c42)',
              borderRadius: '2px',
              marginTop: '1.5rem'
            }}
          />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && !featuredRoute) {
    return (
      <div className="create-route-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          style={{ textAlign: 'center', padding: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Info size={64} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Route Not Found</h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="create-route-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="create-container">
        {/* Back Button */}
        <motion.button
          className="back-button"
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'transparent',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            color: 'var(--jet-black)',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '2rem',
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>

        {/* Page Header with Route Info */}
        <motion.div
          className="create-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h1 className="create-title" style={{ marginBottom: '0.75rem' }}>
                {featuredRoute?.name || 'Featured Route'}
              </h1>
              <p className="create-subtitle" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                {featuredRoute?.description}
              </p>
              
              {/* Route Stats */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} style={{ color: 'var(--strava-orange)' }} />
                  <span style={{ fontWeight: 600 }}>
                    {routeData?.distance ? `${routeData.distance.toFixed(2)} km` : `${featuredRoute?.distance} km`}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} style={{ color: 'var(--strava-orange)' }} />
                  <span style={{ fontWeight: 600 }}>
                    {routeData?.formattedTime || `${featuredRoute?.duration} min`}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Footprints size={20} style={{ color: 'var(--strava-orange)' }} />
                  <span style={{ fontWeight: 600 }}>{featuredRoute?.type || 'Walking'}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <motion.button
                onClick={handleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: isFavorited ? 'var(--strava-orange)' : 'white',
                  border: '2px solid var(--strava-orange)',
                  borderRadius: '12px',
                  color: isFavorited ? 'white' : 'var(--strava-orange)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Heart size={18} fill={isFavorited ? 'white' : 'none'} />
                {isFavorited ? 'Saved' : 'Save'}
              </motion.button>
              
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  color: 'var(--jet-black)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '1rem',
                background: '#FFF4E6',
                border: '2px solid #FFD699',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Info size={20} style={{ color: '#FF6B00', flexShrink: 0 }} />
              <p style={{ color: '#8B4000', margin: 0 }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="create-grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Map Section */}
          <motion.div
            className="preview-column"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="preview-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={24} style={{ color: 'var(--strava-orange)' }} />
                Walking Route
              </h3>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                View your path on the interactive map below
              </p>
            </div>

            <div className="map-container" style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '500px' }}>
              {routeData ? (
                <MapView route={routeData} />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '500px',
                  background: '#f3f4f6',
                  color: '#6b7280'
                }}>
                  <p>Map unavailable</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Route Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={24} style={{ color: 'var(--strava-orange)' }} />
              Route Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Start Location */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={18} style={{ color: '#22c55e' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase' }}>
                    Start Point
                  </span>
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: 500, margin: 0, paddingLeft: '1.625rem' }}>
                  {featuredRoute?.startLocation}
                </p>
              </div>

              {/* End Location */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={18} style={{ color: '#ef4444' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase' }}>
                    Destination
                  </span>
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: 500, margin: 0, paddingLeft: '1.625rem' }}>
                  {featuredRoute?.endLocation}
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#e5e7eb', margin: '0.5rem 0' }} />

              {/* Turn-by-Turn Directions */}
              {routeData?.steps && routeData.steps.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Navigation size={20} style={{ color: 'var(--strava-orange)' }} />
                    <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                      Turn-by-Turn Directions
                    </span>
                  </div>
                  
                  <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {routeData.steps.map((step, index) => (
                      <div 
                        key={index}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          padding: '1rem',
                          background: index % 2 === 0 ? '#f9fafb' : 'white',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div style={{
                          minWidth: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--strava-orange)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {step.narrative.replace(/Go for[^.]*\.?\s*/gi, '')}
                          </p>
                          {typeof step.distance === 'number' && (
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                              {step.distance < 0.1 
                                ? '0.00 m'
                                : step.distance < 1 
                                  ? `${Math.round(step.distance * 1000)} m` 
                                  : `${step.distance.toFixed(2)} km`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
