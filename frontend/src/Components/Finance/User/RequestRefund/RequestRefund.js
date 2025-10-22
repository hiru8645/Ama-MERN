import React, { useState } from "react";
import axios from "axios";
import "./RequestRefund.css";

function RequestRefund() {
  const [form, setForm] = useState({
    paymentId: "",
    buyerId: "",
    giverId: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/refunds/create", form);
      alert(res.data.message || "Refund request submitted successfully");
      setForm({ paymentId: "", buyerId: "", giverId: "", description: "" });
    } catch (err) {
      // Check both message and error from backend
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error;
      alert(backendMessage || "Error submitting refund request");
    }
  };

  return (
    <div className="refund-page">
      <div className="refund-form-container">
        <h2>🔄 Request a Refund</h2>
        <form className="refund-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="paymentId"
            placeholder="Payment ID"
            value={form.paymentId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="buyerId"
            placeholder="Buyer ID"
            value={form.buyerId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="giverId"
            placeholder="Giver ID"
            value={form.giverId}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Reason for refund"
            value={form.description}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Refund Request</button>
        </form>
      </div>
    </div>
  );
}

export default RequestRefund;
