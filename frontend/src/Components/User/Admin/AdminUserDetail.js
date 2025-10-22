import React, { useEffect, useState } from 'react';
import './AdminUsers.css';

const AdminUserDetail = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setErr('No user ID provided');
        setLoading(false);
        return;
      }
      
      setErr('');
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001/api/users/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setErr(data.message || 'User not found');
        }
      } catch {
        setErr('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="admin-users-bg">
        <div className="admin-users-container" style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Loading user details...</h2>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="admin-users-bg">
        <div className="admin-users-container" style={{ padding: '20px' }}>
          <div className="admin-users-error" style={{ padding: '10px', marginBottom: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
            {err}
          </div>
          <button 
            onClick={onBack}
            style={{ padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="admin-users-bg">
      <div className="admin-users-container" style={{ padding: '20px' }}>
        <div className="admin-users-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>👤 User Details</h2>
          <button 
            onClick={onBack}
            style={{ padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            ← Back to Users
          </button>
        </div>
        
        <div className="user-detail-card" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div className="user-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="detail-section">
              <h3 style={{ color: '#495057', marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>Personal Information</h3>
              <div className="detail-item" style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#6c757d', display: 'block', marginBottom: '4px' }}>Full Name:</strong>
                <span style={{ fontSize: '16px', color: '#212529' }}>{user.full_name}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#6c757d', display: 'block', marginBottom: '4px' }}>Email:</strong>
                <span style={{ fontSize: '16px', color: '#212529' }}>{user.email}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#6c757d', display: 'block', marginBottom: '4px' }}>Contact Number:</strong>
                <span style={{ fontSize: '16px', color: '#212529' }}>{user.contact_no}</span>
              </div>
            </div>
            
            <div className="detail-section">
              <h3 style={{ color: '#495057', marginBottom: '15px', borderBottom: '2px solid #28a745', paddingBottom: '8px' }}>Academic Information</h3>
              <div className="detail-item" style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#6c757d', display: 'block', marginBottom: '4px' }}>University ID:</strong>
                <span style={{ fontSize: '16px', color: '#212529' }}>{user.uni_id}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#6c757d', display: 'block', marginBottom: '4px' }}>Role:</strong>
                <span style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  background: user.role === 'admin' ? '#007bff' : user.role === 'staff' ? '#ffc107' : '#28a745',
                  color: user.role === 'admin' ? 'white' : user.role === 'staff' ? '#212529' : 'white'
                }}>
                  {user.role}
                </span>
              </div>
              <div className="detail-item" style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#6c757d', display: 'block', marginBottom: '4px' }}>Faculty:</strong>
                <span style={{ fontSize: '16px', color: '#212529' }}>{user.faculty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
