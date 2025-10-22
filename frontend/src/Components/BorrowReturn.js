import React, { useState, useEffect, useCallback } from "react";
import { FaBook, FaBookReader, FaClock } from "react-icons/fa";
import "./BorrowReturn.css";

// Backend API base URL
const API_URL = "http://localhost:5001/api/products";

const BorrowReturn = () => {
  const [activeTab, setActiveTab] = useState("borrow");
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [fineRate] = useState(10);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch books from Products API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        console.log('Fetching books from API...');
        const response = await fetch(API_URL);
        console.log('API Response status:', response.status);
        if (response.ok) {
          const products = await response.json();
          console.log('Fetched products:', products);
          // Convert products to book format for borrow/return
          const convertedBooks = products.map(product => ({
            id: product._id,
            title: product.name,
            author: product.supplier || "Unknown Author",
            category: product.category,
            price: product.price,
            code: product.code,
            status: product.stockCurrent > 0 ? "Available" : "Out of Stock",
            stockCurrent: product.stockCurrent,
            stockTotal: product.stockTotal
          }));
          console.log('Converted books:', convertedBooks);
          setBooks(convertedBooks);
        } else {
          console.error('Failed to fetch products:', response.status);
          // Fallback to demo data if API fails
          setBooks([
            { id: 1, title: "Database Systems", author: "Elmasri", status: "Available" },
            { id: 2, title: "Operating Systems", author: "Silberschatz", status: "Available" },
            { id: 3, title: "Computer Networks", author: "Tanenbaum", status: "Available" },
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to demo data
        setBooks([
          { id: 1, title: "Database Systems", author: "Elmasri", status: "Available" },
          { id: 2, title: "Operating Systems", author: "Silberschatz", status: "Available" },
          { id: 3, title: "Computer Networks", author: "Tanenbaum", status: "Available" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();

    // Load existing borrowed books from localStorage
    const existingBorrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
    console.log('📚 Loaded existing borrowed books from localStorage:', existingBorrowedBooks);

    // Add demo books for testing if no existing books
    if (existingBorrowedBooks.length === 0) {
      setTimeout(() => {
        const now = new Date();
        
        // Create a definitely overdue book (due 7 days ago)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
        
        const demoOverdueBook = {
          id: "demo-overdue-999",
          title: "Demo Overdue Book",
          author: "Test Author",
          borrowerName: "John Doe",
          borrowerId: "ID-123",
          borrowDate: new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000)).toISOString(), // 20 days ago
          dueDate: weekAgo.toISOString(), // Due 7 days ago - definitely overdue
          status: "Borrowed",
          isReturned: false,
          borrowTransactionId: "demo-txn-999"
        };
        
        // Create a book with future due date
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        futureDate.setHours(12, 0, 0, 0);
        
        const demoBorrowedBook = {
          id: "demo-borrowed-998",
          title: "Demo Borrowed Book",
          author: "Demo Author", 
          borrowerName: "Jane Smith",
          borrowerId: "ID-456",
          borrowDate: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(), // 5 days ago
          dueDate: futureDate.toISOString(), // Due in 7 days
          status: "Borrowed",
          isReturned: false,
          borrowTransactionId: "demo-txn-998"
        };

        console.log('Setting up demo books...');
        const demoBooks = [demoOverdueBook, demoBorrowedBook];
        setBorrowedBooks(demoBooks);
        localStorage.setItem('borrowedBooks', JSON.stringify(demoBooks));
      }, 100);
    } else {
      setBorrowedBooks(existingBorrowedBooks);
    }
  }, []);

  // Real-time clock and overdue status updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time tracking

    return () => clearInterval(timer);
  }, []);

  // Helper function to check if a book is overdue
  const isOverdue = useCallback((book) => {
    if (!book || !book.dueDate) {
      console.log('Book has no due date:', book?.title || 'unknown');
      return false;
    }
    
    try {
      const dueDate = new Date(book.dueDate);
      const now = new Date();
      
      // Simple comparison - if current time is after due date, it's overdue
      const isBookOverdue = now > dueDate;
      
      console.log(`Checking overdue for "${book.title}":`, {
        dueDate: dueDate.toLocaleString(),
        now: now.toLocaleString(),
        isOverdue: isBookOverdue,
        timeDiff: now.getTime() - dueDate.getTime()
      });
      
      return isBookOverdue;
    } catch (error) {
      console.error('Error checking overdue status for book:', book.title, error);
      return false;
    }
  }, []); // Removed currentTime dependency since we create new Date() inside the function

  // Helper function to calculate days remaining or overdue
  const getDaysInfo = useCallback((book) => {
    if (!book.dueDate) return { type: 'unknown', days: 0 };
    
    const dueDate = new Date(book.dueDate);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff > 0) {
      return { type: 'remaining', days: daysDiff };
    } else if (daysDiff === 0) {
      return { type: 'due-today', days: 0 };
    } else {
      return { type: 'overdue', days: Math.abs(daysDiff) };
    }
  }, []);

  // Enhanced fine calculation with real-time updates
  const calculateFine = useCallback((book) => {
    if (!isOverdue(book)) return 0;
    
    const daysInfo = getDaysInfo(book);
    if (daysInfo.type === 'overdue') {
      return daysInfo.days * fineRate;
    }
    return 0;
  }, [isOverdue, getDaysInfo, fineRate]);

  // Calculate real-time statistics
  const availableCount = books.filter((b) => b.status === "Available").length;
  const borrowedCount = borrowedBooks.length;

  // Animated counters with real-time updates
  const [counterAvailable, setCounterAvailable] = useState(0);
  const [counterBorrowed, setCounterBorrowed] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCounterAvailable(Math.min(step, availableCount));
      setCounterBorrowed(Math.min(step, borrowedCount));
      if (step >= Math.max(availableCount, borrowedCount)) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [availableCount, borrowedCount]);

  // Enhanced borrow function with automatic deadline creation and localStorage sync
  const handleBorrow = (book) => {
    if (book.status === "Borrowed" || book.status === "Out of Stock") {
      alert("This book is not available for borrowing!");
      return;
    }

    if (book.stockCurrent && book.stockCurrent <= 0) {
      alert("This book is out of stock!");
      return;
    }
    
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14); // Exactly 2 weeks deadline
    
    const borrowerName = prompt("Enter borrower name:") || "Anonymous";
    const borrowerId = prompt("Enter borrower ID:") || `ID-${Date.now()}`;
    
    const newBorrowRecord = { 
      ...book, 
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
      borrowerName,
      borrowerId,
      status: "Borrowed",
      isReturned: false,
      borrowTransactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Update local state
    const updatedBorrowedBooks = [...borrowedBooks, newBorrowRecord];
    setBorrowedBooks(updatedBorrowedBooks);
    
    // Sync with localStorage for InventoryReport
    localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));
    
    // Update books status
    setBooks(prev => prev.map(b => 
      b.id === book.id ? { 
        ...b, 
        status: "Borrowed",
        stockCurrent: b.stockCurrent ? b.stockCurrent - 1 : 0
      } : b
    ));
    
    console.log('📚 Book borrowed and saved to localStorage:', newBorrowRecord);
    alert(`Book borrowed successfully!\nBorrower: ${borrowerName}\nDue Date: ${dueDate.toDateString()}\nRemember: Return within 14 days to avoid fine!`);
  };

  // Enhanced return function with real-time fine calculation and localStorage sync
  const handleReturn = (book) => {
    const returnDate = new Date();
    const fine = calculateFine(book);
    const daysInfo = getDaysInfo(book);
    
    let statusMessage = `Book Returned: ${book.title}\nBorrower: ${book.borrowerName || 'Unknown'}\nReturn Date: ${returnDate.toDateString()}`;
    
    if (fine > 0) {
      statusMessage += `\n⚠️ OVERDUE: ${daysInfo.days} days late\n💰 Fine: Rs.${fine}`;
    } else if (daysInfo.type === 'due-today') {
      statusMessage += `\n✅ Returned on time (Due today)`;
    } else {
      statusMessage += `\n✅ Returned on time (${daysInfo.days} days early)`;
    }
    
    alert(statusMessage);
    
    // Create return record
    const returnRecord = {
      ...book,
      returnDate: returnDate.toISOString(),
      isReturned: true,
      fine: fine,
      returnStatus: fine > 0 ? 'overdue' : 'ontime'
    };
    
    // Update borrowed books list
    const updatedBorrowedBooks = borrowedBooks.filter(b => b.id !== book.id);
    setBorrowedBooks(updatedBorrowedBooks);
    
    // Get existing returned books and add new return
    const existingReturnedBooks = JSON.parse(localStorage.getItem('returnedBooks') || '[]');
    const updatedReturnedBooks = [...existingReturnedBooks, returnRecord];
    
    // Update localStorage for both borrowed and returned books
    localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));
    localStorage.setItem('returnedBooks', JSON.stringify(updatedReturnedBooks));
    
    // Update book status to available
    setBooks(prev => prev.map(b => 
      b.id === book.id ? { 
        ...b, 
        status: "Available",
        stockCurrent: b.stockCurrent ? b.stockCurrent + 1 : 1
      } : b
    ));
    
    console.log('📖 Book returned and saved to localStorage:', returnRecord);
  };

  return (
    <div className="borrow-return-premium">
      <div className="header-section">
        <h1>📚 Library Borrow & Return Management</h1>
        <div className="real-time-clock">
          <FaClock style={{marginRight: '8px'}} />
          Current Time: {currentTime.toLocaleString()}
        </div>
      </div>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="dashboard-card available">
          <FaBook size={30} />
          <h2>{counterAvailable}</h2>
          <p>Available Books</p>
        </div>
        <div className="dashboard-card borrowed">
          <FaBookReader size={30} />
          <h2>{counterBorrowed}</h2>
          <p>Borrowed Books</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "borrow" ? "tab active" : "tab"} onClick={() => setActiveTab("borrow")}>
          📚 Borrow Books
        </button>
        <button className={activeTab === "return" ? "tab active" : "tab"} onClick={() => setActiveTab("return")}>
          📖 Return Books
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Borrow Grid */}
      {activeTab === "borrow" && (
        <div className="book-grid">
          {loading ? (
            <div className="no-books">Loading books...</div>
          ) : (
            books.filter((b) => b.status === "Available" && (b.stockCurrent > 0 || !b.stockCurrent) && b.title.toLowerCase().includes(search.toLowerCase()))
              .map((book, idx) => (
                <div key={book.id} className="book-card available-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  {book.category && <p>Category: {book.category}</p>}
                  {book.code && <p>Code: {book.code}</p>}
                  {book.stockCurrent !== undefined && <p>Stock: {book.stockCurrent}</p>}
                  <span className="badge available">Available</span>
                  <button className="btn borrow-btn" onClick={() => handleBorrow(book)}>Borrow</button>
                </div>
              ))
          )}
          {!loading && books.filter((b) => b.status === "Available" && (b.stockCurrent > 0 || !b.stockCurrent)).length === 0 && <p className="no-books">No available books.</p>}
        </div>
      )}

      {/* Return Grid - Show all borrowed books */}
      {activeTab === "return" && (
        <div className="book-grid">
          {borrowedBooks.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
            .map((book, idx) => {
              const daysInfo = getDaysInfo(book);
              const fine = calculateFine(book);
              const bookIsOverdue = isOverdue(book);
              return (
                <div key={book.id} className={`book-card ${bookIsOverdue ? 'overdue-card glow' : 'borrowed-card'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p>Borrower: {book.borrowerName}</p>
                  <p>Borrowed: {new Date(book.borrowDate).toDateString()}</p>
                  <p>Due: {new Date(book.dueDate).toDateString()}</p>
                  {daysInfo.type === 'due-today' && (
                    <p style={{color: '#f39c12', fontWeight: 'bold'}}>⏰ DUE TODAY!</p>
                  )}
                  {daysInfo.type === 'remaining' && (
                    <p style={{color: '#27ae60', fontWeight: 'bold'}}>📅 {daysInfo.days} days remaining</p>
                  )}
                  {daysInfo.type === 'overdue' && (
                    <p className="fine">🚨 OVERDUE: {daysInfo.days} days</p>
                  )}
                  {fine > 0 && (
                    <p className="fine">💰 Fine: Rs.{fine}</p>
                  )}
                  <span className={`badge ${bookIsOverdue ? 'overdue' : 'borrowed'}`}>
                    {bookIsOverdue ? 'OVERDUE' : 'On Time'}
                  </span>
                  <button className="btn return-btn" onClick={() => handleReturn(book)}>
                    {fine > 0 ? `Return & Pay Fine (Rs.${fine})` : 'Return Book'}
                  </button>
                </div>
              );
            })}
          {borrowedBooks.length === 0 && <p className="no-books">No borrowed books to return.</p>}
        </div>
      )}


    </div>
  );
};

export default BorrowReturn;
