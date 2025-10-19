import React from "react";
import "./MyOrders.css";

function UserOrdersDashboard({ setActiveTab, setCurrentView }) {
  
  const navigateToBooks = () => {
    if (setActiveTab) setActiveTab('books');
    if (setCurrentView) setCurrentView('books');
  };

  const navigateToMyOrders = () => {
    if (setActiveTab) setActiveTab('my-orders');
    if (setCurrentView) setCurrentView('my-orders');
  };

  return (
    <div className="myorders-page">
      <div className="myorders-container">
        <h2>🧾 Orders - User Dashboard</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Welcome to the Order Management System. Browse books and manage your orders.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="view-btn header-color" 
            onClick={navigateToBooks}
            style={{ 
              background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
          >
            📚 Browse Books
          </button>
          <button 
            className="view-btn header-color" 
            onClick={navigateToMyOrders}
            style={{ 
              background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
          >
            📋 My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserOrdersDashboard;


