import { motion } from 'motion/react';
import { Github, Twitter, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Routes', path: '/saved' },
    { name: 'About Us', path: '/about' }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@5gwalks.com', label: 'Email' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main footer content */}
        <div className="footer-grid">
          {/* Brand section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <MapPin className="logo-icon" size={24} />
              <h3 className="brand-name">5G Walks</h3>
            </div>
            <p className="brand-tagline">
              Discover, create, and share walking routes. 
              Join thousands of walkers exploring the world.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-links-section">
            <h4 className="footer-heading">Explore</h4>
            <nav className="footer-nav">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Social links */}
          <div className="footer-social-section">
            <h4 className="footer-heading">Connect</h4>
            <div className="social-links">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.label}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} 5G Walks. Crafted by The 5G Talks Podcast.
          </p>
          <div className="footer-links-inline">
            <a href="#" className="footer-link-small">Privacy</a>
            <span className="separator">•</span>
            <a href="#" className="footer-link-small">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
