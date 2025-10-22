// Sidebar.js
import React from 'react';
import './Sidebar.css';
import { 
  FaBox, 
  FaTh, 
  FaTruck, 
  FaUsers, 
  FaChartBar, 
  FaExchangeAlt,  // ✅ Added for Borrow & Return
  FaArrowLeft     // ✅ Added for Back to Home
} from 'react-icons/fa';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Inventory MS</h2>
      <ul className="sidebar-menu">
        
        <li 
          className="menu-item back-to-home" 
          onClick={() => setCurrentPage('home')}
        >
          <FaArrowLeft className="menu-icon" />
          <span>Back to Home</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'dashboard' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('dashboard')}
        >
          <FaBox className="menu-icon" />
          <span>Dashboard</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'products' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('products')}
        >
          <FaTh className="menu-icon" />
          <span>Products</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'categories' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('categories')}
        >
          <FaTh className="menu-icon" />
          <span>Categories</span>
        </li>

        {/* ✅ Borrow & Return link */}
        <li 
          className={`menu-item ${currentPage === 'borrowReturn' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('borrowReturn')}
        >
          <FaExchangeAlt className="menu-icon" />
          <span>Borrow & Return</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'alerts' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('alerts')}
        >
          <FaTruck className="menu-icon" />
          <span>Alerts</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'suppliers' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('suppliers')}
        >
          <FaUsers className="menu-icon" />
          <span>Suppliers</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'report' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('report')}
        >
          <FaChartBar className="menu-icon" />
          <span>Reports</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
