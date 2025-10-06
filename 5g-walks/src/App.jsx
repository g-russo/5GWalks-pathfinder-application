import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ClickSpark from './components/ClickSpark';
import Home from './pages/Home';
import CreateRoute from './pages/CreateRoute';
import SavedRoutes from './pages/SavedRoutes';
import About from './pages/About';
import RouteDetail from './pages/RouteDetail';
import './App.css';

function AppContent() {
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setShowBackToTop(scrollPosition > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <ClickSpark
        sparkColor="#FC4C02"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={8}
        duration={500}
        easing="ease-out"
      >
        <div className="app-container">
        <ScrollToTop />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRoute />} />
            <Route path="/walk" element={<CreateRoute />} />
            <Route path="/saved" element={<SavedRoutes />} />
            <Route path="/about" element={<About />} />
            <Route path="/route/:id" element={<RouteDetail />} />
          </Routes>
        </main>
        <Footer />

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.div className="back-to-top-wrapper">
              <motion.button
                className="back-to-top"
                onClick={scrollToTop}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                aria-label="Back to top"
              >
                <ArrowUp size={24} strokeWidth={2.5} />
              </motion.button>
              <span className="back-to-top-tooltip">Back to Top</span>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </ClickSpark>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;