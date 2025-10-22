import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaWallet, FaCreditCard, FaFileInvoiceDollar, FaDownload } from 'react-icons/fa';
import './FinanceManagement.css';

const FinanceManagement = () => {
  const [payments, setPayments] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('payments');

  // Fetch all finance data
  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, walletsRes, refundsRes, finesRes] = await Promise.all([
        fetch('http://localhost:5001/api/payments'),
        fetch('http://localhost:5001/api/wallets'),
        fetch('http://localhost:5001/api/refunds'),
        fetch('http://localhost:5001/api/fines')
      ]);

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.payments || []);
      }
      if (walletsRes.ok) {
        const walletsData = await walletsRes.json();
        setWallets(walletsData.wallets || []);
      }
      if (refundsRes.ok) {
        const refundsData = await refundsRes.json();
        setRefunds(refundsData.refunds || []);
      }
      if (finesRes.ok) {
        const finesData = await finesRes.json();
        setFines(finesData.fines || []);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Approve payment
  const approvePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/payments/${paymentId}/approve`, {
        method: 'PUT'
      });
      if (response.ok) {
        alert('Payment approved successfully');
        fetchFinanceData();
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Error approving payment');
    }
  };

  // Reject payment
  const rejectPayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/payments/${paymentId}/reject`, {
        method: 'PUT'
      });
      if (response.ok) {
        alert('Payment rejected successfully');
        fetchFinanceData();
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Error rejecting payment');
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const approvedPayments = payments.filter(p => p.status === 'APPROVED').length;
    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
    const totalWalletBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    
    return {
      totalPayments: totalPayments.toFixed(2),
      approvedPayments,
      pendingPayments,
      totalWalletBalance: totalWalletBalance.toFixed(2),
      totalRefunds: refunds.length,
      totalFines: fines.length
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="finance-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-management">
      <div className="finance-header">
        <h2><FaMoneyBillWave /> Finance Management</h2>
        <p>Manage payments, wallets, refunds, and fines</p>
      </div>

      {/* Statistics Cards */}
      <div className="finance-stats">
        <div className="stat-card">
          <div className="stat-icon payments"><FaMoneyBillWave /></div>
          <div className="stat-info">
            <h3>${stats.totalPayments}</h3>
            <p>Total Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon wallets"><FaWallet /></div>
          <div className="stat-info">
            <h3>${stats.totalWalletBalance}</h3>
            <p>Total Wallet Balance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending"><FaCreditCard /></div>
          <div className="stat-info">
            <h3>{stats.pendingPayments}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon approved"><FaFileInvoiceDollar /></div>
          <div className="stat-info">
            <h3>{stats.approvedPayments}</h3>
            <p>Approved Payments</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="finance-tabs">
        <button 
          className={`tab-btn ${activeSection === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveSection('payments')}
        >
          <FaMoneyBillWave /> Payments ({payments.length})
        </button>
        <button 
          className={`tab-btn ${activeSection === 'wallets' ? 'active' : ''}`}
          onClick={() => setActiveSection('wallets')}
        >
          <FaWallet /> Wallets ({wallets.length})
        </button>
        <button 
          className={`tab-btn ${activeSection === 'refunds' ? 'active' : ''}`}
          onClick={() => setActiveSection('refunds')}
        >
          💰 Refunds ({refunds.length})
        </button>
        <button 
          className={`tab-btn ${activeSection === 'fines' ? 'active' : ''}`}
          onClick={() => setActiveSection('fines')}
        >
          ⚠️ Fines ({fines.length})
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === 'payments' && (
        <div className="finance-section">
          <div className="section-header">
            <h3>Payment Management</h3>
            <button className="btn btn-primary">
              <FaDownload /> Export Payments
            </button>
          </div>
          <div className="table-container">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>Code ID</th>
                  <th>Buyer ID</th>
                  <th>Giver ID</th>
                  <th>Book ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.codeId}</td>
                    <td>{payment.buyerId}</td>
                    <td>{payment.giverId}</td>
                    <td>{payment.bookId}</td>
                    <td>Rs.{payment.amount}</td>
                    <td>
                      <span className={`status ${payment.status.toLowerCase()}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                    <td>
                      {payment.status === 'PENDING' && (
                        <div className="action-buttons">
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => approvePayment(payment._id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => rejectPayment(payment._id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'wallets' && (
        <div className="finance-section">
          <div className="section-header">
            <h3>Wallet Management</h3>
          </div>
          <div className="table-container">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Balance</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet._id}>
                    <td>{wallet.userId}</td>
                    <td>${wallet.balance}</td>
                    <td>{new Date(wallet.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-primary btn-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'refunds' && (
        <div className="finance-section">
          <div className="section-header">
            <h3>Refund Management</h3>
          </div>
          <div className="table-container">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund._id}>
                    <td>{refund.userId}</td>
                    <td>Rs.{refund.amount}</td>
                    <td>{refund.reason}</td>
                    <td>
                      <span className={`status ${refund.status.toLowerCase()}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td>{new Date(refund.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-primary btn-sm">
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'fines' && (
        <div className="finance-section">
          <div className="section-header">
            <h3>Fine Management</h3>
          </div>
          <div className="table-container">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr key={fine._id}>
                    <td>{fine.userId}</td>
                    <td>Rs.{fine.amount}</td>
                    <td>{fine.reason}</td>
                    <td>
                      <span className={`status ${fine.status.toLowerCase()}`}>
                        {fine.status}
                      </span>
                    </td>
                    <td>{new Date(fine.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-primary btn-sm">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
