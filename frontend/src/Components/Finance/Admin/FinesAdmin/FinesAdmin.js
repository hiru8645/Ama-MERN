import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FinesAdmin.css";

function FinesAdmin() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check for overdue books
  const checkOverdueBooks = () => {
    try {
      const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
      const returnedBookIds = JSON.parse(localStorage.getItem('returnedBooks') || '[]').map(book => book.id);
      
      // Filter active borrowed books (not returned)
      const activeBorrowedBooks = borrowedBooks.filter(book => !returnedBookIds.includes(book.id));
      
      // Find overdue books
      const now = new Date();
      const overdueList = activeBorrowedBooks.filter(book => {
        if (!book.dueDate) return false;
        try {
          const dueDate = new Date(book.dueDate);
          return now > dueDate;
        } catch (error) {
          console.error('Error parsing due date for book:', book.title, error);
          return false;
        }
      });

      setOverdueBooks(overdueList);
      return overdueList;
    } catch (error) {
      console.error('Error checking overdue books:', error);
      return [];
    }
  };

  // Fetch all fines
  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/fines"); // Admin: all fines
      setFines(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching fines:", err);
      setError("Failed to fetch fines. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
    checkOverdueBooks();
  }, []);

  // Approve fine
  const approveFine = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/fines/${id}/approve`);
      alert("Fine approved successfully");
      fetchFines();
    } catch (err) {
      console.error("Error approving fine:", err);
      alert("Error approving fine");
    }
  };

  // Reject fine
  const rejectFine = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/fines/${id}/reject`);
      alert("Fine rejected successfully");
      fetchFines();
    } catch (err) {
      console.error("Error rejecting fine:", err);
      alert("Error rejecting fine");
    }
  };

  // Delete fine
  const deleteFine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fine?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/fines/${id}`);
      alert("Fine deleted successfully");
      fetchFines();
    } catch (err) {
      console.error("Error deleting fine:", err);
      alert("Error deleting fine");
    }
  };

  return (
    <div className="fines-page">
      <h2>📋 All Fines</h2>
      
      {/* Overdue Books Notification */}
      {overdueBooks.length > 0 && (
        <div className="overdue-notification">
          <div className="notification-header">
            <h3>⚠️ Overdue Books Alert</h3>
            <button 
              className="toggle-details"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {showNotifications ? 'Hide Details' : `Show ${overdueBooks.length} Overdue Books`}
            </button>
          </div>
          
          {showNotifications && (
            <div className="overdue-details">
              <p className="alert-message">
                📚 There are {overdueBooks.length} overdue book(s) that require fine calculation:
              </p>
              <div className="overdue-books-list">
                {overdueBooks.map((book, index) => {
                  const daysOverdue = Math.floor((new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={index} className="overdue-book-item">
                      <div className="book-info">
                        <span className="book-title">{book.title}</span>
                        <span className="borrower">Borrowed by: {book.borrowerName}</span>
                        <span className="due-date">Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                        <span className="days-overdue">{daysOverdue} days overdue</span>
                      </div>
                      <div className="fine-action">
                        <span className="suggested-fine">Suggested Fine: Rs.{daysOverdue * 10}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p>Loading fines...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchFines}>Retry</button>
        </div>
      ) : fines.length === 0 ? (
        <div className="no-data">
          <p>No fines found.</p>
          <small>Fines will appear here when users exceed due dates.</small>
        </div>
      ) : (
        <div className="fines-container">
          {fines.map((fine) => (
            <div key={fine._id} className="fine-card">
              <h3>Fine</h3>
              <p><strong>User ID:</strong> {fine.userId}</p>
              <p><strong>Book ID:</strong> {fine.bookId}</p>
              <p><strong>Overdue Days:</strong> {fine.overdueDays}</p>
              <p><strong>Amount:</strong> Rs.{fine.amount}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${fine.status.toLowerCase()}`}>
                  {fine.status}
                </span>
              </p>
              <p className="fine-footer">
                Created: {new Date(fine.createdAt).toLocaleDateString()}
              </p>

              {/* Action buttons */}
              <div className="fine-actions">
                <button
                  className="approve-btn"
                  onClick={() => approveFine(fine._id)}
                  disabled={fine.status === "APPROVED"}
                >
                  ✅ Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => rejectFine(fine._id)}
                  disabled={fine.status === "REJECTED"}
                >
                  ❌ Reject
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteFine(fine._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FinesAdmin;
