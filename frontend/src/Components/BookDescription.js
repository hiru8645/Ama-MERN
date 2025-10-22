import React, { useState } from 'react';
import './BookDescription.css';
import { formatPrice } from '../utils/priceUtils';

const BookDescription = ({ book, goBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getBookDescription = (book) => {
    const descriptions = {
      'Introduction to Algorithms': 'A comprehensive guide to understanding algorithms and their implementation. This book covers fundamental concepts, advanced techniques, and practical applications in computer science. Written by K.K. Goyal, it provides clear explanations and numerous examples to help students master algorithmic thinking. Perfect for computer science students and professionals looking to strengthen their problem-solving skills.',
      
      'Introduction to Computer Science': 'An essential primer for beginners in computer science. This book by Pery Donham explores core computing concepts, programming fundamentals, and the basics of computer architecture. Perfect for students starting their journey in computer science. Covers topics from basic programming concepts to advanced system design.',
      
      'The Art of Solving Problems': 'A masterful exploration of problem-solving techniques in computer science. This book teaches systematic approaches to tackle complex programming challenges, debug code effectively, and optimize solutions. Essential reading for anyone looking to improve their analytical and programming skills.',
      
      'Data Science for Beginners': 'An accessible introduction to the world of data science. Covers statistical analysis, machine learning basics, data visualization, and practical applications using popular tools and libraries. This book bridges the gap between theory and practice, making data science accessible to everyone.',
      
      'Everything An Exclusive': 'A comprehensive guide to cybersecurity fundamentals. This book covers network security, encryption, threat detection, and best practices for protecting digital assets. Essential for anyone working in cybersecurity or looking to understand modern security challenges.',
      
      'Hacking': 'An in-depth exploration of ethical hacking and penetration testing by Jon Erickson. Learn about security vulnerabilities, exploitation techniques, and how to protect systems from cyber threats. This book provides hands-on experience with real-world security scenarios.',
      
      'Application Software': 'A detailed guide to understanding and developing application software. Covers software development lifecycles, design patterns, and best practices in modern software engineering. Ideal for developers looking to build robust and scalable applications.',
      
      'Cyber Security Fundamentals': 'A thorough introduction to cybersecurity principles. This book by Rahesh Kumar covers essential security concepts, threat models, security protocols, and practical defense strategies. Perfect for beginners and professionals alike.',
      
      'Statistic For Data Scientists': 'An in-depth guide to statistical methods used in data science. Covers probability, hypothesis testing, regression analysis, and advanced statistical concepts with practical applications. Essential for data scientists and analysts.',
      
      'C Language': 'The definitive guide to C programming by Dennis M. Ritchie, the creator of the C language. This book covers fundamental programming concepts, memory management, and system programming. A must-read for anyone serious about programming.',
      
      'Applied Data Science': 'A practical approach to data science applications. This book by Jake VanderPlas covers real-world data analysis, machine learning implementation, and data visualization techniques using Python and popular libraries.',
      
      'Java Programming': 'A comprehensive guide to Java programming by Joyce Farrell. Covers object-oriented programming concepts, Java syntax, data structures, and application development using Java. Perfect for beginners and intermediate programmers.',
    };

    return descriptions[book.title] || "Detailed description coming soon. This book provides valuable insights into " + book.category + " concepts and practical applications.";
  };

  const getBookFeatures = (book) => {
    const features = {
      'Introduction to Algorithms': ['Comprehensive algorithm coverage', 'Real-world examples', 'Mathematical proofs', 'Implementation guides'],
      'Introduction to Computer Science': ['Beginner-friendly approach', 'Hands-on exercises', 'Programming fundamentals', 'System architecture'],
      'The Art of Solving Problems': ['Problem-solving strategies', 'Debug techniques', 'Code optimization', 'Critical thinking'],
      'Data Science for Beginners': ['Statistical analysis', 'Machine learning basics', 'Data visualization', 'Practical projects'],
      'Everything An Exclusive': ['Network security', 'Encryption techniques', 'Threat detection', 'Security protocols'],
      'Hacking': ['Ethical hacking', 'Penetration testing', 'Security vulnerabilities', 'Hands-on labs'],
      'Application Software': ['Software development', 'Design patterns', 'Best practices', 'Project management'],
      'Cyber Security Fundamentals': ['Security principles', 'Threat modeling', 'Defense strategies', 'Compliance'],
      'Statistic For Data Scientists': ['Statistical methods', 'Hypothesis testing', 'Regression analysis', 'Data interpretation'],
      'C Language': ['System programming', 'Memory management', 'Pointers', 'Data structures'],
      'Applied Data Science': ['Real-world projects', 'Python programming', 'Data analysis', 'Visualization'],
      'Java Programming': ['Object-oriented programming', 'Java syntax', 'GUI development', 'Web applications'],
    };

    return features[book.title] || ['Comprehensive content', 'Practical examples', 'Expert insights', 'Hands-on learning'];
  };

  const renderStars = (rating) => {
    if (!rating || isNaN(rating)) return <div className="rating-stars">☆☆☆☆☆</div>;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="rating-stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </div>
    );
  };

  return (
    <div className="description-container">
      <div className="description-header">
        <button className="back-btn" onClick={goBack}>
          <span>←</span> Back to Categories
        </button>
      </div>

      <div className="description-content">
        <div className="book-image-section">
          <img src={book.image} alt={book.title} className="description-image"/>
          <div className="book-stats">
            <div className="rating-section">
              {renderStars(book.rating)}
              <span className="rating-text">{book.rating} ({book.reviews} reviews)</span>
            </div>
            <div className="price-section">
              <span className="price-label">Price:</span>
              <span className="price-value">{formatPrice(book.price)}</span>
            </div>
            <div className="condition-section">
              <span className="condition-label">Condition:</span>
              <span className="condition-value">{book.condition}</span>
            </div>
          </div>
        </div>

        <div className="book-details-section">
          <div className="book-header">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">by {book.author}</p>
            <span className="book-category">{book.category}</span>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Key Features
              </button>
              <button 
                className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Book Details
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-content">
                  <h3>Book Description</h3>
                  <p className="description-text">{getBookDescription(book)}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="features-content">
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {getBookFeatures(book).map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="details-content">
                  <h3>Book Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Author:</span>
                      <span className="detail-value">{book.author}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{book.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Condition:</span>
                      <span className="detail-value">{book.condition}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">{formatPrice(book.price)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rating:</span>
                      <span className="detail-value">{book.rating} / 5.0</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reviews:</span>
                      <span className="detail-value">{book.reviews} reviews</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button className="primary-action-btn">
              Add to Cart
            </button>
            <button className="secondary-action-btn">
              Add to Wishlist
            </button>
            <button className="secondary-action-btn">
              Share Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDescription;
