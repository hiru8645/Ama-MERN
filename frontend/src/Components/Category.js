import React, { useState, useEffect } from 'react';
import './Category.css';
import Header from './Header';

// Helper to get valid products (should match InventoryReport.js logic)
const getValidProducts = (products) =>
  products.filter(product =>
    product.name &&
    product.category &&
    product.supplier &&
    product.name.trim() !== '' &&
    product.category.trim() !== '' &&
    product.supplier.trim() !== '' &&
    typeof product.stockTotal === 'number' &&
    typeof product.stockCurrent === 'number' &&
    product.stockTotal >= 0 &&
    product.stockCurrent >= 0 &&
    product.code &&
    product.code.trim() !== ''
  );

const API_URL = "http://localhost:5001/api/products";

const Category = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [expandedIntros, setExpandedIntros] = useState(new Set());
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const validProducts = getValidProducts(products); 
  const validCategories = ['All', ...Array.from(new Set(validProducts.map(book => book.category).filter(Boolean)))];

  const filteredBooks = validProducts.filter(book => {
    try {
      // Use 'name' for book name (Product.js uses 'name')
      const matchesSearch = (book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesPrice && matchesCategory;
    } catch (error) {
      console.error('Error filtering books:', error);
      return false;
    }
  });

  const toggleIntroduction = (bookId) => {
    const newExpanded = new Set(expandedIntros);
    if (newExpanded.has(bookId)) {
      newExpanded.delete(bookId);
    } else {
      newExpanded.add(bookId);
    }
    setExpandedIntros(newExpanded);
  };

  return (
    <>
      {setCurrentPage && <Header setCurrentPage={setCurrentPage} />}
      <div className="category-container" style={{ marginTop: setCurrentPage ? '80px' : '0' }}>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Book Inventory</span>
          </h1>
          <p className="hero-description">
            Discover, explore, and manage your digital book collection with our modern inventory system
          </p>
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">{filteredBooks.length}</span>
              <span className="stat-label">Books Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{validCategories.length - 1}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="search-container">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                type="text" 
                placeholder="Search by title or author..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-input" 
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="category-select"
            >
              {validCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="filter-group price-filter">
            <label className="filter-label">
              Price Range: <span className="price-values">Rs {priceRange[0].toLocaleString()} - Rs {priceRange[1].toLocaleString()}</span>
            </label>
            <div className="range-container">
              <input 
                type="range" 
                min="0" 
                max="3000" 
                value={priceRange[0]} 
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} 
                className="range-slider"
              />
              <input 
                type="range" 
                min="0" 
                max="3000" 
                value={priceRange[1]} 
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
                className="range-slider"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content Section */}
      <div className="featured-section">
        <div className="featured-content">
          <div className="video-container">
            <video 
              autoPlay 
              muted 
              loop 
              className="featured-video"
              onError={(e) => {
                console.error('Video failed to load:', e);
                e.target.style.display = 'none';
              }}
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
              <source src="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2MiByMzA4MSBhM2Y0NDA3IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTYgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w6BcLhUHdwizrkTLwS6ywLOa0d4vc5YD+V5Hs8+9H6S7I2sNj7Y9xmvNzY7H4n5Kz5BgAACqJmqBwQ=" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="featured-text">
            <h2 className="featured-title">The Power of Books</h2>
            <p className="featured-description">
              Books are gateways to infinite worlds, offering knowledge, wisdom, and inspiration. 
              They shape our thoughts, expand our horizons, and connect us across time and cultures. 
              In our digital age, the timeless value of books remains unchanged—they continue to be 
              essential tools for learning, growth, and human connection.
            </p>
            <div className="featured-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🧠</span>
                <span>Expand Knowledge</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🌟</span>
                <span>Inspire Creativity</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🤝</span>
                <span>Build Empathy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-section">
        <div className="section-header">
          <h2 className="section-title">Available Books</h2>
          <p className="section-subtitle">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="book-grid">
          {filteredBooks.map((book, index) => (
            <div 
              key={book.id || book._id || index} 
              className="book-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image section removed as requested */}
              <div className="book-content">
                <div className="book-header">
                  <h3 className="book-title" style={{ color: '#1a202c', fontWeight: 'bold', textShadow: '0 1px 2px #fff, 0 0 2px #0002' }}>{book.name}</h3>
                  {/* Rating removed for Categories page */}
                </div>

                <p className="book-author">{book.author ? `by ${book.author}` : ''}</p>
                <div className="book-meta">
                  <span className="book-category">{book.category}</span>
                  <span className="book-price">
                    Rs {book.price ? book.price.toLocaleString() : 'N/A'}
                  </span>
                </div>

                {book.description ? (
                  <p className="book-description">{book.description}</p>
                ) : (
                  <div className="no-description-section">
                    <button 
                      className="intro-toggle-btn"
                      onClick={() => toggleIntroduction(book.id || book._id)}
                    >
                    </button>
                    
                    {expandedIntros.has(book.id || book._id) && book.introduction && (
                      <div className="book-introduction">
                        <h4 className="intro-title">Book Introduction</h4>
                        <p className="intro-text">{book.introduction}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="book-actions">
                  {/* Placeholder for future use, e.g., View Details button */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default Category;
