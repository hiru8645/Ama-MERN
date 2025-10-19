import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Payment.css";

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
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesBuyer = !filters.buyerId || transaction.buyerId.includes(filters.buyerId);
    const matchesDate = !filters.date || transaction.date.startsWith(filters.date);
    const matchesStatus = !filters.status || transaction.status === filters.status;
    return matchesBuyer && matchesDate && matchesStatus;
  });

  return (
    <div className="payment-management">
      <div className="payment-header">
        <h2>💳 Payment Management</h2>
        <p>Approve, reject, or delete payment transactions</p>
      </div>

      {/* Filters */}
      <div className="payment-filters">
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
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        {filteredTransactions.length === 0 ? (
          <div className="no-payments">
            <p>No payments found matching your criteria.</p>
          </div>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Code ID</th>
                <th>Buyer ID</th>
                <th>Giver ID</th>
                <th>Book ID</th>
                <th>Amount (LKR)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.paymentId}</td>
                  <td>{transaction.codeId}</td>
                  <td>{transaction.buyerId}</td>
                  <td>{transaction.giverId}</td>
                  <td>{transaction.bookId}</td>
                  <td>Rs. {transaction.amount}</td>
                  <td>
                    <span className={`status ${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="actions">
                    {transaction.status === "PENDING" && (
                      <>
                        <button
                          className="btn btn-approve"
                          onClick={() => handleUpdateStatus(transaction._id, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => handleUpdateStatus(transaction._id, "REJECTED")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(transaction._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Payment;