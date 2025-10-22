import React, { useEffect } from "react";
import "./Home.css";
import { useAuth } from '../contexts/AuthContext';
import { isInventoryManager, hasPermission } from '../utils/roleUtils';

const Home = ({ setCurrentPage }) => {
  const { user, isLoggedIn, logout } = useAuth();
  
  useEffect(() => {
    // Smooth scrolling
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      const target = document.querySelector(e.currentTarget.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    };
    anchors.forEach((a) => a.addEventListener("click", handleClick));
    
    return () => {
      anchors.forEach((a) => a.removeEventListener("click", handleClick));
    };
  }, []);

  const handlePanelClick = (panelName, authMode = null) => {
    // Special handling for inventory access - only inventory managers allowed
    if (panelName === 'inventory') {
      if (!isLoggedIn) {
        alert('Please log in first to access Inventory Management.');
        return;
      }
      if (!isInventoryManager(user) && !hasPermission(user, 'access_inventory')) {
        alert('Access Denied: Only Inventory Managers can access the Inventory Panel.\n\nContact: ransharipremarathna@gmail.com');
        return;
      }
    }
    
    if (setCurrentPage) {
      setCurrentPage(panelName);
      // Store the auth mode in sessionStorage for UserPanel to pick up
      if (authMode) {
        sessionStorage.setItem('authMode', authMode);
        // Dispatch custom event to notify UserPanel
        window.dispatchEvent(new Event('authModeChanged'));
      }
    }
  };

  const handleLogout = () => {
    logout();
    // Stay on home page after logout
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDisplayName = (userName) => {
    if (!userName) return 'User';
    // For mobile screens, show first name only
    return userName.split(' ')[0];
  };

  return (
    <div className="app-layout">
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo-section">
              <span className="logo-icon">📚</span>
              <span className="logo-text">BookBridge</span>
            </div>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li className="dropdown">
                <a href="#features" className="dropdown-toggle">
                  Features <span className="dropdown-arrow">▼</span>
                </a>
                <ul className="dropdown-menu">
                  <li><a href="#user" onClick={(e) => { e.preventDefault(); handlePanelClick('user'); }}>👥 User Management</a></li>
                  <li><a href="#order" onClick={(e) => { e.preventDefault(); handlePanelClick('order'); }}>📊 Order Management</a></li>
                  <li><a href="#finance" onClick={(e) => { e.preventDefault(); handlePanelClick('finance'); }}>💰 Finance Management</a></li>
                  <li>
                    <a 
                      href="#inventory" 
                      onClick={(e) => { e.preventDefault(); handlePanelClick('inventory'); }}
                      className={isLoggedIn && isInventoryManager(user) ? 'accessible' : 'restricted'}
                      title={isLoggedIn && isInventoryManager(user) ? 'Access Inventory Management' : 'Inventory Manager Access Only'}
                    >
                      📦 Inventory Management {!isLoggedIn || !isInventoryManager(user) ? '🔒' : ''}
                    </a>
                  </li>
                  <li><a href="#helpdesk" onClick={(e) => { e.preventDefault(); handlePanelClick('helpdesk'); }}>🎧 Support System</a></li>
                </ul>
              </li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); handlePanelClick('about'); }}>About Us</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); handlePanelClick('contact'); }}>Contact Us</a></li>
              {isLoggedIn ? (
                <>
                  <li className="user-greeting">
                    <span className="greeting-text">
                      {getGreeting()}, {getDisplayName(user?.full_name || user?.name)}! 👋
                    </span>
                  </li>
                  <li><a href="#logout" className="btn-logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
                </>
              ) : (
                <>
                  <li><a href="#login" className="btn-login" onClick={(e) => { e.preventDefault(); handlePanelClick('user', 'login'); }}>Login</a></li>
                  <li><a href="#signup" className="btn-primary" onClick={(e) => { e.preventDefault(); handlePanelClick('user', 'register'); }}>Sign Up</a></li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>Books That Travel, Knowledge That Lasts</h1>
              <p>
                Trade your textbooks, support peers, and build a thriving learning
                community together.
              </p>
              <div className="hero-buttons">
                <a href="#features" className="btn-primary">Get Started</a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features" id="features">
          <h2 className="section-title">Why Choose BookSwap?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find textbooks quickly with advanced filters.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Peer-to-Peer Exchange</h3>
              <p>Connect with fellow students for direct book swaps.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Inventory Alerts</h3>
              <p>Get notified when your favorite books are available.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-top">
              {/* Logo Section */}
              <div className="footer-section footer-logo">
                <div className="logo-content">
                  <span className="logo-icon">📚</span>
                  <span className="logo-text">BookSwap</span>
                </div>
                <p>
                  A student-driven book exchange platform that helps you save
                  money, share knowledge, and build a stronger learning community.
                </p>
              </div>

              {/* Links Section */}
              <div className="footer-section footer-links-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="footer-section footer-contact">
                <h4>Contact Us</h4>
                <p><strong>Email:</strong> support@bookswap.com</p>
                <p><strong>Phone:</strong> +94 123 456 789</p>
                <p><strong>Address:</strong> Faculty of Computing, SLIIT, Malabe</p>
              </div>

              {/* Social Section */}
              <div className="footer-section footer-social">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="https://facebook.com"><img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" /></a>
                  <a href="https://twitter.com"><img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" /></a>
                  <a href="https://instagram.com"><img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" /></a>
                  <a href="https://linkedin.com"><img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" /></a>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
              <p>
                &copy; 2025 BookSwap. All rights reserved. | Privacy Policy | Terms
                of Service
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
