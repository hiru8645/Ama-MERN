import React, { useEffect, useState } from "react";
import "./UserWalletManagement.css";

function UserWalletManagement() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/wallets");
      const data = await res.json();
      
      if (res.ok) {
        setWallets(data.wallets || []);
      } else {
        setError(data.message || "Failed to fetch wallets");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateWallet = async (walletId) => {
    try {
      const newBalance = prompt("Enter new balance:");
      if (newBalance === null) return;
      
      const balance = parseFloat(newBalance);
      if (isNaN(balance) || balance < 0) {
        alert("Please enter a valid positive number");
        return;
      }

      const res = await fetch(`http://localhost:5001/api/wallets/${walletId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ balance }),
      });

      if (res.ok) {
        alert("Wallet updated successfully!");
        fetchWallets();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update wallet");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating wallet");
    }
  };

  const deleteWallet = async (walletId, walletType) => {
    if (walletType === "SYSTEM") {
      alert("System wallet cannot be deleted!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this wallet?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/wallets/${walletId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Wallet deleted successfully!");
        fetchWallets();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete wallet");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting wallet");
    }
  };

  if (loading) {
    return (
      <div className="wallet-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading wallets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-management-error">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={fetchWallets} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-management-container">
      <div className="wallet-header">
        <h1>💳 Wallet Management</h1>
        <p>Manage your digital wallets and balances</p>
      </div>

      <div className="wallets-grid">
        {wallets.map((wallet) => (
          <div
            key={wallet._id}
            className={`wallet-card ${
              wallet.walletType === "SYSTEM" ? "system-wallet" : "user-wallet"
            }`}
          >
            <div className="wallet-header-section">
              <h3>
                {wallet.walletType === "SYSTEM" ? "🏦 System Wallet" : "👤 User Wallet"}
              </h3>
              <div className="wallet-type-badge">
                {wallet.walletType || "USER"}
              </div>
            </div>

            <div className="wallet-details">
              <div className="wallet-detail">
                <label>User ID:</label>
                <span>{wallet.userId}</span>
              </div>
              <div className="wallet-detail">
                <label>Balance:</label>
                <span className="balance">Rs. {wallet.balance?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="wallet-detail">
                <label>Created:</label>
                <span>{new Date(wallet.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="wallet-actions">
              <button
                className="update-btn"
                onClick={() => updateWallet(wallet._id)}
              >
                ✏️ Update
              </button>
              {wallet.walletType !== "SYSTEM" && (
                <button
                  className="delete-btn"
                  onClick={() => deleteWallet(wallet._id, wallet.walletType)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {wallets.length === 0 && (
        <div className="no-wallets">
          <h2>📭 No Wallets Found</h2>
          <p>No wallets are currently available in the system.</p>
        </div>
      )}
    </div>
  );
}

export default UserWalletManagement;