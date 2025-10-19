import React, { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders({ setActiveTab, setCurrentView }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userid = localStorage.getItem("userId") || "demoUser";
      const res = await fetch(`http://localhost:5001/api/orders/user/${userid}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      setOrders(data.data || []);
    } catch (_) {
      setError("Could not load orders.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some((it) => it.itemName?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const viewOrder = (order) => {
    // Store order data for OrderDetail component
    sessionStorage.setItem('selectedOrder', JSON.stringify(order));
    if (setCurrentView) {
      setCurrentView('order-detail');
    }
  };

  const editOrder = (order) => {
    if (order.status !== 'Pending') {
      alert('Only pending orders can be edited.');
      return;
    }
    
    // Get the first item to edit
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      const book = {
        _id: firstItem.bookId,
        itemName: firstItem.itemName,
        price: firstItem.price,
        bookId: firstItem.bookId,
        quantity: 100 // We don't know the actual stock, so set a high number
      };
      
      // Store both book and order data for editing
      sessionStorage.setItem('selectedBook', JSON.stringify(book));
      sessionStorage.setItem('editingOrder', JSON.stringify({
        orderId: order._id,
        customerName: order.customerName,
        customerContact: order.customerContact,
        quantity: firstItem.quantity
      }));
      
      if (setCurrentView) {
        setCurrentView('add-order');
      }
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${orderId}`, { 
        method: "DELETE" 
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      
      // Refresh orders list
      fetchOrders();
      alert("Order deleted successfully");
    } catch (e) { 
      alert(e.message || "Failed to delete order"); 
    }
  };

  const clickToPay = (order) => {
    // Navigate to payment - you can customize this based on your payment system
    alert(`Redirecting to payment for Order ${order.orderId || order._id}\nAmount: Rs. ${order.totalPrice}`);
    // In a real system, you would integrate with a payment gateway here
  };

  return (
    <div className="myorders-page">
      <div className="myorders-container">
        <h2>🧾 My Orders</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          View and manage your book orders. You can edit pending orders and make payments for approved ones.
        </p>
        
        <div className="filters">
          <input
            type="text"
            placeholder="Search by Order ID or Book Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {['All','Pending','Approved','Rejected','Cancelled','Completed'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="error-text">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No orders found. Start by browsing books!</p>
            <button 
              className="view-btn header-color"
              onClick={() => {
                if (setActiveTab) setActiveTab('books');
                if (setCurrentView) setCurrentView('books');
              }}
              style={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="orders-container">
            {filtered.map((order) => (
              <div key={order._id} className="order-card modern-order-card">
                <div className="order-header">
                  <div className="order-id">
                    <strong>Order #{order.orderId || order._id}</strong>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="order-content">
                  <div className="order-items">
                    <h4>📚 Items:</h4>
                    <ul className="items-list">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="item-name">{item.itemName}</span>
                          <span className="item-details">
                            Qty: {item.quantity} × Rs. {item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-item">
                      <span>Total Items:</span>
                      <span>{order.totalItems}</span>
                    </div>
                    <div className="summary-item total-price">
                      <span><strong>Total Price:</strong></span>
                      <span><strong>Rs. {order.totalPrice}</strong></span>
                    </div>
                    <div className="summary-item">
                      <span>Order Date:</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button 
                    className="view-btn"
                    onClick={() => viewOrder(order)}
                    style={{ 
                      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    View
                  </button>
                  
                  {order.status === 'Pending' && (
                    <>
                      <button 
                        className="edit-btn"
                        onClick={() => editOrder(order)}
                        style={{ 
                          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        Edit Order
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteOrder(order._id)}
                        style={{ 
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        Delete Order
                      </button>
                    </>
                  )}
                  
                  {order.status === 'Approved' && (
                    <button 
                      className="pay-btn"
                      onClick={() => clickToPay(order)}
                      style={{ 
                        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Click to Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;


