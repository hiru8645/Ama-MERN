import React from 'react';

const DataRefresh = () => {
  const clearAllData = () => {
    // Clear all session storage
    sessionStorage.clear();
    
    // Clear local storage book/order related data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('book') || key.includes('order') || key.includes('Book') || key.includes('Order'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Force page reload to refresh all data
    window.location.reload();
  };

  const refreshBookData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/orders/books');
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('Available books:', data.data);
        alert(`Found ${data.data.length} books in database. Check console for details.`);
      } else {
        console.error('Error fetching books:', data);
        alert('Error fetching books. Check console for details.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Make sure backend is running on port 5001.');
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '15px', 
      border: '2px solid #e74c3c',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 9999 
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#e74c3c' }}>🔧 Debug Tools</h4>
      <button 
        onClick={clearAllData}
        style={{
          display: 'block',
          width: '100%',
          margin: '5px 0',
          padding: '8px',
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🗑️ Clear Cache & Reload
      </button>
      <button 
        onClick={refreshBookData}
        style={{
          display: 'block',
          width: '100%',
          margin: '5px 0',
          padding: '8px',
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        📚 Test Book API
      </button>
    </div>
  );
};

export default DataRefresh;