import React, { useEffect, useState } from "react";
import axios from "axios";
import { Wallet2, CreditCard, RefreshCcw, Bell, X } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./FinanceDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function FinanceDashboard({ setActiveSection }) {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/notifications");
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch wallets
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/wallets");
        setWallets(Array.isArray(res.data.wallets) ? res.data.wallets : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWallets();
  }, []);

  // Fetch payments and refunds
  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const paymentsRes = await axios.get("http://localhost:5001/api/payments");
        setPayments(Array.isArray(paymentsRes.data.payments) ? paymentsRes.data.payments : []);

        const refundsRes = await axios.get("http://localhost:5001/api/refunds");
        setRefunds(Array.isArray(refundsRes.data.refunds) ? refundsRes.data.refunds : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFinance();
  }, []);

  // Notifications handlers
  const removeNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          axios.delete(`http://localhost:5001/api/notifications/${n._id}`)
        )
      );
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Wallet bar chart
  const walletChartData = {
    labels: wallets.map((w) => (w.userId ? w.userId : "System")),
    datasets: [
      {
        label: "Wallet Balance (LKR)",
        data: wallets.map((w) => w.balance || 0),
        backgroundColor: wallets.map((w) => (w.userId ? "#3b82f6" : "#f87171")),
      },
    ],
  };

  const walletChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  // Pie chart helper
  const generatePieData = (items) => {
    const approved = items.filter((i) => i.status === "APPROVED").length;
    const rejected = items.filter((i) => i.status === "REJECTED").length;
    const pending = items.filter((i) => i.status === "PENDING").length;

    return {
      labels: ["Approved", "Rejected", "Pending"],
      datasets: [
        {
          data: [approved, rejected, pending],
          backgroundColor: ["#22c55e", "#ef4444", "#fbbf24"],
        },
      ],
    };
  };

  const pieOptions = { responsive: true, plugins: { legend: { position: "bottom" } } };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Topbar */}
        <div className="dashboard-topbar">
          <h2>Finance Dashboard</h2>
          <div className="notification">
            <div onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="notification-count">{notifications.length}</span>
              )}
            </div>
            {dropdownOpen && (
              <div className="notification-dropdown">
                {notifications.length === 0 && (
                  <div className="notification-item">No notifications</div>
                )}
                {notifications.map((n) => (
                  <div key={n._id} className="notification-item">
                    <span>{n.message}</span>
                    <X
                      size={16}
                      style={{ cursor: "pointer", marginLeft: "8px" }}
                      onClick={() => removeNotification(n._id)}
                    />
                  </div>
                ))}
                {notifications.length > 0 && (
                  <div
                    className="notification-item"
                    style={{ textAlign: "center", fontWeight: "bold", cursor: "pointer" }}
                    onClick={clearAllNotifications}
                  >
                    Clear All
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="dashboard-cards">
          <div className="dashboard-card wallet" onClick={() => setActiveSection && setActiveSection("wallet")}>
            <Wallet2 size={28} />
            <h3>Wallet Management</h3>
            <p>Check and manage user & system wallets.</p>
          </div>

          <div className="dashboard-card payment" onClick={() => setActiveSection && setActiveSection("payment")}>
            <CreditCard size={28} />
            <h3>Payment Management</h3>
            <p>View, approve, and reject payments.</p>
          </div>

          <div className="dashboard-card refund" onClick={() => setActiveSection && setActiveSection("refund")}>
            <RefreshCcw size={28} />
            <h3>Refund Requests</h3>
            <p>Submit and track your refund requests.</p>
          </div>
        </div>

        {/* Charts section */}
        <div className="charts-section">
          <div className="chart-box">
            <h4>Wallet Balances</h4>
            <Bar data={walletChartData} options={walletChartOptions} />
          </div>

          <div className="chart-box">
            <h4>Payments Status</h4>
            {payments.length > 0 ? (
              <Pie data={generatePieData(payments)} options={pieOptions} />
            ) : (
              <p style={{ textAlign: "center", color: "#555" }}>No payments yet</p>
            )}
          </div>

          <div className="chart-box">
            <h4>Refunds Status</h4>
            {refunds.length > 0 ? (
              <Pie data={generatePieData(refunds)} options={pieOptions} />
            ) : (
              <p style={{ textAlign: "center", color: "#555" }}>No refunds yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceDashboard;
