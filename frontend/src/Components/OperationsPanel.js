import React, { useState } from 'react';
import { FaCog, FaPlus, FaChartLine, FaTasks } from 'react-icons/fa';
import BorrowReturn from './BorrowReturn';
import Profile from './Profile';
import '../Components/PanelLayout.css';
import './OperationsPanel.css';

const OperationsPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarActive, setSidebarActive] = useState('overview');

  const operationsStats = {
    activeOperations: 45,
    completedOperations: 28,
    pendingOperations: 12,
    systemUptime: 99.8
  };

  const renderSidebarContent = () => {
    switch (sidebarActive) {
      case 'borrowreturn':
        return <BorrowReturn />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="panel-layout">
      {/* Sidebar */}
      <div className="panel-sidebar">
        <div className="sidebar-header">
          <h3>⚙️ Operations</h3>
          <p>Management System</p>
        </div>
        <nav className="sidebar-nav">
          <button 
            className="nav-item back-to-home"
            onClick={() => window.location.href = '/'}
          >
            🏠 Back to Home
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'overview' ? 'active' : ''}`}
            onClick={() => setSidebarActive('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'borrowreturn' ? 'active' : ''}`}
            onClick={() => setSidebarActive('borrowreturn')}
          >
            🔄 Borrow & Return
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'workflow' ? 'active' : ''}`}
            onClick={() => setSidebarActive('workflow')}
          >
            <FaTasks /> Workflow Management
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'automation' ? 'active' : ''}`}
            onClick={() => setSidebarActive('automation')}
          >
            🤖 Automation
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'monitoring' ? 'active' : ''}`}
            onClick={() => setSidebarActive('monitoring')}
          >
            📊 System Monitoring
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'profile' ? 'active' : ''}`}
            onClick={() => setSidebarActive('profile')}
          >
            👤 Profile Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="panel-main">
        {sidebarActive === 'overview' && (
          <div className="panel-container operations-panel">
            <div className="panel-header">
              <div className="header-info">
                <h1><FaCog /> Operations Management Panel</h1>
                <p>Manage system operations, workflows, and process automation</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-primary">
                  <FaPlus /> Create Operation
                </button>
              </div>
            </div>

            <div className="panel-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'borrowreturn' ? 'active' : ''}`}
                onClick={() => { setActiveTab('borrowreturn'); setSidebarActive('borrowreturn'); }}
              >
                🔄 Borrow & Return
              </button>
              <button 
                className={`tab-btn ${activeTab === 'workflows' ? 'active' : ''}`}
                onClick={() => { setActiveTab('workflows'); setSidebarActive('workflow'); }}
              >
                <FaTasks /> Workflows
              </button>
              <button 
                className={`tab-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
                onClick={() => { setActiveTab('monitoring'); setSidebarActive('monitoring'); }}
              >
                📊 Monitoring
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="tab-content">
                <div className="stats-grid">
                  <div className="stat-card active-ops">
                    <div className="stat-icon">
                      <FaCog />
                    </div>
                    <div className="stat-info">
                      <h3>{operationsStats.activeOperations}</h3>
                      <p>Active Operations</p>
                      <span className="stat-change positive">Currently running</span>
                    </div>
                  </div>
                  
                  <div className="stat-card completed-ops">
                    <div className="stat-icon">
                      ✅
                    </div>
                    <div className="stat-info">
                      <h3>{operationsStats.completedOperations}</h3>
                      <p>Completed Today</p>
                      <span className="stat-change positive">+8 from yesterday</span>
                    </div>
                  </div>
                  
                  <div className="stat-card pending-ops">
                    <div className="stat-icon">
                      ⏳
                    </div>
                    <div className="stat-info">
                      <h3>{operationsStats.pendingOperations}</h3>
                      <p>Pending Operations</p>
                      <span className="stat-change neutral">In queue</span>
                    </div>
                  </div>
                  
                  <div className="stat-card uptime">
                    <div className="stat-icon">
                      �
                    </div>
                    <div className="stat-info">
                      <h3>{operationsStats.systemUptime}%</h3>
                      <p>System Uptime</p>
                      <span className="stat-change positive">Excellent</span>
                    </div>
                  </div>
                </div>

                <div className="workflow-status">
                  <h3>Workflow Status</h3>
                  <div className="workflow-cards">
                    <div className="workflow-card active">
                      <div className="workflow-info">
                        <h4>Book Processing</h4>
                        <p>12 items in progress</p>
                      </div>
                      <div className="workflow-status-badge">
                        🟢 Active
                      </div>
                    </div>
                    <div className="workflow-card pending">
                      <div className="workflow-info">
                        <h4>Return Processing</h4>
                        <p>5 items pending</p>
                      </div>
                      <div className="workflow-status-badge">
                        🟡 Pending
                      </div>
                    </div>
                    <div className="workflow-card completed">
                      <div className="workflow-info">
                        <h4>Daily Backup</h4>
                        <p>Completed successfully</p>
                      </div>
                      <div className="workflow-status-badge">
                        ✅ Complete
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="action-grid">
                    <button className="action-card" onClick={() => setSidebarActive('borrowreturn')}>
                      🔄
                      <span>Borrow & Return</span>
                    </button>
                    <button className="action-card" onClick={() => setSidebarActive('workflow')}>
                      <FaTasks />
                      <span>Manage Workflows</span>
                    </button>
                    <button className="action-card" onClick={() => setSidebarActive('automation')}>
                      🤖
                      <span>Automation</span>
                    </button>
                    <button className="action-card" onClick={() => setSidebarActive('monitoring')}>
                      📊
                      <span>System Monitor</span>
                    </button>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">🔄</span>
                      <div className="activity-content">
                        <p>Book return processed: "Database Systems"</p>
                        <small>1 hour ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">⚙️</span>
                      <div className="activity-content">
                        <p>System backup completed successfully</p>
                        <small>3 hours ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">📊</span>
                      <div className="activity-content">
                        <p>Weekly operations report generated</p>
                        <small>1 day ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {sidebarActive !== 'overview' && renderSidebarContent()}
      </div>
    </div>
  );
};

export default OperationsPanel;
