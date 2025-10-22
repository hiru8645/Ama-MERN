import React, { useState } from 'react';
import './AdminUsers.css';

const AdminUserAdd = ({ onBack }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    uni_id: '',
    password: '',
    role: 'user',
    contact_no: '',
    faculty: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErr('');

    // Basic validation
    if (!form.full_name || !form.email || !form.uni_id || !form.password) {
      setErr('Please fill in all required fields (Full Name, Email, University ID, Password)');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      setErr('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setErr('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      
      if (res.ok) {
        setMsg('User added successfully!');
        
        // Reset form
        setForm({
          full_name: '',
          email: '',
          uni_id: '',
          password: '',
          role: 'user',
          contact_no: '',
          faculty: ''
        });
        
        // Auto-navigate back to user list after successful addition
        setTimeout(() => {
          if (onBack) {
            onBack();
          }
        }, 2000);
      } else {
        setErr(data.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErr('Unable to connect to server. Please check if the backend is running.');
      } else {
        setErr('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users-bg">
      <div className="admin-users-container" style={{ padding: '20px' }}>
        <div className="admin-users-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>➕ Add New User</h2>
          <button 
            onClick={onBack}
            style={{ padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            ← Back to Users
          </button>
        </div>

        {msg && <div className="admin-users-success" style={{ padding: '10px', marginBottom: '15px', background: '#d4edda', color: '#155724', borderRadius: '5px' }}>{msg}</div>}
        {err && <div className="admin-users-error" style={{ padding: '10px', marginBottom: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>{err}</div>}

        <div className="user-add-form" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleAddUser}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div className="form-section">
                <h3 style={{ color: '#495057', marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>Personal Information</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
                    Full Name <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dbe2e8', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
                    Email <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dbe2e8', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact_no"
                    value={form.contact_no}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dbe2e8', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 style={{ color: '#495057', marginBottom: '15px', borderBottom: '2px solid #28a745', paddingBottom: '8px' }}>Academic Information</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
                    University ID <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="uni_id"
                    value={form.uni_id}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dbe2e8', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter university ID"
                    required
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dbe2e8', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
                    Faculty
                  </label>
                  <input
                    type="text"
                    name="faculty"
                    value={form.faculty}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dbe2e8', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter faculty"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
                    Password <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dbe2e8', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #dee2e6' }}>
              <button
                type="button"
                onClick={onBack}
                style={{ 
                  padding: '12px 24px', 
                  margin: '0 10px',
                  background: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ 
                  padding: '12px 24px', 
                  margin: '0 10px',
                  background: loading ? '#6c757d' : '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Adding User...' : '➕ Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUserAdd;