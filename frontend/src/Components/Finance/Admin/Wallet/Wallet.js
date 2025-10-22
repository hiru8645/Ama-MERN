import React, { useEffect, useState } from "react";
import "./Wallet.css";

function Wallet() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch wallets
  const fetchWallets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/wallets");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setWallets(data.wallets || []);
    } catch (err) {
      setError("Failed to fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // Update wallet balance
  const handleUpdate = async (wallet) => {
    const amount = parseFloat(prompt("Enter amount (positive = credit, negative = debit):"));
    if (isNaN(amount)) return alert("Invalid amount");

    setActionLoading(true);
    const url =
      wallet.type === "system"
        ? "http://localhost:5001/api/wallets/system/balance"
        : `http://localhost:5001/api/wallets/${wallet.userId}/balance`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      alert(data.message);
      fetchWallets();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete wallet
  const handleDelete = async (wallet) => {
    if (!window.confirm("Are you sure you want to delete this wallet?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/wallets/${wallet.userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      alert(data.message);
      fetchWallets();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="wallet">
      <h1>Wallet Management</h1>
      {loading ? (
        <p>Loading wallets...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="wallet-container">
          {wallets.map((wallet) => (
            <div
              key={wallet._id}
              className={`wallet-card ${wallet.type === "system" ? "system-wallet" : ""}`}
            >
              <h2>{wallet.type === "system" ? "System Wallet" : "User Wallet"}</h2>
              {wallet.type !== "system" && (
                <p>
                  <strong>User ID:</strong> {wallet.userId}
                </p>
              )}
              <p>
                <strong>Balance:</strong> Rs.{wallet.balance.toFixed(2)}
              </p>
              <p className="wallet-footer">
                Created: {new Date(wallet.createdAt).toLocaleDateString()}
              </p>
              <div className="wallet-actions">
                <button disabled={actionLoading} onClick={() => handleUpdate(wallet)}>
                  Update
                </button>
                {wallet.type !== "system" && (
                  <button disabled={actionLoading} onClick={() => handleDelete(wallet)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wallet;
