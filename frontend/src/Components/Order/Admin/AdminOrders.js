import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import AdminOrderPDFGenerator from "./AdminOrderPDFGenerator";

function AdminOrders({ setActiveTab, setCurrentView }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5001/api/orders");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Could not load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.username?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2 style={{ margin: 0, marginBottom: 12 }}>📦 Orders Management</h2>
        <div className="filters" style={{ display:'flex', alignItems:'center', gap: 10, justifyContent:'space-between', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, flex: 1, minWidth: 260 }}>
            <input
              type="text"
              placeholder="Search by Order ID or User"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {['All','Pending','Approved','Rejected','Cancelled','Completed'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <AdminOrderPDFGenerator orders={filtered} filters={{ status: statusFilter, search }} />
          </div>
        </div>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Total Items</th>
                <th>Total Price</th>
                <th>Placed On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderId || o._id}</td>
                  <td>{o.username}</td>
                  <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td>{o.totalItems}</td>
                  <td>Rs. {o.totalPrice}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <button 
                      className="view-btn" 
                      onClick={() => {
                        // Store order data for the detail view
                        sessionStorage.setItem('selectedOrderForAdmin', JSON.stringify(o));
                        setCurrentView('order-detail');
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;


