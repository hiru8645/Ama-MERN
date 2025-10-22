import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = ({ setActiveTab, setCurrentView, currentUser }) => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(currentUser || authUser);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    uni_id: '',
    role: '',
    contact_no: '',
    faculty: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        uni_id: user.uni_id || '',
        role: user.role || 'user',
        contact_no: user.contact_no || '',
        faculty: user.faculty || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErr('');

    try {
      const res = await fetch(`http://localhost:5001/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        if (updateUser) {
          updateUser(data.user);
        }
        setMsg('Profile updated successfully!');
        setEditMode(false);
      } else {
        setErr(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErr('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');

    if (passwords.new !== passwords.confirm) {
      setPwErr('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      setPwErr('New password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/users/${user._id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setPwMsg('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
        setShowPasswordForm(false);
      } else {
        setPwErr(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPwErr('Failed to change password');
    }
  };

  if (!user) {
    return (
      <div className="user-profile">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-container">
        <div className="profile-header">
          <h2>👤 My Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>

        {msg && <div className="success-message">{msg}</div>}
        {err && <div className="error-message">{err}</div>}

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Personal Information</h3>
              <div className="profile-actions">
                {!editMode ? (
                  <button 
                    className="edit-btn"
                    onClick={() => setEditMode(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      className="save-btn"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? '💾 Saving...' : '💾 Save'}
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setEditMode(false);
                        setForm({
                          full_name: user.full_name || '',
                          email: user.email || '',
                          uni_id: user.uni_id || '',
                          role: user.role || 'user',
                          contact_no: user.contact_no || '',
                          faculty: user.faculty || ''
                        });
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="form-value">{user.full_name || 'Not specified'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="form-value">{user.email || 'Not specified'}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>University ID</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="uni_id"
                      value={form.uni_id}
                      onChange={handleInputChange}
                      placeholder="Enter your university ID"
                    />
                  ) : (
                    <div className="form-value">{user.uni_id || 'Not specified'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="contact_no"
                      value={form.contact_no}
                      onChange={handleInputChange}
                      placeholder="Enter your contact number"
                    />
                  ) : (
                    <div className="form-value">{user.contact_no || 'Not specified'}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Faculty</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="faculty"
                      value={form.faculty}
                      onChange={handleInputChange}
                      placeholder="Enter your faculty"
                    />
                  ) : (
                    <div className="form-value">{user.faculty || 'Not specified'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <div className="form-value role-badge">{user.role || 'user'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Security Settings</h3>
              <button 
                className="password-toggle-btn"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                🔒 {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordForm && (
              <div className="password-form">
                {pwMsg && <div className="success-message">{pwMsg}</div>}
                {pwErr && <div className="error-message">{pwErr}</div>}
                
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="new"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button type="submit" className="save-btn">
                    🔒 Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;