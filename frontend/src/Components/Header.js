import React from 'react';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';
import { isInventoryManager, hasPermission } from '../utils/roleUtils';

const Header = ({ setCurrentPage }) => {
  const { user, isLoggedIn, logout } = useAuth();
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

  const handleHomeClick = () => {
    if (setCurrentPage) {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    logout();
    if (setCurrentPage) {
      setCurrentPage('home');
    }
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
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-section" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">BookBridge</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home" onClick={(e) => { e.preventDefault(); handleHomeClick(); }}>Home</a></li>
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
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact Us</a></li>
          {isLoggedIn ? (
            <>
              <li className="user-greeting">
                <span className="greeting-text">
                  {getGreeting()}, {getDisplayName(user?.full_name || user?.name)}! 👋
                </span>
              </li>
              <li><a href="#profile" onClick={(e) => { e.preventDefault(); handlePanelClick('profile'); }}>👤 Profile</a></li>
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
  );
};

export default Header;
