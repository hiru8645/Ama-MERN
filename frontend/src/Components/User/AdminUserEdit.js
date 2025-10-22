import React, { useEffect, useState } from 'react';
import './AdminUserEdit.css';

const AdminUserEdit = ({ userId, setActiveTab, setCurrentView, onBack }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    uni_id: '',
    role: '',
    contact_no: '',
    faculty: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  // Fetch user data when component loads
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      setLoading(true);
      setErr('');
      
      try {
        const res = await fetch(`http://localhost:5001/api/users/${userId}`);
        const data = await res.json();
        
        if (res.ok) {
          setCurrentUser(data.user);
          setForm({
            full_name: data.user.full_name || '',
            email: data.user.email || '',
            uni_id: data.user.uni_id || '',
            role: data.user.role || 'user',
            contact_no: data.user.contact_no || '',
            faculty: data.user.faculty || ''
          });
        } else {
          setErr(data.message || 'Failed to load user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setErr('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErr('');

    try {
      const res = await fetch(`http://localhost:5001/api/users/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      
      if (res.ok) {
        setCurrentUser(data.user);
        setMsg('User updated successfully!');
        
        // Auto-navigate back to user details after successful save
        setTimeout(() => {
          if (onBack) {
            onBack();
          } else {
            setCurrentView('user-detail');
          }
        }, 1500);
      } else {
        setErr(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErr('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');

    if (newPassword !== confirmPassword) {
      setPwErr('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPwErr('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/users/${currentUser._id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: newPassword
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setPwMsg('Password reset successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordReset(false);
      } else {
        setPwErr(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setPwErr('Failed to reset password');
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setErr('');

    try {
      const res = await fetch(`http://localhost:5001/api/users/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.ok) {
        setMsg('User deleted successfully!');
        
        // Navigate back to users list after deletion
        setTimeout(() => {
          if (onBack) {
            onBack();
          } else {
            setCurrentView('users-table');
          }
          setCurrentUser(null);
        }, 1500);
      } else {
        const data = await res.json();
        setErr(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setErr('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="admin-user-edit">
        <div className="edit-container">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!currentUser && !loading) {
    return (
      <div className="admin-user-edit">
        <div className="edit-container">
          <p>No user selected for editing or user not found.</p>
          <button 
            className="back-btn"
            onClick={() => onBack ? onBack() : setCurrentView('users-table')}
          >
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-user-edit">
      <div className="edit-container">
        <div className="edit-header">
          <div className="header-content">
            <h2>✏️ Edit User</h2>
            <p>Modify user information and manage account settings</p>
          </div>
          <button 
            className="back-btn"
            onClick={() => onBack ? onBack() : setCurrentView('users-table')}
          >
            ← Back to Users
          </button>
        </div>

        {msg && <div className="success-message">{msg}</div>}
        {err && <div className="error-message">{err}</div>}

        <div className="edit-content">
          {/* User Information Form */}
          <div className="edit-card">
            <div className="card-header">
              <h3>User Information</h3>
            </div>
            
            <form onSubmit={handleSaveUser} className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>University ID</label>
                  <input
                    type="text"
                    name="uni_id"
                    value={form.uni_id}
                    onChange={handleInputChange}
                    placeholder="Enter university ID"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    name="contact_no"
                    value={form.contact_no}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Faculty</label>
                  <input
                    type="text"
                    name="faculty"
                    value={form.faculty}
                    onChange={handleInputChange}
                    placeholder="Enter faculty"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? '💾 Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Reset Section */}
          <div className="edit-card">
            <div className="card-header">
              <h3>Security Management</h3>
              <button 
                className="password-reset-btn"
                onClick={() => setShowPasswordReset(!showPasswordReset)}
              >
                🔒 {showPasswordReset ? 'Cancel Reset' : 'Reset Password'}
              </button>
            </div>

            {showPasswordReset && (
              <div className="password-reset-form">
                {pwMsg && <div className="success-message">{pwMsg}</div>}
                {pwErr && <div className="error-message">{pwErr}</div>}
                
                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button type="submit" className="reset-btn">
                    🔒 Reset Password
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="edit-card danger-zone">
            <div className="card-header">
              <h3>⚠️ Danger Zone</h3>
            </div>
            
            <div className="danger-content">
              <p>Permanently delete this user account. This action cannot be undone.</p>
              <button 
                className="delete-btn"
                onClick={handleDeleteUser}
                disabled={loading}
              >
                🗑️ Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEdit;