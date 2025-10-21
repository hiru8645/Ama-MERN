import React, { useState } from 'react';
import { FaBoxes, FaChartBar, FaShieldAlt, FaLock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/roleUtils';
import Header from './Header';
import Dashboard from './Dashboard';
import Product from './Product';
import Category from './Category';
import BookDescription from './BookDescription';
import Alerts from './Alerts';
import Supplier from './Supplier';
import InventoryReport from './InventoryReport';
import BorrowReturn from './BorrowReturn';
import '../Components/PanelLayout.css';
import './InventoryPanel.css';

const InventoryPanel = ({ setCurrentPage }) => {
  const [sidebarActive, setSidebarActive] = useState('dashboard');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDescription, setShowBookDescription] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // Access Control: Only Inventory Managers can access this panel
  if (!isLoggedIn) {
    return (
      <div>
        <Header setCurrentPage={setCurrentPage} />
        <div className="auth-required">
          <FaLock style={{ fontSize: '4rem', color: '#3498db', marginBottom: '20px' }} />
          <h2>🔐 Authentication Required</h2>
          <p>Please log in with Inventory Manager credentials to access the Inventory Management System.</p>
          <div className="contact-info">
            <h4>🏢 For Inventory Managers Only</h4>
            <p>This panel is restricted to authorized inventory management staff.</p>
            <p><strong>Contact:</strong> ransharipremarathna@gmail.com</p>
          </div>
          <a href="#user" onClick={(e) => { e.preventDefault(); setCurrentPage('user'); }} className="login-link">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (!hasPermission(user, 'access_inventory')) {
    return (
      <div>
        <Header setCurrentPage={setCurrentPage} />
        <div className="access-denied">
          <FaShieldAlt style={{ fontSize: '4rem', color: '#e74c3c', marginBottom: '20px' }} />
          <h2>🚫 Access Denied</h2>
          <p>You don't have permission to access the Inventory Management System.</p>
          <div className="contact-info">
            <h4>🏢 Inventory Manager Access Required</h4>
            <p>This panel is restricted to authorized inventory management staff only.</p>
            <small>Contact your system administrator if you believe you should have access.</small>
            <p><strong>Contact:</strong> ransharipremarathna@gmail.com</p>
          </div>
          <div className="user-info-display">
            <p><strong>Current User:</strong> {user?.full_name}</p>
            <p><strong>Role:</strong> {user?.role || 'user'}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
          <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="login-link">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const renderSidebarContent = () => {
    // If showing book description, render it
    if (showBookDescription && selectedBook) {
      return (
        <BookDescription 
          book={selectedBook} 
          goBack={() => {
            setShowBookDescription(false);
            setSelectedBook(null);
          }} 
        />
      );
    }

    switch (sidebarActive) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'products':
        return <Product setCurrentPage={setCurrentPage} />;
      case 'categories':
        return (
          <Category 
            setCurrentPage={setCurrentPage}
            viewBookDescription={(book) => {
              setSelectedBook(book);
              setShowBookDescription(true);
            }}
          />
        );
      case 'alerts':
        return <Alerts setCurrentPage={setCurrentPage} />;
      case 'suppliers':
        return <Supplier setCurrentPage={setCurrentPage} />;
      case 'reports':
        return <InventoryReport setCurrentPage={setCurrentPage} />;
      case 'borrow-return':
        return <BorrowReturn setCurrentPage={setCurrentPage} />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="panel-layout" style={{ marginTop: '80px' }}>
        {/* Sidebar */}
        <div className="panel-sidebar">
          <div className="sidebar-header">
            <h3>📦 Inventory Management</h3>
            <p>Inventory Management</p>
          </div>
          <nav className="sidebar-nav">
            <button 
              className="nav-item back-to-home"
              onClick={() => setCurrentPage('home')}
            >
              🏠 Back to Home
            </button>
          
          <button 
            className={`nav-item ${sidebarActive === 'dashboard' ? 'active' : ''}`}
            onClick={() => setSidebarActive('dashboard')}
          >
            <FaChartBar /> Dashboard
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'products' ? 'active' : ''}`}
            onClick={() => setSidebarActive('products')}
          >
            <FaBoxes /> Products
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'categories' ? 'active' : ''}`}
            onClick={() => setSidebarActive('categories')}
          >
            📚 Categories
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'alerts' ? 'active' : ''}`}
            onClick={() => setSidebarActive('alerts')}
          >
            🚨 Alerts
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'suppliers' ? 'active' : ''}`}
            onClick={() => setSidebarActive('suppliers')}
          >
            🏭 Suppliers
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'reports' ? 'active' : ''}`}
            onClick={() => setSidebarActive('reports')}
          >
            📊 Reports
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'borrow-return' ? 'active' : ''}`}
            onClick={() => setSidebarActive('borrow-return')}
          >
            📚 Borrow & Return
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="panel-main">
        <div className="panel-header">
          <h2>📦 Inventory Management System</h2>
        </div>
        <div className="panel-content">
          {renderSidebarContent()}
        </div>
      </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
