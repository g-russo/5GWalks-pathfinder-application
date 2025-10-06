import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, Target } from 'lucide-react';
import DotGrid from '../components/DotGrid';
import '../styles/About.css';

export default function About() {
  const [revealedCards, setRevealedCards] = useState({});
  const [mousePosition, setMousePosition] = useState({});

  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const teamMembers = [
    {
      name: 'Cairos Magno',
      role: 'Team Member',
      description: 'Frontend wizard crafting pixel-perfect interfaces and delightful user experiences.',
      photo: '/card-photos/cai.png',
    },
    {
      name: 'Curt Reyes',
      role: 'Team Member',
      description: 'QA guardian hunting bugs and ensuring every feature walks the line.',
      photo: '/card-photos/curt.png',
    },
    {
      name: 'Ian Sideño',
      role: 'Team Member',
      description: 'Scrum master orchestrating sprints and keeping the team on track.',
      photo: '/card-photos/ian.png',
    },
    {
      name: 'Russ Garcia',
      role: 'Team Member',
      description: 'Backend developer managing databases that structure every step of your journey.',
      photo: '/card-photos/russ.png',
    },
    {
      name: 'Troy Gonzales',
      role: 'Team Member',
      description: 'Backend developer crafting Python APIs that connect routes to reality.',
      photo: '/card-photos/troy.png',
    },
  ];

  const handleCardReveal = (index) => {
    if (!revealedCards[index]) {
      setRevealedCards(prev => ({ ...prev, [index]: true }));
    }
  };

  const handleMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition(prev => ({
      ...prev,
      [index]: { x, y }
    }));
  };

  const handleMouseLeave = (index) => {
    setMousePosition(prev => ({
      ...prev,
      [index]: null
    }));
  };

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'We love walking and believe in its power to transform lives and communities.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building connections between walkers worldwide through shared experiences.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Leveraging technology to make route planning and sharing effortless.',
    },
  ];

  return (
    <div className="about-page">
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
      <section className="about-hero">
        <div className="about-hero-background">
          <div className="hero-gradient-orb orb-1"></div>
          <div className="hero-gradient-orb orb-2"></div>
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

        <div className="container">
          <motion.div
            className="about-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="about-hero-title">
              About <span className="text-gradient">5G Walks</span>
            </h1>
            <p className="about-hero-subtitle">
              Empowering walkers to discover, create, and share amazing routes around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="container mission-wrapper">
          {/* Animated background lines */}
          <motion.svg 
            className="mission-lines-bg" 
            viewBox="0 0 1200 600" 
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FC4C02" stopOpacity="0" />
                <stop offset="50%" stopColor="#FC4C02" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FC4C02" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Left side lines */}
            <motion.path
              d="M 50 150 Q 100 180, 150 200 T 250 250"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
            <motion.path
              d="M 30 300 Q 80 330, 130 350 T 230 400"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
            
            {/* Right side lines */}
            <motion.path
              d="M 1150 200 Q 1100 230, 1050 250 T 950 300"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
            <motion.path
              d="M 1170 350 Q 1120 380, 1070 400 T 970 450"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.8, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
          </motion.svg>

          <motion.div
            className="mission-content mission-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              At 5G Walks, we believe that walking is more than just exercise—it's a journey of discovery, 
              a path to wellness, and a way to connect with the world around us. Our mission is to make it 
              easy for anyone to plan, track, and share their walking adventures while building a vibrant 
              community of like-minded explorers.
            </p>
            <p className="mission-text">
              Whether you're a casual stroller, a fitness enthusiast, or an urban explorer, 5G Walks provides 
              the tools you need to make every walk memorable. We combine cutting-edge technology with intuitive 
              design to create an experience that inspires people to get moving and discover new paths.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            Our Values
          </motion.h2>

          <div className="values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="value-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="value-icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section team-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            Meet Our Team
          </motion.h2>

          <div className="team-grid">
            {teamMembers.map((member, index) => {
              const isRevealed = revealedCards[index];
              
              return (
                <motion.div
                  key={index}
                  className={`team-card-wrapper ${isRevealed ? 'revealed' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleCardReveal(index)}
                  onMouseMove={(e) => !isRevealed && handleMouseMove(e, index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  style={{ cursor: !isRevealed ? 'pointer' : 'default' }}
                >
                  {/* Card Front (Hidden) */}
                  <AnimatePresence>
                    {!isRevealed && (
                      <motion.div
                        className="team-card-front"
                        initial={{ opacity: 1 }}
                        exit={{ 
                          opacity: 0,
                          filter: "blur(20px)",
                          scale: 1.2
                        }}
                        transition={{ 
                          duration: 0.8,
                          ease: "easeOut"
                        }}
                      >
                        {/* Shine effect covering entire card */}
                        <div 
                          className="card-shine"
                          style={mousePosition[index] ? {
                            background: `radial-gradient(circle 400px at ${mousePosition[index].x}px ${mousePosition[index].y}px, rgba(252, 76, 2, 0.6) 0%, rgba(252, 76, 2, 0.4) 25%, rgba(252, 76, 2, 0.2) 50%, transparent 100%)`
                          } : {}}
                        ></div>
                        
                        <div className="card-front-content">
                          <div className="initials-circle">{getInitials(member.name)}</div>
                          <p className="mystery-text">Click to Reveal</p>
                        </div>
                        
                        {/* Glass shatter overlay */}
                        {isRevealed === false && (
                          <div className="glass-overlay"></div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Card Back (Revealed) */}
                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div
                        className="team-card revealed-card"
                        initial={{ 
                          opacity: 0,
                          scale: 0.8,
                          filter: "blur(20px)"
                        }}
                        animate={{ 
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)"
                        }}
                        transition={{ 
                          duration: 0.6,
                          ease: "easeOut",
                          delay: 0.3
                        }}
                        whileHover="hover"
                        variants={{
                          hover: { y: -8 }
                        }}
                      >
                        {/* Floating placeholder that slides up behind card on hover */}
                        <motion.div 
                          className="floating-avatar"
                          variants={{
                            hover: {
                              y: -180,
                              scale: 1.1,
                              opacity: 1
                            }
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 25
                          }}
                        >
                          {member.photo ? (
                            // Display member photo when available
                            <img 
                              src={member.photo} 
                              alt={member.name}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                borderRadius: '16px' 
                              }}
                            />
                          ) : (
                            // Display placeholder avatar when photo is not available
                            <img 
                              src="/card-photos/cai.png" 
                              alt={`${member.name} placeholder`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                borderRadius: '16px' 
                              }}
                            />
                          )}
                        </motion.div>
                        <motion.div 
                          className="team-avatar in-card"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </motion.div>
                        <motion.h3 
                          className="team-name"
                          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ delay: 0.7, duration: 0.4 }}
                        >
                          {member.name}
                        </motion.h3>
                        <motion.p 
                          className="team-role"
                          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ delay: 0.8, duration: 0.4 }}
                        >
                          {member.role}
                        </motion.p>
                        <motion.p 
                          className="team-description"
                          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ delay: 0.9, duration: 0.4 }}
                        >
                          {member.description}
                        </motion.p>

                        {/* Particle effects */}
                        <motion.div
                          className="reveal-particles"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ delay: 1, duration: 0.5 }}
                        >
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="particle"
                              initial={{
                                x: 0,
                                y: 0,
                                opacity: 1,
                                scale: 1
                              }}
                              animate={{
                                x: Math.cos(i * 30 * Math.PI / 180) * 100,
                                y: Math.sin(i * 30 * Math.PI / 180) * 100,
                                opacity: 0,
                                scale: 0
                              }}
                              transition={{
                                delay: 0.3 + (i * 0.05),
                                duration: 0.8,
                                ease: "easeOut"
                              }}
                            />
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="cta-title">Ready to Start Walking?</h2>
            <p className="cta-text">
              Join thousands of walkers discovering new paths every day.
            </p>
            <motion.button
              className="btn-primary btn-large"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/create'}
            >
              Create Your First Route
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
