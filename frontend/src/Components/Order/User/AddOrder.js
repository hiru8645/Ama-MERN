import React, { useState, useEffect } from "react";
import "./AddOrder.css";

function AddOrder({ setActiveTab, setCurrentView }) {
  const [book, setBook] = useState(null);
  const [customerName, setCustomerName] = useState(localStorage.getItem("username") || "");
  const [customerContact, setCustomerContact] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load book data from sessionStorage on component mount
  useEffect(() => {
    const selectedBook = sessionStorage.getItem('selectedBook');
    const editingOrder = sessionStorage.getItem('editingOrder');
    
    if (selectedBook) {
      try {
        const bookData = JSON.parse(selectedBook);
        setBook(bookData);
      } catch (e) {
        setError("Invalid book data");
      }
    } else {
      setError("No book selected");
    }

    // If editing, populate form with existing data
    if (editingOrder) {
      try {
        const orderData = JSON.parse(editingOrder);
        setCustomerName(orderData.customerName || localStorage.getItem("username") || "");
        setCustomerContact(orderData.customerContact || "");
        setQuantity(orderData.quantity || 1);
      } catch (e) {
        console.error("Error loading editing data:", e);
      }
    }
  }, []);

  const isTenDigitNumber = (value) => /^\d{10}$/.test(String(value).trim());

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!book) { setError("No book selected"); return; }
    if (!customerName || customerName.trim().length < 2) { 
      setError("Customer name must be at least 2 characters"); 
      return; 
    }
    if (!customerContact || customerContact.trim().length === 0) { 
      setError("Contact number is required"); 
      return; 
    }
    if (!isTenDigitNumber(customerContact)) { 
      setError("Contact number must be exactly 10 digits"); 
      return; 
    }
    const qty = Number.parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty <= 0) { 
      setError("Quantity must be a positive integer"); 
      return; 
    }
    if (qty > book.quantity) {
      setError(`Only ${book.quantity} copies available`);
      return;
    }

    setSaving(true);
    try {
      const userId = localStorage.getItem("userId") || "demoUser";
      const username = localStorage.getItem("username") || customerName;
      const editingOrder = sessionStorage.getItem('editingOrder');
      const isEditing = !!editingOrder;
      
      const payload = {
        items: [{ 
          bookId: book.bookId || book.code || book._id, // Prefer custom product code
          quantity: qty,
          itemName: book.itemName,
          price: book.price
        }],
        userid: userId,
        username,
        customerName,
        customerContact,
        bookName: book.itemName,
        orderDate: new Date().toISOString(),
        totalItems: qty,
        totalPrice: book.price * qty
      };
      
      let res;
      if (isEditing) {
        const orderData = JSON.parse(editingOrder);
        res = await fetch(`http://localhost:5001/api/orders/${orderData.orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:5001/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || (isEditing ? "Failed to update order" : "Failed to create order"));
      }
      
      // Clear session storage and navigate back appropriately
      sessionStorage.removeItem('selectedBook');
      sessionStorage.removeItem('editingOrder');
      if (setActiveTab && setCurrentView) {
        if (isEditing) {
          // If editing, go back to my orders
          setActiveTab('my-orders');
          setCurrentView('my-orders');
        } else {
          // If creating new order, stay on books or go to my orders to see the new order
          setActiveTab('my-orders');
          setCurrentView('my-orders');
        }
      }
    } catch (e) {
      setError(e.message || "Failed to process order");
    } finally { 
      setSaving(false); 
    }
  };

  const cancel = () => {
    const isEditing = sessionStorage.getItem('editingOrder') !== null;
    sessionStorage.removeItem('selectedBook');
    sessionStorage.removeItem('editingOrder');
    if (setActiveTab && setCurrentView) {
      if (isEditing) {
        // If editing, go back to my orders
        setActiveTab('my-orders');
        setCurrentView('my-orders');
      } else {
        // If creating new order, go back to books
        setActiveTab('books');
        setCurrentView('books');
      }
    }
  };

  // Check if we're in editing mode
  const isEditing = sessionStorage.getItem('editingOrder') !== null;

  return (
    <div className="addorder-page">
      <div className="addorder-container">
        <h2>📝 {isEditing ? 'Edit Order' : 'Place Order'}</h2>
        
        {!book ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="error-text">Please select a book from the list.</p>
            <button 
              className="view-btn" 
              onClick={cancel}
              style={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Back to Books
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="addorder-form">
            {/* Book Information Display */}
            <div className="book-summary">
              <h3>📖 Selected Book</h3>
              <div className="book-info">
                <div><strong>Title:</strong> {book.itemName}</div>
                <div><strong>Price:</strong> Rs. {book.price}</div>
                <div><strong>Available:</strong> {book.quantity} copies</div>
                <div><strong>Book Code:</strong> {book.bookId || book.code || book._id}</div>
              </div>
            </div>

            {/* Order Form */}
            <div className="form-section">
              <h3>👤 Customer Information</h3>
              
              <div className="form-row">
                <label htmlFor="customerName">Customer Name *</label>
                <input 
                  id="customerName"
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="customerContact">Contact Number (10 digits) *</label>
                <input
                  id="customerContact"
                  type="tel"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="bookCode">Book Code</label>
                <input 
                  id="bookCode"
                  type="text" 
                  value={book.bookId || book.code || book._id} 
                  readOnly
                  className="readonly-field"
                />
              </div>

              <div className="form-row">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  max={book.quantity}
                  step={1}
                  placeholder="Enter quantity"
                  required
                />
                <small>Maximum available: {book.quantity}</small>
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <h4>📊 Order Summary</h4>
                <div className="summary-row">
                  <span>Book:</span>
                  <span>{book.itemName}</span>
                </div>
                <div className="summary-row">
                  <span>Quantity:</span>
                  <span>{quantity || 0}</span>
                </div>
                <div className="summary-row">
                  <span>Unit Price:</span>
                  <span>Rs. {book.price}</span>
                </div>
                <div className="summary-row total">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>Rs. {(book.price * (quantity || 0)).toFixed(2)}</strong></span>
                </div>
              </div>
            </div>

            {error && <div className="error-text">{error}</div>}
            
            <div className="actions-row">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={cancel}
                style={{
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="place-order-btn" 
                disabled={saving}
                style={{
                  background: saving ? '#bdc3c7' : 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {saving ? (isEditing ? "Updating Order..." : "Placing Order...") : (isEditing ? "Update Order" : "Place Order")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddOrder;


