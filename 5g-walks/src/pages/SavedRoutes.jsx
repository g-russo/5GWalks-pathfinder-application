import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RouteCard from '../components/RouteCard';
import { routesAPI } from '../lib/api';

export default function SavedRoutes() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedRoutes();
  }, []);

  const loadSavedRoutes = async () => {
    try {
      const response = await routesAPI.getSavedRoutes();
      setRoutes(response.data);
    } catch (err) {
      console.error('Error loading saved routes:', err);
      setError('Failed to load saved routes');
      // Mock data for development
      setRoutes([
        {
          id: 1,
          name: 'Morning Jog Route',
          description: 'My favorite morning running path',
          distance: 6.5,
          duration: 75,
          type: 'Walking',
        },
        {
          id: 2,
          name: 'Evening Stroll',
          description: 'Relaxing evening walk around the neighborhood',
          distance: 2.8,
          duration: 35,
          type: 'Walking',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRoute = (routeId) => {
    navigate(`/route/${routeId}`);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading your routes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h3>{error}</h3>
        <p>Please try again later</p>
      </div>
    );
  }

  return (
    <motion.div
      className="saved-routes-container"
      style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
          My Saved Routes
        </h1>
        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem', margin: 0 }}>
          Your collection of favorite walking routes
        </p>
      </div>

      {routes.length === 0 ? (
        <div className="empty-state">
          <h3>No saved routes yet</h3>
          <p>Start by creating your first route or save routes from the community</p>
        </div>
      ) : (
        <div className="routes-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          justifyItems: 'center',
        }}>
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RouteCard route={route} onView={handleViewRoute} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
