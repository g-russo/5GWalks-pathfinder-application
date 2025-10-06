import { motion } from 'motion/react';
import { Construction, Hammer, AlertTriangle } from 'lucide-react';

export default function SavedRoutes() {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '8rem 2rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(252, 76, 2, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(252, 76, 2, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0
      }} />

      <motion.div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          position: 'relative',
          zIndex: 1,
          background: 'white',
          padding: '3rem 2rem',
          borderRadius: '20px',
          border: '2px solid rgba(252, 76, 2, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Animated Icons */}
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Construction size={48} color="#FC4C02" strokeWidth={2} />
          </motion.div>
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 15, 0],
              y: [0, -8, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              delay: 0.3
            }}
          >
            <Hammer size={48} color="#FC4C02" strokeWidth={2} />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              delay: 0.6
            }}
          >
            <AlertTriangle size={48} color="#FFA500" strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Page Under Construction
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          style={{
            fontSize: '1.125rem',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We're working hard to bring you the <strong style={{ color: '#FC4C02' }}>My Routes</strong> feature. 
          This page will allow you to save, organize, and manage all your favorite walking routes.
        </motion.p>

        {/* Feature List */}
        <motion.div
          style={{
            textAlign: 'left',
            background: 'rgba(252, 76, 2, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: '#FC4C02',
            marginBottom: '1rem'
          }}>
            Coming Soon:
          </h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
              <span style={{ color: '#FC4C02' }}>✓</span> Save your favorite routes
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
              <span style={{ color: '#FC4C02' }}>✓</span> Organize routes by category
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
              <span style={{ color: '#FC4C02' }}>✓</span> Track your walking history
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
              <span style={{ color: '#FC4C02' }}>✓</span> Share routes with friends
            </li>
          </ul>
        </motion.div>

        {/* Back Button */}
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
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 6px 24px rgba(252, 76, 2, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
