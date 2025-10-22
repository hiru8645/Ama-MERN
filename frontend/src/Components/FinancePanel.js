import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import FinanceSidebar from './Finance/FinanceSidebar';

// Admin Components (gets management/display functionality)
import FinanceDashboard from './Finance/Admin/FinanceDashboard/FinanceDashboard';
import AdminPayment from './Finance/Admin/Payment/Payment';  // Admin gets payment management list
import AdminRefundRequest from './Finance/Admin/RefundRequest/RefundRequest';  // Admin gets refund management list
import AdminFines from './Finance/Admin/FinesAdmin/FinesAdmin';  // Admin gets fines management with approve/reject
import AdminTransactions from './Finance/User/UserTransactions/UserTransactions';

// User Components (gets form functionality)
import UserDashboard from './Finance/User/UserDashboard/UserDashboard';
import UserWalletManagement from './Finance/Admin/Wallet/Wallet';
import UserPayment from './Finance/User/UserPayment/UserPayment';  // User gets payment form
import RequestRefund from './Finance/User/RequestRefund/RequestRefund';  // User gets refund form

import './FinancePanel.css';

const FinancePanel = ({ setCurrentPage }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  const renderActiveSection = () => {
    if (isAdmin) {
      // Admin sections (now uses former user components)
      switch (activeSection) {
        case 'dashboard':
          return <FinanceDashboard setActiveSection={setActiveSection} />;
        case 'wallet':
          return <UserWalletManagement />;
        case 'payment':
          return <AdminPayment />;
        case 'refund':
          return <AdminRefundRequest />;
        case 'fines':
          return <AdminFines />;
        case 'reports':
          return <AdminTransactions />;
        default:
          return <FinanceDashboard setActiveSection={setActiveSection} />;
      }
    } else {
      // User sections (now uses former admin components)
      switch (activeSection) {
        case 'dashboard':
          return <UserDashboard setActiveSection={setActiveSection} />;
        case 'payment':
          return <UserPayment />;
        case 'refund':
          return <RequestRefund />;
        default:
          return <UserDashboard setActiveSection={setActiveSection} />;
      }
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="finance-panel-layout" style={{ marginTop: '80px' }}>
        <FinanceSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isAdmin={isAdmin}
        />
        <div className="finance-main-content" style={{ marginLeft: '250px', padding: '20px' }}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default FinancePanel;
