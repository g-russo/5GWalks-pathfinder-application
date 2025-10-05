import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MotionPathHero from '../components/MotionPathHero';
import RouteCard from '../components/RouteCard';
import { FEATURED_ROUTES, preGenerateAllRoutes } from '../constants/featuredRoutes';
import { walkAPI } from '../lib/api';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [isPreGenerating, setIsPreGenerating] = useState(false);

  // Pre-generate all featured routes on component mount
  useEffect(() => {
    const preGenerate = async () => {
      setIsPreGenerating(true);
      try {
        await preGenerateAllRoutes(async (start, end, type, units) => {
          const response = await walkAPI.createWalkRoute(start, end, type, units);
          if (!response.success) {
            throw new Error('Failed to generate route');
          }
          return response;
        });
      } catch (error) {
        console.error('Error pre-generating routes:', error);
      } finally {
        setIsPreGenerating(false);
      }
    };

    // Pre-generate routes in the background
    preGenerate();
  }, []);

  const handleViewRoute = (routeId) => {
    // Navigate directly to the route detail page
    navigate(`/route/${routeId}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Grid Background with Glowing Lines */}
        <div className="hero-grid-background">
          <div className="hero-grid-pattern"></div>
          {/* Horizontal glowing lines */}
          <div className="hero-glow-line hero-glow-line-horizontal hero-glow-line-1"></div>
          <div className="hero-glow-line hero-glow-line-horizontal hero-glow-line-2"></div>
          <div className="hero-glow-line hero-glow-line-horizontal hero-glow-line-3"></div>
          {/* Vertical glowing lines */}
          <div className="hero-glow-line hero-glow-line-vertical hero-glow-line-4"></div>
          <div className="hero-glow-line hero-glow-line-vertical hero-glow-line-5"></div>
          <div className="hero-glow-line hero-glow-line-vertical hero-glow-line-6"></div>
        </div>

        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <h1 className="hero-title">
              Discover. Create.
              <br />
              <span className="text-gradient">Share the Paths</span>
              <br />
              You Love.
            </h1>

            <div className="hero-actions">
              <motion.button
                className="btn-primary btn-large"
                onClick={() => navigate('/walk')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Walking Now
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                className="btn-secondary btn-large"
                onClick={() => navigate('/about')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <MotionPathHero />
          </motion.div>
        </div>
      </section>

      {/* Featured Routes */}
      <section id="featured-routes" className="featured-section section-lg">
        {/* Grid Background with Glowing Lines */}
        <div className="featured-grid-background">
          <div className="featured-grid-pattern"></div>
          {/* Horizontal glowing lines */}
          <div className="featured-glow-line featured-glow-line-horizontal featured-glow-line-1"></div>
          <div className="featured-glow-line featured-glow-line-horizontal featured-glow-line-2"></div>
          <div className="featured-glow-line featured-glow-line-horizontal featured-glow-line-3"></div>
          {/* Vertical glowing lines */}
          <div className="featured-glow-line featured-glow-line-vertical featured-glow-line-4"></div>
          <div className="featured-glow-line featured-glow-line-vertical featured-glow-line-5"></div>
          <div className="featured-glow-line featured-glow-line-vertical featured-glow-line-6"></div>
        </div>

        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="featured-section-title">
                Featured Routes
              </h2>
              <p className="section-subtitle">
                Explore the best walking routes around Metro Manila
                {isPreGenerating && (
                  <span style={{ 
                    display: 'inline-block', 
                    marginLeft: '0.5rem', 
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    🗺️ Pre-loading routes for instant viewing...
                  </span>
                )}
              </p>
            </div>
          </motion.div>

          <div className="routes-grid">
            {FEATURED_ROUTES.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1 }}
              >
                <RouteCard route={route} onView={handleViewRoute} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to start walking?</h2>
            <p className="cta-text">
              Create your first route and join our community of explorers
            </p>
            <motion.button
              className="btn-cta"
              onClick={() => navigate('/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
