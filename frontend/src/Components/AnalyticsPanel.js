import React, { useState } from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaDownload, FaFileAlt } from 'react-icons/fa';
import Report from './Report';
import Alerts from './Alerts';
import '../Components/PanelLayout.css';
import './AnalyticsPanel.css';

const AnalyticsPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarActive, setSidebarActive] = useState('overview');

  const analyticsStats = {
    totalViews: 15420,
    activeUsers: 856,
    conversionRate: 12.5,
    revenue: 45280
  };

  const renderSidebarContent = () => {
    switch (sidebarActive) {
      case 'reports':
        return <Report />;
      case 'alerts':
        return <Alerts />;
      default:
        return null;
    }
  };

  return (
    <div className="panel-layout">
      {/* Sidebar */}
      <div className="panel-sidebar">
        <div className="sidebar-header">
          <h3>📊 Analytics</h3>
          <p>Data & Reports</p>
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
            className={`nav-item ${sidebarActive === 'reports' ? 'active' : ''}`}
            onClick={() => setSidebarActive('reports')}
          >
            <FaFileAlt /> Reports
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'alerts' ? 'active' : ''}`}
            onClick={() => setSidebarActive('alerts')}
          >
            ⚠️ System Alerts
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'insights' ? 'active' : ''}`}
            onClick={() => setSidebarActive('insights')}
          >
            <FaChartPie /> Business Insights
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'trends' ? 'active' : ''}`}
            onClick={() => setSidebarActive('trends')}
          >
            <FaChartLine /> Trend Analysis
          </button>
          <button 
            className={`nav-item ${sidebarActive === 'performance' ? 'active' : ''}`}
            onClick={() => setSidebarActive('performance')}
          >
            🎯 Performance Metrics
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="panel-main">
        {sidebarActive === 'overview' && (
          <div className="panel-container analytics-panel">
            <div className="panel-header">
              <div className="header-info">
                <h1><FaChartBar /> Analytics & Reports Panel</h1>
                <p>Data insights, reports, and system analytics</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-primary">
                  <FaDownload /> Export Report
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
                className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => { setActiveTab('reports'); setSidebarActive('reports'); }}
              >
                <FaFileAlt /> Reports
              </button>
              <button 
                className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
                onClick={() => { setActiveTab('alerts'); setSidebarActive('alerts'); }}
              >
                ⚠️ Alerts
              </button>
              <button 
                className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
                onClick={() => { setActiveTab('insights'); setSidebarActive('insights'); }}
              >
                <FaChartPie /> Insights
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="tab-content">
                <div className="stats-grid">
                  <div className="stat-card total-views">
                    <div className="stat-icon">
                      <FaChartLine />
                    </div>
                    <div className="stat-info">
                      <h3>{analyticsStats.totalViews.toLocaleString()}</h3>
                      <p>Total Page Views</p>
                      <span className="stat-change positive">+22% this month</span>
                    </div>
                  </div>
                  
                  <div className="stat-card active-users">
                    <div className="stat-icon">
                      👥
                    </div>
                    <div className="stat-info">
                      <h3>{analyticsStats.activeUsers}</h3>
                      <p>Active Users</p>
                      <span className="stat-change positive">+15% growth</span>
                    </div>
                  </div>
                  
                  <div className="stat-card conversion">
                    <div className="stat-icon">
                      <FaChartPie />
                    </div>
                    <div className="stat-info">
                      <h3>{analyticsStats.conversionRate}%</h3>
                      <p>Conversion Rate</p>
                      <span className="stat-change positive">Above average</span>
                    </div>
                  </div>
                  
                  <div className="stat-card revenue">
                    <div className="stat-icon">
                      💰
                    </div>
                    <div className="stat-info">
                      <h3>${analyticsStats.revenue.toLocaleString()}</h3>
                      <p>Total Revenue</p>
                      <span className="stat-change positive">+31% increase</span>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="action-grid">
                    <button className="action-card" onClick={() => setSidebarActive('reports')}>
                      <FaFileAlt />
                      <span>Generate Report</span>
                    </button>
                    <button className="action-card" onClick={() => setSidebarActive('alerts')}>
                      ⚠️
                      <span>View Alerts</span>
                    </button>
                    <button className="action-card" onClick={() => setSidebarActive('insights')}>
                      <FaChartPie />
                      <span>Business Insights</span>
                    </button>
                    <button className="action-card" onClick={() => setSidebarActive('trends')}>
                      <FaChartLine />
                      <span>Trend Analysis</span>
                    </button>
                  </div>
                </div>

                <div className="performance-metrics">
                  <h3>Key Performance Indicators</h3>
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <div className="metric-header">
                        <span className="metric-label">User Engagement</span>
                        <span className="metric-value">87%</span>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{width: '87%'}}></div>
                      </div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-header">
                        <span className="metric-label">System Performance</span>
                        <span className="metric-value">94%</span>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{width: '94%'}}></div>
                      </div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-header">
                        <span className="metric-label">Customer Satisfaction</span>
                        <span className="metric-value">96%</span>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{width: '96%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">📊</span>
                      <div className="activity-content">
                        <p>Monthly sales analytics report generated</p>
                        <small>2 hours ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">⚠️</span>
                      <div className="activity-content">
                        <p>High traffic alert: Platform experiencing surge</p>
                        <small>4 hours ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">💾</span>
                      <div className="activity-content">
                        <p>User behavior analysis dataset exported</p>
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

export default AnalyticsPanel;
