import React, { useEffect, useState } from 'react';
import AdminUsersPDFGenerator from './AdminUsersPDFGenerator';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEye, FaUserPlus } from 'react-icons/fa';
import './AdminUsers.css';

const AdminUsers = ({ onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [facultyFilter, setFacultyFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('http://localhost:5001/api/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setErr(data.message || 'Failed to load users');
      }
    } catch {
      setErr('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setMsg('');
    setErr('');
    try {
      const res = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMsg('User deleted.');
        setUsers(users.filter(u => u._id !== id));
      } else {
        const data = await res.json();
        setErr(data.message || 'Delete failed');
      }
    } catch {
      setErr('Delete failed');
    }
  };

  // Get unique roles and faculties for filter dropdowns
  const uniqueRoles = ['all', ...Array.from(new Set(users.map(u => u.role).filter(Boolean)))];
  const uniqueFaculties = ['all', ...Array.from(new Set(users.map(u => u.faculty).filter(Boolean)))];

  // Filter and search logic
  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesFaculty = facultyFilter === 'all' || u.faculty === facultyFilter;
    const matchesSearch =
      !searchQuery ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.uni_id && u.uni_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.contact_no && u.contact_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.faculty && u.faculty.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesFaculty && matchesSearch;
  });

  return (
    <div className="admin-users-bg">
      <div className="admin-users-container" style={{ padding: '20px' }}>
        <div className="admin-users-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>👥 User Management</h2>
          <button 
            className="btn-primary" 
            style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}
            onClick={() => onNavigate && onNavigate('user-add')}
          >
            <FaUserPlus style={{ marginRight: '5px' }} />
            Add New User
          </button>
        </div>
        
        {msg && <div className="admin-users-success" style={{ padding: '10px', marginBottom: '15px', background: '#d4edda', color: '#155724', borderRadius: '5px' }}>{msg}</div>}
        {err && <div className="admin-users-error" style={{ padding: '10px', marginBottom: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>{err}</div>}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading users...</div>
        ) : (
          <>
            <div className="admin-users-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="admin-users-search" style={{ position: 'relative' }}>
                  <FaSearch className="admin-users-search-icon" style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="admin-users-search-input"
                    style={{ paddingLeft: '32px', height: '34px', borderRadius: '4px', border: '1px solid #dbe2e8', minWidth: '250px' }}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="admin-users-filter" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaFilter style={{ color: '#888' }} />
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="admin-users-filter-select"
                    style={{ height: '34px', borderRadius: '4px', border: '1px solid #dbe2e8' }}
                  >
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role === 'all' ? 'All Roles' : role}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-users-filter">
                  <select
                    value={facultyFilter}
                    onChange={e => setFacultyFilter(e.target.value)}
                    className="admin-users-filter-select"
                    style={{ height: '34px', borderRadius: '4px', border: '1px solid #dbe2e8' }}
                  >
                    {uniqueFaculties.map(faculty => (
                      <option key={faculty} value={faculty}>{faculty === 'all' ? 'All Faculties' : faculty}</option>
                    ))}
                  </select>
                </div>
              </div>
                <AdminUsersPDFGenerator users={filteredUsers} />
            </div>

            <div className="admin-users-stats" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div className="stat-card" style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Total Users</h4>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{users.length}</p>
              </div>
              <div className="stat-card" style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Filtered Results</h4>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{filteredUsers.length}</p>
              </div>
            </div>

            <div className="admin-users-table" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Uni ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Faculty</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Contact</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>{user.full_name}</td>
                      <td style={{ padding: '12px' }}>{user.email}</td>
                      <td style={{ padding: '12px' }}>{user.uni_id}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          fontWeight: 'bold',
                          background: user.role === 'admin' ? '#007bff' : user.role === 'staff' ? '#ffc107' : '#28a745',
                          color: user.role === 'admin' ? 'white' : user.role === 'staff' ? '#212529' : 'white'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{user.faculty}</td>
                      <td style={{ padding: '12px' }}>{user.contact_no}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                          <button
                            onClick={() => onNavigate && onNavigate('user-detail', user._id)}
                            style={{ padding: '5px 8px', border: 'none', borderRadius: '3px', background: '#007bff', color: 'white', cursor: 'pointer' }}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => onNavigate && onNavigate('user-edit', user._id)}
                            style={{ padding: '5px 8px', border: 'none', borderRadius: '3px', background: '#ffc107', color: '#212529', cursor: 'pointer' }}
                            title="Edit User"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            style={{ padding: '5px 8px', border: 'none', borderRadius: '3px', background: '#dc3545', color: 'white', cursor: 'pointer' }}
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  <p>No users found matching your criteria.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
