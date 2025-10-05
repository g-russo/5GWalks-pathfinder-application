import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import '../styles/RouteCard.css';

export default function RouteCard({ route, onView }) {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <motion.div
      className="route-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsCardHovered(true)}
      onHoverEnd={() => setIsCardHovered(false)}
      onClick={() => onView?.(route.id)}
    >

      {/* Card image */}
      {route.image && (
        <div className="card-image-container">
          <img 
            src={route.image} 
            alt={route.name}
            className="card-image"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect fill="%23f5f5f5" width="400" height="250"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3E' + encodeURIComponent(route.name) + '%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
      )}

      {/* Card content */}
      <div className="card-header">
        <h3 className="card-title">{route.name}</h3>
        <p className="card-description">{route.description}</p>
      </div>

      {/* View button with text - fade slide-up on card hover */}
      <AnimatePresence>
        {isCardHovered && (
          <motion.button
            className="btn-arrow-circle"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(route.id);
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span className="btn-text">View</span>
            <ArrowRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
