import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RefundRequest.css";

function RefundRequest() {
  const [refunds, setRefunds] = useState([]);

  // Fetch all refunds
  const fetchRefunds = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/refunds");
      setRefunds(res.data.refunds || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch refund requests");
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  // Update status (Approve/Reject)
  const handleUpdateStatus = async (id, status) => {
    try {
      // Map status to backend route
      let action = "";
      if (status === "APPROVED") action = "approve";
      if (status === "REJECTED") action = "reject";

      const url = `http://localhost:5001/api/refunds/${id}/${action}`;
      const res = await axios.put(url);
      alert(res.data.message || `Refund ${status.toLowerCase()}`);
      fetchRefunds();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating refund status");
    }
  };

  // Delete refund
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5001/api/refunds/${id}`);
      alert(res.data.message || "Refund deleted");
      fetchRefunds();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting refund request");
    }
  };

  return (
    <div className="refunds-page">
      <div className="refunds-container">
        <h2>🔄 Refund Requests</h2>
        {refunds.length === 0 ? (
          <p>No refund requests found.</p>
        ) : (
          refunds.map((rf) => (
            <div key={rf._id} className="refund-card">
              <p><strong>Refund ID:</strong> {rf.refundId}</p>
              <p><strong>Payment ID:</strong> {rf.paymentId}</p>
              <p><strong>Buyer ID:</strong> {rf.buyerId}</p>
              <p><strong>Giver ID:</strong> {rf.giverId || "-"}</p>
              <p><strong>Description:</strong> {rf.description}</p>
              <p><strong>Status:</strong> {rf.status}</p>
              <p><strong>Request Date:</strong> {new Date(rf.requestDate).toLocaleDateString()}</p>
              <div className="actions">
                <button onClick={() => handleUpdateStatus(rf._id, "APPROVED")}>✅ Approve</button>
                <button onClick={() => handleUpdateStatus(rf._id, "REJECTED")}>❌ Reject</button>
                <button onClick={() => handleDelete(rf._id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RefundRequest;

