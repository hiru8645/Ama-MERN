import React from "react";
import "./UserDashboard.css";

function UserDashboard({ setActiveTab, setCurrentView, isAdmin }) {
  
  const goToUsers = () => {
    if (setActiveTab && setCurrentView) {
      setActiveTab('users');
      setCurrentView('users-table');
    }
  };

  const goToProfile = () => {
    if (setActiveTab && setCurrentView) {
      setActiveTab('profile');
      setCurrentView('profile');
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>{isAdmin ? '👑 Admin Dashboard - User Management' : '👤 User Dashboard'}</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {isAdmin 
              ? 'Manage all user accounts, view user details, and maintain the user system from this central dashboard.'
              : 'Welcome to your personal dashboard. Manage your profile and view your account information.'
            }
          </p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-actions" style={{ marginBottom: '2rem' }}>
            {isAdmin ? (
              <button 
                className="dashboard-main-btn"
                onClick={goToUsers}
                style={{
                  background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
              >
                👥 Go to Users Management
              </button>
            ) : (
              <button 
                className="dashboard-main-btn"
                onClick={goToProfile}
                style={{
                  background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
              >
                👤 View My Profile
              </button>
            )}
          </div>

          <div className="dashboard-info" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {isAdmin ? (
              <>
                <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>👥</div>
                    <div>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>User Management</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>View, edit, and manage all user accounts and their details.</p>
                    </div>
                  </div>
                </div>

                <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🔍</div>
                    <div>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>Search & Filter</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Find users quickly using search and filter options.</p>
                    </div>
                  </div>
                </div>

                <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>✏️</div>
                    <div>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>Edit Profiles</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Edit any user's profile information and details.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>👤</div>
                    <div>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>My Profile</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>View and edit your personal information and account details.</p>
                    </div>
                  </div>
                </div>

                <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🔒</div>
                    <div>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>Privacy</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Your data is secure and only you can view your profile.</p>
                    </div>
                  </div>
                </div>

                <div className="info-card" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>✏️</div>
                    <div>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>Edit Information</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Update your contact details and personal information.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;