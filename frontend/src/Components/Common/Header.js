import React from 'react';
import './Header.css';

const Header = ({ title = "User Management" }) => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">{title}</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
