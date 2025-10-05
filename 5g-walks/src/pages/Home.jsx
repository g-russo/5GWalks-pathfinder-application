import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MotionPathHero from '../components/MotionPathHero';
import RouteCard from '../components/RouteCard';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  // Featured routes in Metro Manila
  const featuredRoutes = [
    {
      id: 1,
      name: 'BGC Skyline Walk',
      description: 'Modern cityscape route through Bonifacio Global City with stunning high-rise views',
      distance: 5.2,
      duration: 65,
      type: 'Walking',
      // IMAGE: Place your BGC Skyline Walk image at /public/featured-routes/bgc-skyline-walk.jpg
      image: '/featured-routes/bgc-skyline-walk.jpg',
    },
    {
      id: 2,
      name: 'Rizal Park Heritage Trail',
      description: 'Historic walk through Luneta featuring monuments and lush gardens',
      distance: 3.8,
      duration: 50,
      type: 'Walking',
      // IMAGE: Place your Rizal Park Heritage Trail image at /public/featured-routes/rizal-park-heritage-trail.jpg
      image: '/featured-routes/rizal-park-heritage-trail.jpg',
    },
    {
      id: 3,
      name: 'Ayala Triangle Gardens Loop',
      description: 'Peaceful urban oasis in the heart of Makati business district',
      distance: 2.5,
      duration: 35,
      type: 'Walking',
      // IMAGE: Place your Ayala Triangle Gardens Loop image at /public/featured-routes/ayala-triangle-gardens-loop.jpg
      image: '/featured-routes/ayala-triangle-gardens-loop.jpg',
    },
    {
      id: 4,
      name: 'Manila Bay Sunset Promenade',
      description: 'Scenic waterfront walk along Roxas Boulevard with bay views',
      distance: 4.5,
      duration: 55,
      type: 'Walking',
      // IMAGE: Place your Manila Bay Sunset Promenade image at /public/featured-routes/manila-bay-sunset-promenade.jpg
      image: '/featured-routes/manila-bay-sunset-promenade.jpg',
    },
    {
      id: 5,
      name: 'UP Diliman Academic Oval',
      description: 'Tree-lined university route perfect for morning walks and exercise',
      distance: 2.2,
      duration: 30,
      type: 'Walking',
      // IMAGE: Place your UP Diliman Academic Oval image at /public/featured-routes/up-diliman-academic-oval.jpg
      image: '/featured-routes/up-diliman-academic-oval.jpg',
    },
    {
      id: 6,
      name: 'Intramuros Walled City Tour',
      description: 'Colonial-era fortified city with cobblestone streets and Spanish architecture',
      distance: 3.5,
      duration: 45,
      type: 'Walking',
      // IMAGE: Place your Intramuros Walled City Tour image at /public/featured-routes/intramuros-walled-city-tour.jpg
      image: '/featured-routes/intramuros-walled-city-tour.jpg',
    },
  ];

  const handleViewRoute = (routeId) => {
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
                onClick={() => navigate('/create')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create a Route
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
      <section className="featured-section section-lg">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Featured Routes
              <span className="title-accent"></span>
            </h2>
            <p className="section-subtitle">
              Explore the best walking routes around Metro Manila
            </p>
          </motion.div>

          <div className="routes-grid">
            {featuredRoutes.map((route, index) => (
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
