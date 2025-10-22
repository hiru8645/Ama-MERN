import React, { useState } from 'react';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-10-04' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-10-05' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', role: 'Staff', status: 'Active', lastLogin: '2024-10-03' },
    { id: 4, name: 'Emily Brown', email: 'emily@example.com', role: 'Customer', status: 'Inactive', lastLogin: '2024-09-28' },
    { id: 5, name: 'Alex Wilson', email: 'alex@example.com', role: 'Staff', status: 'Active', lastLogin: '2024-10-05' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Customer',
    status: 'Active'
  });

  const roles = ['All', 'Admin', 'Manager', 'Staff', 'Customer'];
  const statuses = ['All', 'Active', 'Inactive'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        ...newUser,
        lastLogin: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'Customer', status: 'Active' });
      setShowAddForm(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
    setShowAddForm(true);
  };

  const handleUpdateUser = () => {
    setUsers(users.map(user => 
      user.id === editingUser.id ? { ...newUser, id: editingUser.id } : user
    ));
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'Customer', status: 'Active' });
    setShowAddForm(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h2><FaUsers /> User Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FaPlus /> Add New User
        </button>
      </div>

      <div className="management-controls">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role} Role</option>
            ))}
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status} Status</option>
            ))}
          </select>
        </div>
      </div>

      {showAddForm && (
        <div className="add-form-container">
          <div className="add-form">
            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="form-input"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="form-input"
              >
                <option value="Customer">Customer</option>
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                className="form-input"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                  setNewUser({ name: '', email: '', role: 'Customer', status: 'Active' });
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={editingUser ? handleUpdateUser : handleAddUser}
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="users-table">
        <div className="table-header">
          <div className="table-row header">
            <div className="table-cell">Name</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Role</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Last Login</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          {filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="table-cell">
                <div className="user-info">
                  <div className="user-avatar">{user.name.charAt(0)}</div>
                  <span className="user-name">{user.name}</span>
                </div>
              </div>
              <div className="table-cell">{user.email}</div>
              <div className="table-cell">
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <div className="table-cell">
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
              <div className="table-cell">{user.lastLogin}</div>
              <div className="table-cell">
                <div className="actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditUser(user)}
                    title="Edit User"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="no-results">
          <p>No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
