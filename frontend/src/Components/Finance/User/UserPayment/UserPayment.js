import React, { useState } from "react";
import axios from "axios";
import "./UserPayment.css";

function UserPayment() {
  const [form, setForm] = useState({
    codeId: "",
    buyerId: "",
    giverId: "",
    bookId: "",
    amount: ""
  });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.codeId || !form.buyerId || !form.giverId || !form.bookId || !form.amount) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    if (form.buyerId === form.giverId) {
      setMessage("❌ Buyer and Giver IDs cannot be the same.");
      return;
    }

    if (form.amount <= 0) {
      setMessage("❌ Amount must be greater than 0.");
      return;
    }

    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      const res = await axios.post("http://localhost:5001/api/payments/create", payload);
      setMessage(res.data.message || "✅ Payment successful!");
      setForm({ codeId: "", buyerId: "", giverId: "", bookId: "", amount: "" });
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error processing payment"
      );
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>💳 Make a Payment</h2>
        <form className="payment-form" onSubmit={handleSubmit}>
          <label>Code ID</label>
          <input name="codeId" placeholder="Enter Code ID" value={form.codeId} onChange={handleChange} required />

          <label>Buyer ID</label>
          <input name="buyerId" placeholder="Enter Buyer ID" value={form.buyerId} onChange={handleChange} required />

          <label>Giver ID</label>
          <input name="giverId" placeholder="Enter Giver ID" value={form.giverId} onChange={handleChange} required />

          <label>Book ID</label>
          <input name="bookId" placeholder="Enter Book ID" value={form.bookId} onChange={handleChange} required />

          <label>Amount</label>
          <input name="amount" type="number" min="1" placeholder="Enter Amount" value={form.amount} onChange={handleChange} required />

          <button type="submit">Pay</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default UserPayment;
