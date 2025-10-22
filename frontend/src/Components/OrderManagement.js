import React, { useState } from 'react';
import { FaClipboardList, FaPlus, FaEdit, FaEye, FaSearch, FaTruck } from 'react-icons/fa';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    { id: 'ORD-2024-1089', customer: 'John Smith', items: 3, total: 245.99, status: 'Pending', date: '2024-10-05', priority: 'High' },
    { id: 'ORD-2024-1088', customer: 'Sarah Johnson', items: 2, total: 189.50, status: 'Processing', date: '2024-10-05', priority: 'Medium' },
    { id: 'ORD-2024-1087', customer: 'Mike Davis', items: 5, total: 456.75, status: 'Shipped', date: '2024-10-04', priority: 'Low' },
    { id: 'ORD-2024-1086', customer: 'Emily Brown', items: 1, total: 89.99, status: 'Delivered', date: '2024-10-03', priority: 'Medium' },
    { id: 'ORD-2024-1085', customer: 'Alex Wilson', items: 4, total: 321.25, status: 'Delivered', date: '2024-10-03', priority: 'High' },
    { id: 'ORD-2024-1084', customer: 'Lisa Garcia', items: 2, total: 156.80, status: 'Cancelled', date: '2024-10-02', priority: 'Low' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const priorities = ['All', 'Low', 'Medium', 'High'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ff9800',
      'Processing': '#2196f3',
      'Shipped': '#9c27b0',
      'Delivered': '#4caf50',
      'Cancelled': '#f44336'
    };
    return colors[status] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#4caf50',
      'Medium': '#ff9800',
      'High': '#f44336'
    };
    return colors[priority] || '#666';
  };

  return (
    <div className="order-management">
      <div className="management-header">
        <h2><FaClipboardList /> Order Management</h2>
        <button className="btn btn-primary">
          <FaPlus /> Create New Order
        </button>
      </div>

      <div className="management-controls">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search orders by ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status} Status</option>
            ))}
          </select>
          
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority} Priority</option>
            ))}
          </select>
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <div className="table-row header">
            <div className="table-cell">Order ID</div>
            <div className="table-cell">Customer</div>
            <div className="table-cell">Items</div>
            <div className="table-cell">Total</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Priority</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          {filteredOrders.map(order => (
            <div key={order.id} className="table-row">
              <div className="table-cell">
                <span className="order-id">{order.id}</span>
              </div>
              <div className="table-cell">
                <div className="customer-info">
                  <div className="customer-avatar">{order.customer.charAt(0)}</div>
                  <span className="customer-name">{order.customer}</span>
                </div>
              </div>
              <div className="table-cell">
                <span className="items-count">{order.items} items</span>
              </div>
              <div className="table-cell">
                <span className="order-total">Rs.{order.total}</span>
              </div>
              <div className="table-cell">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="status-select"
                  style={{ borderColor: getStatusColor(order.status) }}
                >
                  {statuses.slice(1).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="table-cell">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(order.priority) }}
                >
                  {order.priority}
                </span>
              </div>
              <div className="table-cell">{order.date}</div>
              <div className="table-cell">
                <div className="actions">
                  <button 
                    className="action-btn view"
                    onClick={() => handleViewOrder(order)}
                    title="View Order Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn edit"
                    title="Edit Order"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn track"
                    title="Track Order"
                  >
                    <FaTruck />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="no-results">
          <p>No orders found matching your criteria.</p>
        </div>
      )}

      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.id}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowOrderDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.customer}</p>
                <p><strong>Order Date:</strong> {selectedOrder.date}</p>
              </div>
              <div className="detail-section">
                <h4>Order Summary</h4>
                <p><strong>Items:</strong> {selectedOrder.items} items</p>
                <p><strong>Total:</strong> Rs.{selectedOrder.total}</p>
                <p><strong>Status:</strong> 
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Priority:</strong> 
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(selectedOrder.priority) }}
                  >
                    {selectedOrder.priority}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
