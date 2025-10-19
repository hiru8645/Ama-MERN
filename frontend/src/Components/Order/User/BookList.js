import React, { useEffect, useState } from "react";
import "./BookList.css";

function BookList({ setActiveTab, setCurrentView }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Try to fetch from products (inventory) API first
        let res = await fetch("http://localhost:5001/api/products");
        let data = await res.json();
        
        if (res.ok && Array.isArray(data) && data.length > 0) {
          // Map products to book format
          const mappedBooks = data.map(product => ({
            _id: product._id,
            itemName: product.name,
            price: parseFloat(product.price) || 0,
            quantity: product.stockCurrent || 0,
            bookId: product._id,
            description: product.description || `${product.category} - ${product.code}`,
            category: product.category,
            code: product.code,
            status: product.status
          }));
          setBooks(mappedBooks);
        } else {
          // Fallback to orders/books API
          res = await fetch("http://localhost:5001/api/orders/books");
          data = await res.json();
          if (!res.ok || !data.success) throw new Error(data.message || "Failed");
          setBooks(data.data || []);
        }
      } catch (e) {
        console.error("Error fetching books:", e);
        setError("Could not load books. Please check if inventory has products.");
      } finally { 
        setLoading(false); 
      }
    };
    fetchBooks();
  }, []);

  const placeOrder = (book) => {
    // Navigate to add order view with book data
    if (setActiveTab && setCurrentView) {
      // Store book data in sessionStorage for the AddOrder component
      sessionStorage.setItem('selectedBook', JSON.stringify(book));
      setCurrentView('add-order');
    }
  };

  return (
    <div className="books-page">
      <div className="books-container">
        <h2>📚 Books Available for Order</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Browse through our collection of books and place orders. All books are sourced from our inventory.
        </p>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading books...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="error-text">{error}</p>
          </div>
        ) : books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No books available at the moment. Please check back later or contact an administrator.</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card modern-card">
                <div className="book-info">
                  <div className="book-title">{book.itemName}</div>
                  {book.category && (
                    <div className="book-category">📂 {book.category}</div>
                  )}
                  <div className="book-details">
                    <div className="price-info">💰 Rs. {book.price}</div>
                    <div className="stock-info">
                      📦 Available: <span className={book.quantity > 0 ? 'in-stock' : 'out-of-stock'}>
                        {book.quantity}
                      </span>
                    </div>
                  </div>
                  {book.description && (
                    <div className="book-description">{book.description}</div>
                  )}
                </div>
                <button 
                  className="place-order-btn"
                  onClick={() => placeOrder(book)}
                  disabled={book.quantity <= 0}
                  style={{ 
                    background: book.quantity > 0 
                      ? 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' 
                      : '#ccc',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: book.quantity > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '500',
                    width: '100%',
                    marginTop: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (book.quantity > 0) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                >
                  {book.quantity > 0 ? '🛒 Place an Order' : '❌ Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;


