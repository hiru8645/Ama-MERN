import React, { useEffect, useState } from "react";
import "./OrderDetail.css";

function OrderDetail({ setActiveTab, setCurrentView }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load order from sessionStorage
    const selectedOrder = sessionStorage.getItem('selectedOrder');
    if (selectedOrder) {
      try {
        const orderData = JSON.parse(selectedOrder);
        setOrder(orderData);
      } catch (e) {
        console.error('Error parsing order data:', e);
      }
    }
    setLoading(false);
  }, []);

  const goBack = () => {
    sessionStorage.removeItem('selectedOrder');
    if (setActiveTab && setCurrentView) {
      setActiveTab('my-orders');
      setCurrentView('my-orders');
    }
  };

  const deleteOrder = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${order._id}`, { 
        method: "DELETE" 
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      
      alert("Order deleted successfully");
      goBack();
    } catch (e) { 
      alert(e.message || "Failed to delete order"); 
    }
  };

  const editOrder = () => {
    if (!order || !order.items || order.items.length === 0) return;
    
    if (order.status !== 'Pending') {
      alert('Only pending orders can be edited.');
      return;
    }
    
    const firstItem = order.items[0];
    const book = {
      _id: firstItem.bookId,
      itemName: firstItem.itemName,
      price: firstItem.price,
      bookId: firstItem.bookId,
      quantity: 100 // We don't know actual stock, set high number
    };
    
    // Store book and editing data
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
  };

  const clickToPay = () => {
    alert(`Redirecting to payment for Order ${order.orderId || order._id}\nAmount: Rs. ${order.totalPrice}`);
    // In a real system, integrate with payment gateway
  };

  if (loading) {
    return (
      <div className="orderdetail-page">
        <div className="orderdetail-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orderdetail-page">
        <div className="orderdetail-container">
          <p>Order not found.</p>
          <button className="back-btn" onClick={goBack}>
            ← Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orderdetail-page">
      <div className="orderdetail-container">
        <button 
          className="back-btn" 
          onClick={goBack}
          style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back to My Orders
        </button>
        
        <div className="order-detail-card">
          <div className="order-detail-header">
            <div className="order-title">
              <h2>📋 Order Details</h2>
              <div className="order-id-display">Order #{order.orderId || order._id}</div>
            </div>
            <div className="order-status-display">
              <span className={`status-badge large ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>
          
          <div className="order-detail-content">
            <div className="detail-section">
              <h3>👤 Customer Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{order.customerName || order.username}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Contact:</span>
                  <span className="value">{order.customerContact || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">User ID:</span>
                  <span className="value">{order.username}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>📚 Order Items</h3>
              <div className="items-detail">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-detail-card">
                    <div className="item-info">
                      <div className="item-name">{item.itemName}</div>
                      <div className="item-code">Code: {item.bookId}</div>
                    </div>
                    <div className="item-pricing">
                      <div>Quantity: {item.quantity}</div>
                      <div>Price: Rs. {item.price}</div>
                      <div className="item-total">Total: Rs. {(item.quantity * item.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>💰 Order Summary</h3>
              <div className="summary-detail">
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{order.totalItems}</span>
                </div>
                <div className="summary-row total">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>Rs. {order.totalPrice}</strong></span>
                </div>
                <div className="summary-row">
                  <span>Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-actions-detail">
            {order.status === 'Pending' && (
              <>
                <button 
                  className="edit-btn-detail"
                  onClick={editOrder}
                  style={{ 
                    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Edit Order
                </button>
                <button 
                  className="delete-btn-detail"
                  onClick={deleteOrder}
                  style={{ 
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Delete Order
                </button>
              </>
            )}
            
            {order.status === 'Approved' && (
              <button 
                className="pay-btn-detail"
                onClick={clickToPay}
                style={{ 
                  background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Click to Pay
              </button>
            )}
            
            {['Completed', 'Cancelled', 'Rejected'].includes(order.status) && (
              <button 
                className="delete-btn-detail muted"
                onClick={deleteOrder}
                style={{ 
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Delete Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;


