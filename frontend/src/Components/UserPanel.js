import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaUserShield, FaUserCog, FaHome, FaUsers } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import Header from './Header';
import Footer from './Common/Footer';
import Login from './User/Login';
import Register from './User/Register';

// Import user components
import UserProfile from './User/UserProfile';
import AdminUsers from './User/Admin/AdminUsers';
import AdminUserDetail from './User/Admin/AdminUserDetail';
import AdminUserEdit from './User/AdminUserEdit';
import UserDashboard from './User/UserDashboard/UserDashboard';

import '../Components/PanelLayout.css';
import './UserPanel.css';

const UserPanel = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { user, isLoggedIn, logout } = useAuth();
  const userIsAdmin = isAdmin(user);

  // Check for initial auth mode from sessionStorage
  useEffect(() => {
    const storedAuthMode = sessionStorage.getItem('authMode');
    if (storedAuthMode && (storedAuthMode === 'login' || storedAuthMode === 'register')) {
      setAuthMode(storedAuthMode);
      // Clear it after using
      sessionStorage.removeItem('authMode');
    }
  }, []);

  // Listen for storage events to handle auth mode changes when already on the page
  useEffect(() => {
    const handleStorageChange = () => {
      const storedAuthMode = sessionStorage.getItem('authMode');
      if (storedAuthMode && (storedAuthMode === 'login' || storedAuthMode === 'register')) {
        setAuthMode(storedAuthMode);
        sessionStorage.removeItem('authMode');
      }
    };

    // Listen for custom event
    window.addEventListener('authModeChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('authModeChanged', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    // Redirect to home page after successful login
    if (setCurrentPage) {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
    setCurrentView('dashboard');
  };

  const renderMainContent = () => {
    // If user is not logged in, show authentication
    if (!isLoggedIn) {
      if (authMode === 'register') {
        return (
          <Register 
            onSuccess={() => setAuthMode('login')}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      } else {
        return (
          <Login 
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        );
      }
    }

    // Admin Section - Dashboard and Users Management
    if (userIsAdmin) {
      switch (activeTab) {
        case 'dashboard':
          return <UserDashboard 
            setActiveTab={setActiveTab} 
            setCurrentView={setCurrentView}
            isAdmin={true}
          />;
        case 'users':
          // Handle different views within users section
          if (currentView === 'user-detail') {
            return <AdminUserDetail 
              userId={selectedUserId} 
              setActiveTab={setActiveTab}
              setCurrentView={setCurrentView}
              onBack={() => setCurrentView('users-table')}
            />;
          } else if (currentView === 'user-edit') {
            return <AdminUserEdit 
              userId={selectedUserId}
              setActiveTab={setActiveTab}
              setCurrentView={setCurrentView}
              onBack={() => setCurrentView('users-table')}
            />;
          }
          return <AdminUsers 
            setActiveTab={setActiveTab}
            setCurrentView={setCurrentView}
            onNavigate={(view, userId) => {
              setSelectedUserId(userId);
              setCurrentView(view);
            }}
          />;
        default:
          return <UserDashboard 
            setActiveTab={setActiveTab} 
            setCurrentView={setCurrentView}
            isAdmin={true}
          />;
      }
    }

    // Regular User Section - Dashboard and Profile only
    switch (activeTab) {
      case 'dashboard':
        return <UserDashboard 
          setActiveTab={setActiveTab} 
          setCurrentView={setCurrentView}
          isAdmin={false}
        />;
      case 'profile':
        return <UserProfile 
          setActiveTab={setActiveTab}
          setCurrentView={setCurrentView}
          currentUser={user}
        />;
      default:
        return <UserDashboard 
          setActiveTab={setActiveTab} 
          setCurrentView={setCurrentView}
          isAdmin={false}
        />;
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="panel-layout" style={{ marginTop: '80px' }}>
        {/* Only show sidebar if user is logged in */}
        {isLoggedIn && (
          <div className="panel-sidebar">
            <div className="sidebar-header">
              <h3>👥 User Management</h3>
              <p>{userIsAdmin ? '🔧 Admin Dashboard' : '👤 User Dashboard'}</p>
              {isLoggedIn && (
                <div className="user-info">
                  <span className="user-role">
                    {userIsAdmin ? '👑 Admin' : '👤 User'}
                    {userIsAdmin && <FaUserShield style={{ marginLeft: '8px', color: '#f39c12' }} />}
                  </span>
                  <p>Welcome, {user?.full_name}</p>
                  <small>{user?.role || 'user'}</small>
                </div>
              )}
            </div>
            <nav className="sidebar-nav">
              <button 
                className="nav-item back-to-home"
                onClick={() => setCurrentPage('home')}
              >
                🏠 Back to Home
              </button>

              {isLoggedIn && (
                <>
                  {/* Admin Section - Dashboard and Users */}
                  {userIsAdmin ? (
                    <>
                      <div className="nav-section-header">
                        <h4>🔧 Admin User Management</h4>
                      </div>
                      <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setCurrentView('dashboard'); }}
                      >
                        <FaHome /> Dashboard
                      </button>
                      <button 
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('users'); setCurrentView('users-table'); }}
                      >
                        <FaUsers /> Users
                      </button>
                    </>
                  ) : (
                    /* Regular User Section - Dashboard and Profile */
                    <>
                      <div className="nav-section-header">
                        <h4>👤 User Profile</h4>
                      </div>
                      <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setCurrentView('dashboard'); }}
                      >
                        <FaHome /> Dashboard
                      </button>
                      <button 
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('profile'); setCurrentView('profile'); }}
                      >
                        <FaUserCog /> Profile
                      </button>
                    </>
                  )}
                </>
              )}
              
              {/* Logout */}
              <button 
                className="nav-item logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className={`panel-main ${!isLoggedIn ? 'full-width' : ''}`}>
          {renderMainContent()}
        </div>
      </div>
      
      {/* Footer - Always show for both logged in and not logged in users */}
      <Footer />
    </div>
  );
};

export default UserPanel;
