// API service with role-based headers
class OrderAPI {
  constructor() {
    this.baseURL = 'http://localhost:5001/api/orders';
  }

  // Get user info from localStorage/auth context
  getUserHeaders() {
    const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('Admin') || '{}');
    return {
      'Content-Type': 'application/json',
      'user-id': user._id || user.id || '',
      'user-role': user.role || 'user',
      'user-email': user.email || ''
    };
  }

  // ADMIN ONLY: Get all orders with filters
  async getAllOrdersAdmin(filters = {}) {
    const headers = this.getUserHeaders();
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${this.baseURL}/admin${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    
    return data;
  }

  // USER: Get own orders only
  async getUserOrders(userId) {
    const headers = this.getUserHeaders();
    const response = await fetch(`${this.baseURL}/user/${userId}`, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    
    return data;
  }

  // USER: Create new order
  async createOrder(orderData) {
    const headers = this.getUserHeaders();
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }
    
    return data;
  }

  // ADMIN ONLY: Approve order
  async approveOrder(orderId, approvalData = {}) {
    const headers = this.getUserHeaders();
    const response = await fetch(`${this.baseURL}/${orderId}/approve`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(approvalData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to approve order');
    }
    
    return data;
  }

  // ADMIN ONLY: Reject order
  async rejectOrder(orderId, rejectionData = {}) {
    const headers = this.getUserHeaders();
    const response = await fetch(`${this.baseURL}/${orderId}/reject`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(rejectionData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reject order');
    }
    
    return data;
  }

  // USER: Cancel own order (if pending)
  async cancelOrder(orderId) {
    const headers = this.getUserHeaders();
    const response = await fetch(`${this.baseURL}/${orderId}/cancel`, {
      method: 'PATCH',
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel order');
    }
    
    return data;
  }

  // Get books catalog (accessible to all)
  async getBooks() {
    const response = await fetch(`${this.baseURL}/books`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch books');
    }
    
    return data;
  }
}

export default new OrderAPI();