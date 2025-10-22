import React, { useState } from "react";
import Header from "./Header";

const ContactUs = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    attachment: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      attachment: null,
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      {/* Header */}
      {setCurrentPage && <Header setCurrentPage={setCurrentPage} />}

      <style>{`
        /* General Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
        }

        /* Contact Form */
        .contact-container {
          display: flex;
          justify-content: center;
          width: 100vw;
          min-height: 100vh;
          padding: ${setCurrentPage ? '120px' : '60px'} 20px 60px; /* space with navbar */
          background: linear-gradient(135deg, #a9e4ecff, #0097a7);
        }

        .contact-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .contact-card h2 {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 20px;
        }

        .success-message {
          text-align: center;
          color: #16a34a;
          margin-bottom: 15px;
          font-weight: bold;
          padding: 10px;
          background: #f0f9ff;
          border-radius: 8px;
          border: 1px solid #16a34a;
        }

        .contact-card label {
          display: block;
          font-weight: 600;
          margin-bottom: 5px;
          color: #374151;
        }

        .contact-card input,
        .contact-card textarea,
        .contact-card select {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          outline: none;
          font-size: 14px;
          transition: 0.2s;
          font-family: Arial, sans-serif;
        }

        .contact-card input:focus,
        .contact-card textarea:focus,
        .contact-card select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
        }

        .contact-card textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-card button {
          width: 100%;
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .contact-card button:hover {
          background-color: #1e40af;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .contact-card button:active {
          transform: translateY(0);
        }

        /* Contact Info Section */
        .contact-info {
          background: rgba(255, 255, 255, 0.9);
          padding: 30px;
          border-radius: 15px;
          margin-top: 30px;
          text-align: center;
        }

        .contact-info h3 {
          color: #1e40af;
          margin-bottom: 20px;
          font-size: 22px;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .contact-info-item {
          text-align: center;
          padding: 15px;
        }

        .contact-info-item .icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .contact-info-item h4 {
          color: #374151;
          margin-bottom: 8px;
        }

        .contact-info-item p {
          color: #6b7280;
          margin: 0;
        }

        @media (max-width: 600px) {
          .contact-card {
            padding: 30px 20px;
            margin: 0 10px;
          }
          .contact-card h2 {
            font-size: 24px;
          }
          .contact-container {
            padding: ${setCurrentPage ? '100px' : '40px'} 10px 40px;
          }
        }

        /* Footer */
        .contact-footer {
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          color: #ffffff;
          padding: 4rem 2rem 2rem;
          margin-top: 3rem;
        }

        .contact-footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-footer-top {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .contact-footer-section {
          display: flex;
          flex-direction: column;
        }

        .contact-footer-section h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.2rem;
          color: #faf9f5;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contact-footer-logo .logo-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .contact-footer-logo .logo-text {
          font-weight: bold;
          font-size: 1.5rem;
          color: #f5f4ef;
        }

        .contact-footer-logo .logo-icon {
          font-size: 2rem;
        }

        .contact-footer-logo p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #ecf0f1;
        }

        .contact-footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .contact-footer-links ul li {
          margin-bottom: 0.6rem;
        }

        .contact-footer-links ul li a {
          color: #ecf0f1;
          transition: all 0.3s ease;
          text-decoration: none;
          cursor: pointer;
        }

        .contact-footer-links ul li a:hover {
          color: #ffd700;
          padding-left: 5px;
        }

        .contact-footer-contact p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
          color: #ecf0f1;
        }

        .contact-footer-social .social-icons {
          display: flex;
          gap: 1rem;
        }

        .contact-footer-social .social-icons a img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .contact-footer-social .social-icons a:hover img {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }

        .contact-footer-bottom {
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 1.5rem;
        }

        .contact-footer-bottom p {
          font-size: 1rem;
          color: #bdc3c7;
        }
      `}</style>

      {/* Contact Form */}
      <div className="contact-container">
        <div>
          <div className="contact-card">
            <h2>Contact Us</h2>

            {submitted && (
              <p className="success-message">
                ✅ Thank you! Your message has been sent successfully.
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />

              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                required
              />

              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Subject --</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Book Exchange Help">Book Exchange Help</option>
                <option value="Account Issues">Account Issues</option>
                <option value="Feedback">Feedback & Suggestions</option>
                <option value="Partnership">Partnership Opportunities</option>
                <option value="Other">Other</option>
              </select>

              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your inquiry in detail..."
                required
              />

              <label htmlFor="attachment">Attachment (Optional)</label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />

              <button type="submit">Send Message</button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>We're here to help! Reach out to us through any of the following ways:</p>
            
            <div className="contact-info-grid">
              <div className="contact-info-item">
                <div className="icon">📧</div>
                <h4>Email</h4>
                <p>support@bookbridge.com</p>
              </div>
              <div className="contact-info-item">
                <div className="icon">📞</div>
                <h4>Phone</h4>
                <p>+94 123 456 789</p>
              </div>
              <div className="contact-info-item">
                <div className="icon">📍</div>
                <h4>Address</h4>
                <p>Faculty of Computing<br/>SLIIT, Malabe</p>
              </div>
              <div className="contact-info-item">
                <div className="icon">🕒</div>
                <h4>Hours</h4>
                <p>Mon-Fri: 9:00 AM - 6:00 PM<br/>Sat: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="contact-footer-container">
          <div className="contact-footer-top">
            <div className="contact-footer-section contact-footer-logo">
              <div className="logo-content">
                <span className="logo-icon">📚</span>
                <span className="logo-text">BookBridge</span>
              </div>
              <p>
                A student-driven book exchange platform that helps you save
                money, share knowledge, and build a stronger learning community.
              </p>
            </div>

            <div className="contact-footer-section contact-footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('home'); }}>Home</a></li>
                <li><a href="#categories" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('categories'); }}>Browse Books</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('about'); }}>About Us</a></li>
                <li><a href="#order" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('order'); }}>Place Order</a></li>
              </ul>
            </div>

            <div className="contact-footer-section contact-footer-contact">
              <h4>Contact Info</h4>
              <p><strong>Email:</strong> support@bookbridge.com</p>
              <p><strong>Phone:</strong> +94 123 456 789</p>
              <p><strong>Address:</strong> Faculty of Computing, SLIIT, Malabe</p>
            </div>

            <div className="contact-footer-section contact-footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-footer-bottom">
            <p>
              &copy; 2025 BookBridge. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactUs;