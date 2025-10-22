import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaTimes, 
  FaSyncAlt, 
  FaBox, 
  FaCog,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaWarehouse,
  FaEye,
  FaHistory,
  FaDownload,
  FaBolt,
  FaShoppingCart,
  FaCalendarAlt,
  FaUser,
  FaBookOpen
} from 'react-icons/fa';
import { useInventory } from '../contexts/InventoryContext';
import './Alerts.css';

const Alerts = ({ setCurrentPage }) => {
  const { 
    alerts, 
    inventory,
    lastUpdated,
    dismissAlert,
    clearAllAlerts,
    syncWithProducts,
    getStockStatus
  } = useInventory();

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15); // Reduced to 15 seconds for more frequent updates
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Auto refresh inventory data
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(async () => {
        const previousAlertCount = alerts.length;
        setRefreshing(true);
        
        try {
          await syncWithProducts();
          
          // Check if alerts have changed after a brief delay to allow context updates
          setTimeout(() => {
            const currentAlertCount = alerts.length;
            if (currentAlertCount !== previousAlertCount) {
              showNotification(`🔔 Alerts updated: ${currentAlertCount} active alerts`);
            }
          }, 1000);
          
        } catch (error) {
          console.error('Auto-refresh failed:', error);
        } finally {
          setRefreshing(false);
        }
      }, refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, syncWithProducts, alerts.length]);

  // Monitor inventory changes and trigger refresh when needed
  useEffect(() => {
    // This will trigger when inventory or alerts change from context
    if (inventory.length > 0) {
      console.log('Inventory updated, alerts should refresh automatically');
    }
  }, [inventory, alerts]);

  // Initial refresh on component mount
  useEffect(() => {
    // Force refresh when component loads
    const performInitialRefresh = async () => {
      setRefreshing(true);
      try {
        await syncWithProducts();
        showNotification("🔄 Alerts page loaded - inventory synchronized");
      } catch (error) {
        console.error('Initial refresh failed:', error);
        showNotification("⚠️ Warning: Failed to sync with latest inventory data");
      } finally {
        setRefreshing(false);
      }
    };
    
    performInitialRefresh();
  }, []); // Only run once on mount

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Force a complete refresh of inventory data
      await syncWithProducts();
      
      // Clear any cached data
      localStorage.removeItem('inventory');
      
      // Wait a moment for the context to update
      setTimeout(() => {
        showNotification(`✅ Inventory data refreshed at ${new Date().toLocaleTimeString()}`);
      }, 500);
      
    } catch (error) {
      console.error('Refresh error:', error);
      showNotification("❌ Failed to refresh inventory data - check network connection");
    } finally {
      setRefreshing(false);
    }
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case 'out-of-stock':
        return 'alert-critical';
      case 'critical':
        return 'alert-critical';
      case 'very-low':
        return 'alert-warning';
      case 'low':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'out-of-stock':
        return <FaTimesCircle />;
      case 'critical':
        return <FaExclamationTriangle />;
      case 'very-low':
        return <FaExclamationTriangle />;
      case 'low':
        return <FaBell />;
      default:
        return <FaBell />;
    }
  };

  const getCriticalCount = () => {
    return inventory.filter(item => getStockStatus(item.stock, item.threshold) === "critical").length;
  };

  const getOutOfStockCount = () => {
    return inventory.filter(item => getStockStatus(item.stock, item.threshold) === "out-of-stock").length;
  };

  const getTotalLowStockCount = () => {
    return inventory.filter(item => {
      const status = getStockStatus(item.stock, item.threshold);
      return status === "out-of-stock" || status === "critical" || status === "very-low" || status === "low";
    }).length;
  };

  // Filter and sort alerts
  const getFilteredAlerts = () => {
    let filtered = alerts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    // Sort alerts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return a.priority - b.priority;
        case "name":
          return (a.item?.name || a.item?.title || "").localeCompare(b.item?.name || b.item?.title || "");
        case "stock":
          return (a.item?.stock || 0) - (b.item?.stock || 0);
        case "timestamp":
          return new Date(b.timestamp) - new Date(a.timestamp);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getAlertBadgeContent = (type) => {
    switch (type) {
      case 'out-of-stock':
        return { text: 'URGENT', color: '#dc2626' };
      case 'critical':
        return { text: 'HIGH', color: '#ea580c' };
      case 'very-low':
        return { text: 'MEDIUM', color: '#d97706' };
      case 'low':
        return { text: 'LOW', color: '#0891b2' };
      default:
        return { text: 'INFO', color: '#6b7280' };
    }
  };

  const getProgressPercentage = (current, threshold) => {
    if (!threshold) return 0;
    return Math.min((current / threshold) * 100, 100);
  };

  const getStockLevelText = (stock, threshold) => {
    const status = getStockStatus(stock, threshold);
    switch (status) {
      case 'out-of-stock':
        return 'Out of Stock';
      case 'critical':
        return 'Critically Low';
      case 'very-low':
        return 'Very Low Stock';
      case 'low':
        return 'Low Stock';
      default:
        return 'Adequate Stock';
    }
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalAlerts: alerts.length,
      outOfStock: getOutOfStockCount(),
      critical: getCriticalCount(),
      totalLowStock: getTotalLowStockCount(),
      alerts: alerts.map(alert => ({
        type: alert.type,
        item: alert.item?.name || alert.item?.title,
        stock: alert.item?.stock,
        threshold: alert.item?.threshold,
        message: alert.message,
        timestamp: alert.timestamp
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `inventory-alerts-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification("Alert report downloaded successfully!");
  };

  return (
    <div className="alerts-container">
      {/* Enhanced Header with Gradient Background */}
      <div className="alerts-header">
        <div className="header-left">
          <div className="header-title-section">
            <div className="title-with-badge">
              <h2>
                <FaBell className="page-icon pulse" />
                Inventory Alert Center
              </h2>
              {alerts.length > 0 && (
                <span className="alert-count-badge">{alerts.length}</span>
              )}
            </div>
            <div className="header-meta">
              <span className="last-updated">
                <FaCalendarAlt className="meta-icon" />
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </span>
              <span className="status-indicator">
                <div className={`status-dot ${alerts.length > 0 ? 'active' : 'inactive'}`}></div>
                {alerts.length > 0 ? 'Active Alerts' : 'All Clear'}
              </span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button 
              className="action-btn download-btn"
              onClick={downloadReport}
              title="Download Report"
            >
              <FaDownload />
            </button>
            <button 
              className="action-btn filter-btn"
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle Filters"
            >
              <FaFilter />
            </button>
            <button 
              className={`action-btn refresh-btn ${refreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh Data"
            >
              <FaSyncAlt className={refreshing ? 'spinning' : ''} />
            </button>
            <button 
              className="action-btn settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <FaCog />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Settings Panel */}
      {showSettings && (
        <div className="settings-panel enhanced">
          <div className="settings-header">
            <h3><FaCog className="settings-icon" /> Alert Configuration</h3>
            <button className="close-settings" onClick={() => setShowSettings(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="settings-grid">
            <div className="setting-group">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <span className="checkmark"></span>
                Auto-refresh enabled
              </label>
              <p className="setting-description">Automatically refresh inventory data</p>
            </div>
            <div className="setting-group">
              <label className="setting-label">Refresh interval</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  className="slider"
                />
                <span className="slider-value">{refreshInterval}s</span>
              </div>
            </div>
            <div className="setting-group">
              <label className="setting-label">View Mode</label>
              <div className="view-mode-toggle">
                <button 
                  className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button 
                  className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Filter Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h4><FaFilter className="filter-icon" /> Filter & Search</h4>
          </div>
          <div className="filters-content">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search alerts by item name or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="critical">Critical</option>
                <option value="very-low">Very Low</option>
                <option value="low">Low Stock</option>
              </select>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="priority">Sort by Priority</option>
                <option value="name">Sort by Name</option>
                <option value="stock">Sort by Stock Level</option>
                <option value="timestamp">Sort by Time</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Summary Dashboard */}
      <div className="alert-dashboard">
        <div className="summary-grid">
          <div className="summary-card critical enhanced">
            <div className="card-icon">
              <FaTimesCircle />
            </div>
            <div className="card-content">
              <div className="card-number">{getOutOfStockCount()}</div>
              <div className="card-label">Out of Stock</div>
              <div className="card-trend">
                <FaBolt className="trend-icon" />
                Requires immediate action
              </div>
            </div>
            <div className="card-progress">
              <div className="progress-bar critical" style={{width: getOutOfStockCount() > 0 ? '100%' : '0%'}}></div>
            </div>
          </div>

          <div className="summary-card warning enhanced">
            <div className="card-icon">
              <FaExclamationTriangle />
            </div>
            <div className="card-content">
              <div className="card-number">{getCriticalCount()}</div>
              <div className="card-label">Critical Stock</div>
              <div className="card-trend">
                <FaChartLine className="trend-icon" />
                Restock recommended
              </div>
            </div>
            <div className="card-progress">
              <div className="progress-bar warning" style={{width: getCriticalCount() > 0 ? '75%' : '0%'}}></div>
            </div>
          </div>

          <div className="summary-card info enhanced">
            <div className="card-icon">
              <FaWarehouse />
            </div>
            <div className="card-content">
              <div className="card-number">{getTotalLowStockCount()}</div>
              <div className="card-label">Total Alerts</div>
              <div className="card-trend">
                <FaHistory className="trend-icon" />
                Monitor closely
              </div>
            </div>
            <div className="card-progress">
              <div className="progress-bar info" style={{width: getTotalLowStockCount() > 0 ? '50%' : '0%'}}></div>
            </div>
          </div>

          <div className="summary-card success enhanced">
            <div className="card-icon">
              <FaBookOpen />
            </div>
            <div className="card-content">
              <div className="card-number">{inventory.length}</div>
              <div className="card-label">Total Items</div>
              <div className="card-trend">
                <FaUser className="trend-icon" />
                Inventory overview
              </div>
            </div>
            <div className="card-progress">
              <div className="progress-bar success" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Alerts Content */}
      <div className="alerts-content">
        {getFilteredAlerts().length === 0 ? (
          <div className="no-alerts enhanced">
            <div className="no-alerts-illustration">
              <FaBox className="no-alerts-icon" />
              <div className="success-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <h3>All Systems Green!</h3>
            <p>No active alerts at this time. Your inventory levels are properly maintained.</p>
            <div className="no-alerts-stats">
              <span className="stat-item">
                <FaWarehouse className="stat-icon" />
                {inventory.length} items monitored
              </span>
              <span className="stat-item">
                <FaChartLine className="stat-icon" />
                System healthy
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="alerts-actions enhanced">
              <div className="actions-left">
                <span className="alert-count">
                  <FaBell className="count-icon" />
                  {getFilteredAlerts().length} of {alerts.length} alerts
                  {searchTerm && (
                    <span className="search-info">matching "{searchTerm}"</span>
                  )}
                </span>
              </div>
              <div className="actions-right">
                <button 
                  className="action-btn clear-all-btn"
                  onClick={clearAllAlerts}
                  title="Clear All Alerts"
                >
                  <FaTimes className="btn-icon" />
                  Clear All
                </button>
              </div>
            </div>
            
            <div className={`alerts-list ${viewMode}`}>
              {getFilteredAlerts().map((alert, index) => {
                const badge = getAlertBadgeContent(alert.type);
                const progressPercentage = getProgressPercentage(alert.item?.stock || 0, alert.item?.threshold || 10);
                
                return (
                  <div 
                    key={alert.id} 
                    className={`alert-item enhanced ${getAlertStyle(alert.type)} ${viewMode}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="alert-priority-bar" style={{ backgroundColor: badge.color }}></div>
                    
                    <div className="alert-main-content">
                      <div className="alert-header">
                        <div className="alert-icon-wrapper">
                          <div className="alert-icon">
                            {getAlertIcon(alert.type)}
                          </div>
                          <span className="alert-badge" style={{ backgroundColor: badge.color }}>
                            {badge.text}
                          </span>
                        </div>
                        <div className="alert-meta">
                          <span className="alert-time">
                            <FaCalendarAlt className="meta-icon" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                          <button 
                            className="detail-btn"
                            onClick={() => handleAlertClick(alert)}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>

                      <div className="alert-body">
                        <div className="alert-info">
                          <h4 className="item-name">{alert.item?.name || alert.item?.title || 'Unknown Item'}</h4>
                          <p className="alert-message">{alert.message}</p>
                          
                          <div className="stock-info">
                            <div className="stock-details">
                              <span className="stock-current">
                                Current: <strong>{alert.item?.stock || 0}</strong>
                              </span>
                              <span className="stock-threshold">
                                Threshold: <strong>{alert.item?.threshold || 10}</strong>
                              </span>
                              <span className="stock-status">
                                {getStockLevelText(alert.item?.stock || 0, alert.item?.threshold || 10)}
                              </span>
                            </div>
                            
                            <div className="progress-container">
                              <div className="progress-track">
                                <div 
                                  className={`progress-fill ${alert.type}`} 
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="progress-text">{Math.round(progressPercentage)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="alert-actions enhanced">
                          <button 
                            className="action-btn restock-btn"
                            onClick={() => setCurrentPage('products')}
                            title="Go to Products"
                          >
                            <FaShoppingCart className="btn-icon" />
                            Restock
                          </button>
                          <button 
                            className="action-btn dismiss-btn"
                            onClick={() => dismissAlert(alert.id)}
                            title="Dismiss Alert"
                          >
                            <FaTimes className="btn-icon" />
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="close-btn enhanced"
                      onClick={() => dismissAlert(alert.id)}
                      title="Dismiss"
                    >
                      <FaTimes />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Notification */}
      {notification && (
        <div className="notification enhanced success">
          <div className="notification-content">
            <div className="notification-icon">
              <FaBell />
            </div>
            <span className="notification-text">{notification}</span>
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification("")}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Alert Detail Modal */}
      {showDetailModal && selectedAlert && (
        <div className="modal-overlay enhanced">
          <div className="modal enhanced">
            <div className="modal-header">
              <h3>
                <FaEye className="modal-icon" />
                Alert Details
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Item Information</h4>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedAlert.item?.name || selectedAlert.item?.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Current Stock:</label>
                    <span className="stock-value">{selectedAlert.item?.stock || 0} units</span>
                  </div>
                  <div className="detail-item">
                    <label>Threshold:</label>
                    <span>{selectedAlert.item?.threshold || 10} units</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedAlert.type}`}>
                      {getStockLevelText(selectedAlert.item?.stock || 0, selectedAlert.item?.threshold || 10)}
                    </span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Alert Information</h4>
                  <div className="detail-item">
                    <label>Priority:</label>
                    <span className={`priority-badge ${selectedAlert.type}`}>
                      {getAlertBadgeContent(selectedAlert.type).text}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Generated:</label>
                    <span>{new Date(selectedAlert.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Message:</label>
                    <span className="alert-message-detail">{selectedAlert.message}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="action-btn primary"
                onClick={() => {
                  setCurrentPage('products');
                  setShowDetailModal(false);
                }}
              >
                <FaShoppingCart className="btn-icon" />
                Go to Products
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
