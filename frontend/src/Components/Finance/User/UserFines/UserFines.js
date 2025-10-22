import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserFines.css"; 

function UserFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId") || "IT23650534"; 

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/fines/user/${userId}`);
        // backend likely returns array directly
        setFines(res.data || []); 
      } catch (err) {
        console.error(err);
        setError("Failed to fetch fines");
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, [userId]);

  return (
    <div className="fines-page">
      <div className="fines-container">
        <h2>📌 My Fines</h2>
        {loading ? (
          <p>Loading fines...</p>
        ) : error ? (
          <p>{error}</p>
        ) : fines.length === 0 ? (
          <p>No fines found.</p>
        ) : (
          fines.map((fine) => (
            <div key={fine._id} className="fine-card">
              <h3>Fine</h3>
              <p><strong>Book ID:</strong> {fine.bookId}</p>
              <p><strong>Days Overdue:</strong> {fine.overdueDays}</p>
              <p><strong>Amount:</strong> Rs.{fine.amount}</p>
              <p className="fine-footer">
                Issued on: {new Date(fine.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserFines;
