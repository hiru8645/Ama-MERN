import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const onlyLetters = value => /^[A-Za-z\s]*$/.test(value);
const onlyEmailChars = value => /^[A-Za-z0-9@.]*$/.test(value);
const onlyNumbers = value => /^[0-9]*$/.test(value);

const Register = ({ onSuccess, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    uni_id: '',
    password: '',
    role: 'student',
    contact_no: '',
    faculty: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'full_name' || name === 'faculty') {
      if (!onlyLetters(value)) return;
    }
    if (name === 'email') {
      if (!onlyEmailChars(value)) return;
    }
    if (name === 'contact_no') {
      if (!onlyNumbers(value) || value.length > 10) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const result = await register(form);
    
    if (result.success) {
      setSuccess(result.message);
      // Clear form after successful registration
      setForm({
        full_name: '',
        email: '',
        uni_id: '',
        password: '',
        role: 'student',
        contact_no: '',
        faculty: ''
      });
      // Automatically switch to login after 2 seconds
      setTimeout(() => {
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }, 2000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input 
              id="full_name" 
              name="full_name" 
              placeholder="Full Name" 
              value={form.full_name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="uni_id">University ID</label>
            <input 
              id="uni_id" 
              name="uni_id" 
              placeholder="University ID" 
              value={form.uni_id} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={form.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contact_no">Contact Number</label>
            <input
              id="contact_no"
              name="contact_no"
              placeholder="Contact Number"
              value={form.contact_no}
              onChange={handleChange}
              required
              maxLength={10}
              pattern="[0-9]{10}"
              title="Contact number must be exactly 10 digits"
            />
          </div>

          <div className="form-group">
            <label htmlFor="faculty">Faculty</label>
            <input 
              id="faculty" 
              name="faculty" 
              placeholder="Faculty" 
              value={form.faculty} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
        </form>
        <div className="auth-link">
          Already have an account? 
          <span onClick={onSwitchToLogin} className="link-text">
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
