import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../styles/Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/saved', label: 'My Routes' },
    { path: '/about', label: 'About Us' },
  ];

  // Scroll detection with debouncing
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const newIsAtTop = scrollPosition === 0;
          
          setIsAtTop(newIsAtTop);
          
          // Auto-open navbar when at top, close when scrolled
          if (newIsAtTop) {
            setIsMenuOpen(true);
          } else {
            setIsMenuOpen(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Main Navigation Pill - Auto-expands at top, collapses on scroll */}
      <motion.div 
        className="header-nav-pill"
        animate={{
          scale: isAtTop && isMenuOpen ? 1 : 0.98,
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0, 0.2, 1],
          type: 'tween'
        }}
      >
        {/* Navigation Items - Visible when at top or manually toggled */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.nav
              className="nav-expanded"
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: 'auto', 
                opacity: 1,
                transition: {
                  width: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.3, delay: 0.1, ease: 'easeOut' }
                }
              }}
              exit={{ 
                width: 0, 
                opacity: 0,
                transition: {
                  width: { duration: 0.35, delay: 0.05, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2, ease: 'easeIn' }
                }
              }}
            >
              {/* Logo - shows when expanded */}
              <Link to="/" className="logo" onClick={() => !isAtTop && setIsMenuOpen(false)}>
                <motion.div
                  className="logo-content"
                  initial={{ opacity: 0, x: -15, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.3,
                      delay: 0.15,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -10, 
                    scale: 0.95,
                    transition: {
                      duration: 0.2,
                      ease: 'easeIn'
                    }
                  }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="logo-text">5G</span>
                  <span className="logo-accent">Walks</span>
                </motion.div>
              </Link>

              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -15, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.3,
                      delay: 0.2 + (index * 0.05),
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -10, 
                    scale: 0.95,
                    transition: {
                      duration: 0.15,
                      ease: 'easeIn'
                    }
                  }}
                >
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => !isAtTop && setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Create Button - always visible */}
        <Link to="/create" onClick={() => !isAtTop && setIsMenuOpen(false)}>
          <motion.button
            className="btn-create"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            <span>Create</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Toggle Button Pill - Only visible when scrolled down */}
      <AnimatePresence mode="wait">
        {!isAtTop && (
          <motion.div 
            className="header-toggle-pill-orange"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              x: 20,
              transition: {
                duration: 0.25,
                ease: [0.4, 0, 0.6, 1]
              }
            }}
            transition={{ 
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <motion.button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
