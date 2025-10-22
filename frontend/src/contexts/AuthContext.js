import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('Admin');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    } else if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setUser(adminData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('Admin');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Check for hardcoded admin credentials first
      
      // Original Admin (general admin)
      if (
        credentials.email.trim().toLowerCase() === 'admin@gmail.com' &&
        credentials.password === 'Admin'
      ) {
        const adminUser = {
          email: 'admin@gmail.com',
          role: 'admin',
          full_name: 'Admin',
          adminType: 'general'
        };
        localStorage.setItem('Admin', JSON.stringify(adminUser));
        setUser(adminUser);
        setIsLoggedIn(true);
        return { success: true, user: adminUser };
      }

      // Inventory Manager Admin (specific admin for inventory)
      if (
        credentials.email.trim().toLowerCase() === 'ransharipremarathna@gmail.com' &&
        credentials.password === '122025ht'
      ) {
        const inventoryAdmin = {
          email: 'ransharipremarathna@gmail.com',
          role: 'admin',
          full_name: 'Ranshari Premarathna',
          adminType: 'inventory_manager',
          _id: 'admin_inventory_001'
        };
        localStorage.setItem('Admin', JSON.stringify(inventoryAdmin));
        setUser(inventoryAdmin);
        setIsLoggedIn(true);
        return { success: true, user: inventoryAdmin };
      }

      // Otherwise, proceed with normal login
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('Admin');
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
