import React, { useEffect, useState } from "react";
import { Wallet, CreditCard, RefreshCcw, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import './UserDashboard_New.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function UserDashboard({ setActiveSection }) {
  const [wallet, setWallet] = useState(null);
  const [stats, setStats] = useState({
    totalPayments: 0,
    pendingRefunds: 0,
    totalFines: 0,
    completedTransactions: 0
  });
  const [chartData, setChartData] = useState({
    payments: [],
    refunds: [],
    fines: []
  });
  const userId = localStorage.getItem("userId") || "IT23650534"; 

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/wallets/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setWallet(data.wallet);
        }
      } catch (err) {
        console.error(err);
        setWallet(null);
      }
    };

    const fetchStats = async () => {
      try {
        // Fetch payments statistics
        const paymentsRes = await fetch(`http://localhost:5001/api/payments/user/${userId}`);
        const refundsRes = await fetch(`http://localhost:5001/api/refunds/user/${userId}`);
        const finesRes = await fetch(`http://localhost:5001/api/fines/user/${userId}`);
        
        const paymentsData = paymentsRes.ok ? await paymentsRes.json() : { payments: [] };
        const refundsData = refundsRes.ok ? await refundsRes.json() : { refunds: [] };
        const finesData = finesRes.ok ? await finesRes.json() : { fines: [] };

        const payments = paymentsData.payments || [];
        const refunds = refundsData.refunds || [];
        const fines = finesData.fines || [];

        setStats({
          totalPayments: payments.length || 0,
          pendingRefunds: refunds.filter(r => r.status === 'PENDING').length || 0,
          totalFines: fines.filter(f => f.status === 'PENDING').length || 0,
          completedTransactions: payments.filter(p => p.status === 'APPROVED').length || 0
        });

        setChartData({
          payments,
          refunds,
          fines
        });

        // Add some mock data for demonstration if no real data exists
        if (payments.length === 0 && refunds.length === 0 && fines.length === 0) {
          setChartData({
            payments: [
              { status: 'APPROVED' },
              { status: 'APPROVED' }, 
              { status: 'PENDING' },
              { status: 'REJECTED' }
            ],
            refunds: [
              { status: 'APPROVED' },
              { status: 'PENDING' },
              { status: 'PENDING' }
            ],
            fines: [
              { status: 'PENDING' },
              { status: 'APPROVED' },
              { status: 'PENDING' }
            ]
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchWallet();
    fetchStats();
  }, [userId]);

  // Pie chart helper function
  const generatePieData = (items, title) => {
    const approved = items.filter((i) => i.status === "APPROVED").length;
    const rejected = items.filter((i) => i.status === "REJECTED").length;
    const pending = items.filter((i) => i.status === "PENDING").length;

    return {
      labels: ["Approved", "Rejected", "Pending"],
      datasets: [
        {
          label: title,
          data: [approved, rejected, pending],
          backgroundColor: [
            "#22c55e", // Green for approved
            "#ef4444", // Red for rejected
            "#fbbf24"  // Yellow for pending
          ],
          borderWidth: 2,
          borderColor: "#ffffff"
        },
      ],
    };
  };

  const pieOptions = { 
    responsive: true, 
    plugins: { 
      legend: { 
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Dashboard cards
  const cards = [
    { 
      title: "Wallet Management", 
      desc: "Manage your wallet balance", 
      color: "wallet",
      icon: "💳",
      section: "wallet",
      value: wallet ? `Rs. ${wallet.balance || 0}` : "Loading..."
    },
    { 
      title: "Payment", 
      desc: "Make or view payments", 
      color: "payment",
      icon: "💰", 
      section: "payment",
      value: `${stats.totalPayments} payments`
    },
    { 
      title: "Refund Request", 
      desc: "Request refunds", 
      color: "refund",
      icon: "🔄", 
      section: "refund",
      value: `${stats.pendingRefunds} pending`
    },
    { 
      title: "Fines", 
      desc: "View your fines", 
      color: "fines",
      icon: "⚠️", 
      section: "fines",
      value: `${stats.totalFines} active`
    },
    { 
      title: "Reports", 
      desc: "View transaction reports", 
      color: "reports",
      icon: "📊", 
      section: "reports",
      value: `${stats.completedTransactions} completed`
    }
  ];

  return (
    <div className="user-dashboard-page">
      <div className="dashboard-header">
        <h1>💼 Finance Dashboard</h1>
        <p>Manage your financial activities and transactions</p>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`dashboard-card ${card.color}`}
            onClick={() => setActiveSection && setActiveSection(card.section)}
          >
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <div className="card-value">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="stats-overview">
        <h2>📈 Quick Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.totalPayments}</div>
            <div className="stat-label">Total Payments</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.pendingRefunds}</div>
            <div className="stat-label">Pending Refunds</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalFines}</div>
            <div className="stat-label">Active Fines</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.completedTransactions}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Financial Charts */}
      <div className="charts-section">
        <h2>📊 Financial Analytics</h2>
        <div className="charts-grid">
          <div className="chart-container">
            <h3>Payment Status</h3>
            {chartData.payments.length > 0 ? (
              <div className="chart-wrapper">
                <Pie data={generatePieData(chartData.payments, "Payments")} options={pieOptions} />
              </div>
            ) : (
              <div className="no-data-message">
                <p>No payment data available</p>
              </div>
            )}
          </div>

          <div className="chart-container">
            <h3>Refund Status</h3>
            {chartData.refunds.length > 0 ? (
              <div className="chart-wrapper">
                <Pie data={generatePieData(chartData.refunds, "Refunds")} options={pieOptions} />
              </div>
            ) : (
              <div className="no-data-message">
                <p>No refund data available</p>
              </div>
            )}
          </div>

          <div className="chart-container">
            <h3>Fines Status</h3>
            {chartData.fines.length > 0 ? (
              <div className="chart-wrapper">
                <Doughnut data={generatePieData(chartData.fines, "Fines")} options={pieOptions} />
              </div>
            ) : (
              <div className="no-data-message">
                <p>No fines data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      {wallet && (
        <div className="wallet-summary">
          <h2>💳 Wallet Summary</h2>
          <div className="wallet-info">
            <div className="wallet-detail">
              <span>Balance:</span>
              <span className="balance">Rs. {wallet.balance || 0}</span>
            </div>
            <div className="wallet-detail">
              <span>Status:</span>
              <span className="status active">Active</span>
            </div>
            <div className="wallet-detail">
              <span>Last Updated:</span>
              <span>{new Date(wallet.updatedAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
