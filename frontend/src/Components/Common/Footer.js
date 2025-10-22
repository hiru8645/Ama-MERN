import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          {/* Logo Section */}
          <div className="footer-section footer-logo">
            <div className="logo-content">
              <span className="logo-icon">📚</span>
              <span className="logo-text">BookSwap</span>
            </div>
            <p>
              A student-driven book exchange platform that helps you save
              money, share knowledge, and build a stronger learning community.
            </p>
          </div>

          {/* Links Section */}
          <div className="footer-section footer-links-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section footer-contact">
            <h4>Contact Us</h4>
            <p><strong>Email:</strong> support@bookswap.com</p>
            <p><strong>Phone:</strong> +94 123 456 789</p>
            <p><strong>Address:</strong> Faculty of Computing, SLIIT, Malabe</p>
          </div>

          {/* Social Section */}
          <div className="footer-section footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com"><img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" /></a>
              <a href="https://twitter.com"><img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" /></a>
              <a href="https://instagram.com"><img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" /></a>
              <a href="https://linkedin.com"><img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" /></a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>
            &copy; 2025 BookSwap. All rights reserved. | Privacy Policy | Terms
            of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
