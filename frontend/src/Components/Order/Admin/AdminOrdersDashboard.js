import React from "react";
import "./AdminOrders.css";

function AdminOrdersDashboard({ setActiveTab, setCurrentView }) {
  
  const goToOrdersTable = () => {
    if (setActiveTab && setCurrentView) {
      setActiveTab('orders');
      setCurrentView('orders-table');
    }
  };

  return (
    <div className="admin-orders-dashboard" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      minHeight: '100vh', 
      padding: '2rem',
      background: '#f8f9fa'
    }}>
      <div className="orders-container" style={{
        maxWidth: '1200px',
        width: '100%',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <div className="dashboard-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div className="dashboard-actions" style={{ marginBottom: '2rem' }}>
            <button 
              className="go-to-orders-btn"
              onClick={goToOrdersTable}
              style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            >
              📋 Go to Orders Table
            </button>
          </div>

          <div className="dashboard-info" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            width: '100%',
            maxWidth: '900px',
            justifyItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📊</div>
                <div>
                  <h3 style={{ margin: 0, color: '#2c3e50' }}>Order Management</h3>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>View all customer orders, approve pending orders, and track order status.</p>
                </div>
              </div>
            </div>

            <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🔍</div>
                <div>
                  <h3 style={{ margin: 0, color: '#2c3e50' }}>Search & Filter</h3>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Find orders quickly using advanced search and filter options.</p>
                </div>
              </div>
            </div>

            <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📄</div>
                <div>
                  <h3 style={{ margin: 0, color: '#2c3e50' }}>Generate Reports</h3>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Download comprehensive order reports in PDF format.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersDashboard;


