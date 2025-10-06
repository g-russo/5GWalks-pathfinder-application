import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RouteCard from '../components/RouteCard';
import { Input } from '../components/ui/input';
import { routesAPI } from '../lib/api';
import '../styles/SharedRoutes.css';

export default function SharedRoutes() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSharedRoutes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = routes.filter(route =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(routes);
    }
  }, [searchTerm, routes]);

  const loadSharedRoutes = async () => {
    try {
      const response = await routesAPI.getSharedRoutes();
      setRoutes(response.data);
      setFilteredRoutes(response.data);
    } catch (err) {
      console.error('Error loading shared routes:', err);
      setError('Failed to load community routes');
      // Mock data for development
      const mockRoutes = [
        {
          id: 1,
          name: 'Riverside Walk',
          description: 'Beautiful path along the river with great views',
          distance: 4.2,
          duration: 50,
          type: 'Walking',
        },
        {
          id: 2,
          name: 'Mountain Trail',
          description: 'Challenging route with amazing mountain scenery',
          distance: 8.5,
          duration: 120,
          type: 'Walking',
        },
        {
          id: 3,
          name: 'City Explorer',
          description: 'Urban walk through downtown landmarks',
          distance: 3.5,
          duration: 42,
          type: 'Walking',
        },
        {
          id: 4,
          name: 'Beach Boardwalk',
          description: 'Relaxing coastal walk with ocean breeze',
          distance: 5.8,
          duration: 70,
          type: 'Walking',
        },
      ];
      setRoutes(mockRoutes);
      setFilteredRoutes(mockRoutes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRoute = (routeId) => {
    navigate(`/route/${routeId}`);
  };

  const handleSaveRoute = async (routeId) => {
    try {
      await routesAPI.saveRoute(routeId);
      alert('Route saved successfully!');
    } catch (err) {
      console.error('Error saving route:', err);
      alert('Failed to save route');
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading community routes...</p>
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
      className="shared-routes-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1 className="page-title">Community Routes</h1>
        <p className="page-description">
          Explore and discover routes shared by the community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">
            Search Routes
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Routes List */}
      {filteredRoutes.length === 0 ? (
        <div className="empty-state">
          <h3>No routes found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="routes-list">
          {filteredRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <RouteCard
                route={route}
                onView={handleViewRoute}
                onSave={handleSaveRoute}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
