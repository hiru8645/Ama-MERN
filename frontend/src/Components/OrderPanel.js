import React, { useState } from 'react';
import { FaClipboardList, FaShieldAlt, FaHome, FaBook } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import Header from './Header';

// Import Project Harindie components
import UserOrdersDashboard from './Order/User/UserOrdersDashboard';
import BookList from './Order/User/BookList';
import MyOrders from './Order/User/MyOrders';
import AddOrder from './Order/User/AddOrder';
import OrderDetail from './Order/User/OrderDetail';

// Import admin components
import AdminOrdersDashboard from './Order/Admin/AdminOrdersDashboard';
import AdminOrders from './Order/Admin/AdminOrders';
import AdminOrderDetail from './Order/Admin/AdminOrderDetail';

import '../Components/PanelLayout.css';
import './UserPanel.css';

const OrderPanel = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard'); // For detailed navigation
  const { user, isLoggedIn } = useAuth();
  const userIsAdmin = isAdmin(user);



  const renderMainContent = () => {
    // If user is not logged in, show login prompt
    if (!isLoggedIn) {
      return (
        <div className="login-required">
          <h2>Login Required</h2>
          <p>Please log in to access the Order Management System.</p>
          <button 
            onClick={() => setCurrentPage('user')}
            className="action-btn"
          >
            Go to Login
          </button>
        </div>
      );
    }

    // Admin Section - Only 2 sections: Dashboard and Orders
    if (userIsAdmin) {
      switch (activeTab) {
        case 'dashboard':
          return <AdminOrdersDashboard setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
        case 'orders':
          // Handle different views within orders section
          if (currentView === 'order-detail') {
            return <AdminOrderDetail setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
          }
          return <AdminOrders setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
        default:
          return <AdminOrdersDashboard setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
      }
    }

    // User Section - Simple 3-section structure
    switch (activeTab) {
      case 'dashboard':
        return <UserOrdersDashboard setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
      case 'books':
        // Handle different views within books section
        if (currentView === 'add-order') {
          return <AddOrder setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
        }
        return <BookList setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
      case 'my-orders':
        // Handle different views within my-orders section  
        if (currentView === 'order-detail') {
          return <OrderDetail setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
        } else if (currentView === 'add-order') {
          return <AddOrder setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
        }
        return <MyOrders setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
      default:
        return <UserOrdersDashboard setActiveTab={setActiveTab} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="panel-layout" style={{ marginTop: '80px' }}>
        {/* Sidebar */}
        <div className="panel-sidebar">
          <div className="sidebar-header">
            <h3>📊 Order Management</h3>
            <p>{userIsAdmin ? '🔧 Admin Dashboard' : '🛒 Shopping Center'}</p>
            {isLoggedIn && (
              <div className="user-info">
                <span className="user-role">
                  {userIsAdmin ? '👑 Admin' : '👤 User'}
                  {userIsAdmin && <FaShieldAlt style={{ marginLeft: '8px', color: '#f39c12' }} />}
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
                {/* Admin Section - Only Dashboard and Orders */}
                {userIsAdmin ? (
                  <>
                    <div className="nav-section-header">
                      <h4>🔧 Admin Order Management</h4>
                    </div>
                    <button 
                      className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('dashboard'); setCurrentView('dashboard'); }}
                    >
                      <FaHome /> Dashboard
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('orders'); setCurrentView('orders-table'); }}
                    >
                      <FaClipboardList /> Orders
                    </button>
                  </>
                ) : (
                  /* User Section - Only 3 sections: Dashboard, Books, My Orders */
                  <>
                    <div className="nav-section-header">
                      <h4>🛒 Order Management</h4>
                    </div>
                    <button 
                      className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('dashboard'); setCurrentView('dashboard'); }}
                    >
                      <FaHome /> Dashboard
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('books'); setCurrentView('books'); }}
                    >
                      <FaBook /> Books
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'my-orders' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('my-orders'); setCurrentView('my-orders'); }}
                    >
                      <FaClipboardList /> My Orders
                    </button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="panel-main">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
