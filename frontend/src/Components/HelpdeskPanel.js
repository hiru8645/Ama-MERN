import React, { useState } from 'react';
import { FaTicketAlt, FaBook, FaChartPie, FaUserCog, FaUser } from 'react-icons/fa';
import Header from './Header';
import AdminDashboard from './HelpDesk/admin/AdminDashboard';
import TicketDashboard from './HelpDesk/user/TicketDashboard';
import '../Components/PanelLayout.css';
import './HelpdeskPanel.css';

const HelpdeskPanel = ({ setCurrentPage }) => {
  const [sidebarActive, setSidebarActive] = useState('user-dashboard');
  const [userRole, setUserRole] = useState('user'); // 'admin' or 'user'

  const renderSidebarContent = () => {
    switch (sidebarActive) {
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'user-dashboard':
        return <TicketDashboard />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="panel-layout" style={{ marginTop: '80px' }}>
        {/* Sidebar */}
        <div className="panel-sidebar">
        <div className="sidebar-header">
          <h3>🎧 Helpdesk</h3>
          <p>Support System</p>
        </div>
        <nav className="sidebar-nav">
          <button 
            className="nav-item back-to-home"
            onClick={() => window.location.href = '/'}
          >
            🏠 Back to Home
          </button>
          
          {/* Role Selector */}
          <div className="role-selector">
            <h4>View As:</h4>
            <div className="role-buttons">
              <button 
                className={`role-btn ${userRole === 'user' ? 'active' : ''}`}
                onClick={() => {
                  setUserRole('user');
                  setSidebarActive('user-dashboard');
                }}
              >
                <FaUser /> User
              </button>
              <button 
                className={`role-btn ${userRole === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setUserRole('admin');
                  setSidebarActive('admin-dashboard');
                }}
              >
                <FaUserCog /> Admin
              </button>
            </div>
          </div>

          <button 
            className={`nav-item ${sidebarActive === (userRole === 'admin' ? 'admin-dashboard' : 'user-dashboard') ? 'active' : ''}`}
            onClick={() => setSidebarActive(userRole === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
          >
            <FaTicketAlt /> {userRole === 'admin' ? 'Admin Dashboard' : 'My Tickets'}
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'knowledge' ? 'active' : ''}`}
            onClick={() => setSidebarActive('knowledge')}
          >
            <FaBook /> Knowledge Base
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'reports' ? 'active' : ''}`}
            onClick={() => setSidebarActive('reports')}
          >
            <FaChartPie /> Support Reports
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="panel-main">
        
        {renderSidebarContent()}
      </div>
      </div>
    </div>
  );
};

export default HelpdeskPanel;
