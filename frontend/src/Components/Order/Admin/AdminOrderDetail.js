import React, { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrderDetail({ setActiveTab, setCurrentView }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Get order data from sessionStorage
    const orderData = sessionStorage.getItem('selectedOrderForAdmin');
    if (orderData) {
      const parsedOrder = JSON.parse(orderData);
      setOrder(parsedOrder);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const approve = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${order._id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...order, 
          status: "Approved", 
          approvedBy: "Admin",
          approvedAt: new Date().toISOString()
        }) 
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to approve order");
      
      // Update local state
      setOrder(prev => ({ ...prev, status: "Approved", approvedBy: "Admin" }));
      alert("Order approved successfully!");
    } catch (e) {
      console.error("Error approving order:", e);
      alert(e.message || "Failed to approve order");
    } finally { 
      setSaving(false); 
    }
  };

  const reject = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${order._id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...order, 
          status: "Rejected", 
          rejectedBy: "Admin",
          rejectedAt: new Date().toISOString()
        }) 
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to reject order");
      
      // Update local state
      setOrder(prev => ({ ...prev, status: "Rejected", rejectedBy: "Admin" }));
      alert("Order rejected successfully!");
    } catch (e) {
      console.error("Error rejecting order:", e);
      alert(e.message || "Failed to reject order");
    } finally { setSaving(false); }
  };

  const deleteOrder = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${order._id}`, { 
        method: "DELETE" 
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete order");
      
      alert("Order deleted successfully!");
      goBack();
    } catch (e) {
      console.error("Error deleting order:", e);
      alert(e.message || "Failed to delete order");
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (setActiveTab && setCurrentView) {
      setCurrentView('orders-table');
    }
  };

  if (loading) return <div className="orders-page"><div className="orders-container"><p>Loading order...</p></div></div>;
  if (!order) return <div className="orders-page"><div className="orders-container"><p>Order not found. Please select an order from the orders table.</p></div></div>;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <button 
          className="back-btn" 
          onClick={goBack}
          style={{ marginBottom: '1rem' }}
        >
          ← Back to Orders
        </button>
        <div className="order-card">
          <div className="order-card-header">
            <div><span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>{order.status || 'Pending'}</span></div>
            <div>Order ID: {order.orderId || order._id}</div>
          </div>
          <div className="order-card-body">
            <div><strong>Customer:</strong> {order.customerName || order.username || 'N/A'}</div>
            <div><strong>Contact:</strong> {order.contactNumber || 'N/A'}</div>
            <div><strong>Items:</strong>
              <ul>
                {(order.items || []).map((it, idx) => (
                  <li key={idx}>
                    <span className="order-book-id">{it.bookId || it.bookCode}</span> - {it.itemName} × {it.quantity} 
                    <span className="order-item-price"> Rs. {it.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div><strong>Total Items:</strong> {order.totalItems || order.items?.length || 0}</div>
            <div><strong>Total Price:</strong> Rs. {order.totalPrice}</div>
            <div><strong>Placed On:</strong> {new Date(order.createdAt || order.placedAt || Date.now()).toLocaleString()}</div>
          </div>
          
          {/* Admin Actions based on order status */}
          {order.status === "Pending" && (
            <div className="actions-row">
              <button 
                className="view-btn" 
                onClick={approve} 
                disabled={saving}
                style={{ 
                  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                  marginRight: '10px'
                }}
              >
                {saving ? '⏳ Processing...' : '✅ Approve'}
              </button>
              <button 
                className="view-btn danger" 
                onClick={reject} 
                disabled={saving}
                style={{ 
                  background: '#e74c3c'
                }}
              >
                {saving ? '⏳ Processing...' : '❌ Reject'}
              </button>
            </div>
          )}
          
          {order.status === "Approved" && (
            <div className="actions-row">
              <div 
                style={{ 
                  padding: '10px 15px', 
                  background: '#f39c12', 
                  color: 'white', 
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}
              >
                💰 Waiting for Payment
              </div>
            </div>
          )}
          
          {['Completed','Cancelled','Rejected'].includes(order.status) && (
            <div className="actions-row">
              <button 
                className="view-btn muted" 
                onClick={deleteOrder}
                disabled={saving}
                style={{ 
                  background: '#95a5a6'
                }}
              >
                {saving ? '⏳ Deleting...' : '🗑️ Delete Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;


