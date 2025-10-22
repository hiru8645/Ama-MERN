import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Payment_New.css";

function Payment() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ buyerId: "", date: "", status: "" });

  // Fetch all payments
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/payments");
      setTransactions(res.data.payments || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Approve/Reject payment
  const handleUpdateStatus = async (id, status) => {
    try {
      const endpoint =
        status === "APPROVED"
          ? `http://localhost:5001/api/payments/${id}/approve`
          : `http://localhost:5001/api/payments/${id}/reject`;
      const res = await axios.put(endpoint);
      alert(res.data.message);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating status");
    }
  };

  // Delete payment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      const res = await axios.delete(`http://localhost:5001/api/payments/${id}`);
      alert(res.data.message);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting payment");
    }
  };

  // Filter payments
  const filteredTransactions = transactions.filter((tx) => {
    const matchUser = filters.buyerId ? tx.buyerId.includes(filters.buyerId) : true;
    const matchDate = filters.date
      ? new Date(tx.date).toISOString().slice(0, 10) === filters.date
      : true;
    const matchStatus = filters.status
      ? tx.status.toUpperCase() === filters.status.toUpperCase()
      : true;

    return matchUser && matchDate && matchStatus;
  });

  return (
    <div className="payments-page">
      <div className="payments-container">
        <h2>💳 Payments Management</h2>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by Buyer ID"
            value={filters.buyerId}
            onChange={(e) => setFilters({ ...filters, buyerId: e.target.value })}
          />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {filteredTransactions.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx._id} className="transaction-card">
              <p><strong>Payment ID:</strong> {tx.paymentId}</p>
              <p><strong>Code ID:</strong> {tx.codeId}</p>
              <p><strong>Buyer ID:</strong> {tx.buyerId}</p>
              <p><strong>Giver ID:</strong> {tx.giverId}</p>
              <p><strong>Book ID:</strong> {tx.bookId}</p>
              <p><strong>Amount:</strong> Rs. {tx.amount}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${tx.status.toLowerCase()}`}>
                  {tx.status}
                </span>
              </p>
              <p><strong>Payment Date:</strong> {new Date(tx.date).toLocaleDateString()}</p>
              <div className="actions">
                <button onClick={() => handleUpdateStatus(tx._id, "APPROVED")}>Approve</button>
                <button onClick={() => handleUpdateStatus(tx._id, "REJECTED")}>Reject</button>
                <button className="delete-btn" onClick={() => handleDelete(tx._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Payment;
