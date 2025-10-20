import React from "react";
import Header from "./Header";

const AboutUs = ({ setCurrentPage }) => {
  const stats = [
    { number: "5K+", label: "Books Exchanged" },
    { number: "2K+", label: "Active Students" },
    { number: "98%", label: "Successful Transactions" },
    { number: "50+", label: "University Partners" },
  ];

  const values = [
    { title: "Accessible Learning", description: "Providing students with affordable access to textbooks and learning materials." },
    { title: "Community Driven", description: "Empowering students to share books and resources within their university network." },
    { title: "Sustainable Practice", description: "Encouraging reuse of books to reduce waste and support eco-friendly habits." },
    { title: "Secure Transactions", description: "Ensuring safe, trusted exchanges between students through our platform." },
  ];

  const storyCards = [
    { title: "Our Story", content: "BookBridge started as a solution to the high cost of textbooks at universities. Our mission is to make learning more accessible by connecting students to exchange, sell, or donate books easily and safely." },
    { title: "Our Vision", content: "We aim to build a sustainable, student-driven platform where educational resources are shared efficiently, reducing costs and promoting collaborative learning across campuses." },
    { title: "Our Journey", content: "From launching at a single university to partnering with 50+ institutions, BookBridge has grown into a trusted hub for students to exchange books and connect with peers, making education affordable and sustainable." },
  ];

  const team = [
    { name: "Ranshari Senarathna", role: "Founder & CEO", bio: "Created BookBridge to simplify access to books for university students.", emoji: "👩‍💼" },
    { name: "Dulan Liyanage", role: "CTO", bio: "Leads platform development, ensuring a smooth and secure user experience.", emoji: "👨‍💻" },
    { name: "Nilani Udawaththa", role: "Community Manager", bio: "Connects students and manages partnerships with universities.", emoji: "👩‍🎓" },
    { name: "Pradeep Premarathna", role: "Operations Lead", bio: "Oversees book exchange operations and logistics.", emoji: "👨‍🏫" },
  ];

  return (
    <div>
      {/* Header */}
      {setCurrentPage && <Header setCurrentPage={setCurrentPage} />}
      
      {/* Internal CSS */}
      <style>{`
        /* General */
        body { margin: 0; font-family: Arial, sans-serif; }

        /* Hero */
        .about-hero { 
          text-align: center; 
          background: linear-gradient(135deg, #00bcd4, #0097a7); 
          padding: 80px 20px; 
          color: #fff; 
          margin-top: ${setCurrentPage ? '80px' : '0'};
        }

        /* Stats */
        .about-stats { 
          display: flex; 
          justify-content: space-around; 
          flex-wrap: wrap; 
          margin: 80px 0; 
          padding: 0 20px;
        }
        .about-stat { 
          background: #fff; 
          padding: 20px; 
          border-radius: 12px; 
          margin: 10px; 
          text-align: center; 
          min-width: 150px; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
        }
        .about-stat h2 { font-size: 2rem; color: #00bcd4; margin: 0; }
        .about-stat p { margin: 10px 0 0 0; font-weight: 500; }

        /* Sections */
        .about-section { padding: 60px 20px; }
        .about-grid3, .about-grid4 { display: grid; gap: 20px; max-width: 1200px; margin: 0 auto; }
        .about-grid3 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .about-grid4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        .about-card { 
          background: #cbf5e1; 
          padding: 20px; 
          border-radius: 10px; 
          text-align: center; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.08); 
        }
        .about-card h3 { margin: 0 0 15px 0; color: #2c3e50; }
        .about-card p { margin: 0; line-height: 1.6; }

        /* Section titles */
        .about-section-title {
          text-align: center;
          margin-bottom: 25px;
          font-size: 2.2rem;
          color: #2c3e50;
          font-weight: bold;
        }

        /* CTA */
        .about-cta { 
          background: #00bcd4; 
          color: #fff; 
          text-align: center; 
          padding: 60px 20px; 
        }
        .about-cta h2 { margin: 0 0 30px 0; font-size: 2.5rem; }
        .about-cta button { 
          padding: 12px 25px; 
          margin: 10px; 
          border-radius: 10px; 
          border: none; 
          font-weight: bold; 
          cursor: pointer; 
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }
        .about-cta .primary { 
          background: #fff; 
          color: #00bcd4; 
        }
        .about-cta .primary:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
        }
        .about-cta .outline { 
          background: transparent; 
          border: 2px solid #fff; 
          color: #fff; 
        }
        .about-cta .outline:hover {
          background: #fff;
          color: #00bcd4;
        }

        /* Footer */
        .about-footer { 
          background: linear-gradient(135deg, #2c3e50, #3498db); 
          color: #fff; 
          padding: 4rem 2rem 2rem; 
          margin-top: 3rem; 
        }
        .about-footer-container { max-width: 1200px; margin: auto; }
        .about-footer-top { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
          gap: 2rem; 
          margin-bottom: 3rem; 
        }
        .about-footer-logo .logo-content { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          margin-bottom: 1rem; 
        }
        .about-footer-logo .logo-text { font-size: 1.5rem; font-weight: bold; }
        .about-footer-logo .logo-icon { font-size: 2rem; }
        .about-footer-links ul { list-style: none; padding: 0; margin: 0; }
        .about-footer-links ul li { margin-bottom: 0.6rem; }
        .about-footer-links ul li a { 
          color: #ecf0f1; 
          text-decoration: none; 
          transition: color 0.3s;
        }
        .about-footer-links ul li a:hover { color: #ffd700; }
        .about-footer-social .social-icons { display: flex; gap: 1rem; }
        .about-footer-social img { 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          transition: transform 0.3s;
        }
        .about-footer-social img:hover { transform: scale(1.1); }
        .about-footer-bottom { 
          text-align: center; 
          border-top: 1px solid rgba(255,255,255,0.2); 
          padding-top: 1.5rem; 
          margin-top: 2rem; 
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .about-stats {
            flex-direction: column;
            align-items: center;
          }
          .about-section-title {
            font-size: 1.8rem;
          }
          .about-cta h2 {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* Hero */}
      <div className="about-hero">
        <h1>Welcome to BookBridge</h1>
        <p>Connecting students to exchange, donate, and sell textbooks easily and affordably.</p>
      </div>

      {/* Stats */}
      <div className="about-stats">
        {stats.map((s, i) => (
          <div className="about-stat" key={i}>
            <h2>{s.number}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Story Section */}
      <div className="about-section">
        <h2 className="about-section-title">Who We Are</h2>
        <div className="about-grid3">
          {storyCards.map((c, i) => (
            <div className="about-card" key={i}>
              <h3>{c.title}</h3>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="about-section">
        <h2 className="about-section-title">Our Core Values</h2>
        <div className="about-grid4">
          {values.map((v, i) => (
            <div className="about-card" key={i}>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="about-section">
        <h2 className="about-section-title">Meet Our Team</h2>
        <div className="about-grid4">
          {team.map((m, i) => (
            <div className="about-card" key={i}>
              <div style={{ fontSize: "40px" }}>{m.emoji}</div>
              <h3>{m.name}</h3>
              <p style={{ fontWeight: "bold", color: "#00bcd4" }}>{m.role}</p>
              <p>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>Start Your Book Exchange Today!</h2>
        <button 
          className="primary"
          onClick={() => setCurrentPage && setCurrentPage('categories')}
        >
          Browse Books
        </button>
        <button 
          className="outline"
          onClick={() => setCurrentPage && setCurrentPage('order')}
        >
          Place Order
        </button>
      </div>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-container">
          <div className="about-footer-top">
            <div className="about-footer-section about-footer-logo">
              <div className="logo-content">
                <span className="logo-icon">📚</span>
                <span className="logo-text">BookBridge</span>
              </div>
              <p>A student-driven book exchange platform that helps you save money, share knowledge, and build a stronger learning community.</p>
            </div>
            <div className="about-footer-section about-footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('home'); }}>Home</a></li>
                <li><a href="#categories" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('categories'); }}>Browse Books</a></li>
                <li><a href="#order" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('order'); }}>Place Order</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('contact'); }}>Contact</a></li>
              </ul>
            </div>
            <div className="about-footer-section about-footer-contact">
              <h4>Contact Us</h4>
              <p><strong>Email:</strong> support@bookbridge.com</p>
              <p><strong>Phone:</strong> +94 123 456 789</p>
              <p><strong>Address:</strong> Faculty of Computing, SLIIT, Malabe</p>
            </div>
            <div className="about-footer-section about-footer-social">
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
          <div className="about-footer-bottom">
            <p>&copy; 2025 BookBridge. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;