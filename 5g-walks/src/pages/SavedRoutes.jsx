import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Footprints, Trash2, PersonStanding, Route as RouteIcon, ExternalLink } from 'lucide-react';
import { getSavedRoutes, removeRoute } from '../lib/localStorage';
import { formatDistance, formatDuration, UNIT_TYPES } from '../lib/units';

export default function SavedRoutes() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = () => {
    setLoading(true);
    const savedRoutes = getSavedRoutes();
    setRoutes(savedRoutes);
    setLoading(false);
  };

  const handleDeleteRoute = (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      removeRoute(routeId);
      loadRoutes(); // Reload routes
    }
  };

  const handleViewRoute = (route) => {
    // Navigate to create route with the route data
    navigate('/create', { state: route });
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '8rem 2rem 2rem'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: '1.125rem', color: '#666' }}>Loading your routes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '80vh',
      padding: '8rem 2rem 4rem',
      position: 'relative',
      background: 'linear-gradient(to bottom, #ffffff, rgba(250, 250, 250, 0.8))'
    }}>
      {/* Grid Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(252, 76, 2, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(252, 76, 2, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          style={{ marginBottom: '3rem', textAlign: 'center' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <RouteIcon size={40} color="#FC4C02" />
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FC4C02, #ff6b35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              My Routes
            </h1>
          </div>
          <p style={{ fontSize: '1.125rem', color: '#666', margin: 0 }}>
            {routes.length === 0 ? 'No saved routes yet' : `${routes.length} saved ${routes.length === 1 ? 'route' : 'routes'}`}
          </p>
        </motion.div>

        {/* Empty State */}
        {routes.length === 0 && (
          <motion.div
            style={{
              textAlign: 'center',
              maxWidth: '500px',
              margin: '0 auto',
              padding: '3rem 2rem',
              background: 'white',
              borderRadius: '20px',
              border: '2px solid rgba(252, 76, 2, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Footprints size={64} color="#FC4C02" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem', color: '#1a1a1a' }}>
              No Routes Yet
            </h2>
            <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
              Start creating walking routes and save them here for easy access later!
            </p>
            <motion.button
              style={{
                background: 'linear-gradient(135deg, #FC4C02, #ff6b35)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(252, 76, 2, 0.3)'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(252, 76, 2, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
            >
              Create Your First Route
            </motion.button>
          </motion.div>
        )}

        {/* Routes Grid */}
        {routes.length > 0 && (
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence>
              {routes.map((route, index) => (
                <motion.div
                  key={route.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '2px solid rgba(252, 76, 2, 0.1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 8px 24px rgba(252, 76, 2, 0.15)'
                  }}
                  onClick={() => handleViewRoute(route)}
                >
                  {/* Route Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(252, 76, 2, 0.1)',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#FC4C02'
                  }}>
                    {route.routeType === 'running' ? <Footprints size={14} /> : <PersonStanding size={14} />}
                    <span style={{ textTransform: 'capitalize' }}>{route.routeType || 'Walking'}</span>
                  </div>

                  {/* Route Name */}
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 600, 
                    marginBottom: '1rem',
                    color: '#1a1a1a',
                    paddingRight: '6rem'
                  }}>
                    {route.name || 'Unnamed Route'}
                  </h3>

                  {/* Description */}
                  {route.description && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#666', 
                      marginBottom: '1rem',
                      lineHeight: 1.5
                    }}>
                      {route.description}
                    </p>
                  )}

                  {/* Locations */}
                  <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <MapPin size={16} color="#10b981" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                      <span style={{ color: '#666', lineHeight: 1.4 }}>{route.startLocation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <MapPin size={16} color="#ef4444" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                      <span style={{ color: '#666', lineHeight: 1.4 }}>{route.endLocation}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <MapPin size={16} color="#666" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1a1a1a' }}>
                        {formatDistance(route.distance || 0, route.unitType || UNIT_TYPES.METRIC)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Clock size={16} color="#666" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1a1a1a' }}>
                        {formatDuration((route.duration || 0) * 60)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <motion.button
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #FC4C02, #ff6b35)',
                        color: 'white',
                        border: 'none',
                        padding: '0.625rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRoute(route);
                      }}
                    >
                      <ExternalLink size={14} />
                      View Route
                    </motion.button>
                    <motion.button
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.625rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoute(route.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>

                  {/* Saved Date */}
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#999', 
                    marginTop: '0.75rem',
                    textAlign: 'right'
                  }}>
                    Saved {new Date(route.savedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
