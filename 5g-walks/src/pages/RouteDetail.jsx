import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Heart, MapPin, Clock, Navigation } from 'lucide-react';
import MapView from '../components/MapView';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { routesAPI } from '../lib/api';

export default function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    loadRouteDetails();
  }, [id]);

  const loadRouteDetails = async () => {
    try {
      const response = await routesAPI.getRoute(id);
      setRoute(response.data);
    } catch (err) {
      console.error('Error loading route details:', err);
      // Mock data for development
      setRoute({
        id: id,
        name: 'Central Park Loop',
        description: 'A scenic loop through the heart of the park with beautiful views and peaceful atmosphere.',
        distance: 5.2,
        duration: 65,
        type: 'Walking',
        startLocation: 'Central Park South',
        endLocation: 'Central Park South',
        createdBy: 'User123',
        createdAt: new Date().toISOString(),
        pointsOfInterest: [
          'Bethesda Fountain',
          'The Mall',
          'Bow Bridge',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await routesAPI.shareRoute(id);
      alert('Route shared successfully!');
    } catch (err) {
      console.error('Error sharing route:', err);
      alert('Failed to share route');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In production, save to backend
  };

  if (isLoading) {
    return (
      <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p>Loading route details...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h3>Route not found</h3>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <motion.div
      className="route-detail-container"
      style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem' }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Route Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              {route.name}
            </h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem', margin: 0 }}>
              {route.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={handleFavorite}>
              <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
        {/* Map */}
        <div>
          <MapView route={route} />
        </div>

        {/* Route Information */}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Distance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{route.distance} km</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{route.duration} min</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Route Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{route.type}</p>
            </CardContent>
          </Card>
        </div>

        {/* Points of Interest */}
        {route.pointsOfInterest && route.pointsOfInterest.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Points of Interest</CardTitle>
              <CardDescription>Notable locations along this route</CardDescription>
            </CardHeader>
            <CardContent>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {route.pointsOfInterest.map((poi, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
                    <span>{poi}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Route Details */}
        <Card>
          <CardHeader>
            <CardTitle>Route Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Start Location</p>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>{route.startLocation}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>End Location</p>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>{route.endLocation}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Created By</p>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>{route.createdBy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
