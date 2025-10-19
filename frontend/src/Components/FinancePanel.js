import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import FinanceSidebar from './Finance/FinanceSidebar';

// Admin Components
import FinanceDashboard from './Finance/Admin/FinanceDashboard/FinanceDashboard';
import Wallet from './Finance/Admin/Wallet/Wallet';
import Payment from './Finance/Admin/Payment/Payment';
import RefundRequest from './Finance/Admin/RefundRequest/RefundRequest';
import FinesAdmin from './Finance/Admin/FinesAdmin/FinesAdmin';
import Reports from './Finance/Admin/Reports/Reports';

// User Components
import UserDashboard from './Finance/User/UserDashboard/UserDashboard';
import UserWalletManagement from './Finance/User/UserWalletManagement/UserWalletManagement';
import UserPayment from './Finance/User/UserPayment/UserPayment';
import RequestRefund from './Finance/User/RequestRefund/RequestRefund';
import UserFines from './Finance/User/UserFines/UserFines';
import UserTransactions from './Finance/User/UserTransactions/UserTransactions';

import './FinancePanel.css';

const FinancePanel = ({ setCurrentPage }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  const renderActiveSection = () => {
    if (isAdmin) {
      // Admin sections
      switch (activeSection) {
        case 'dashboard':
          return <FinanceDashboard />;
        case 'payment':
          return <Payment />;
        case 'refund':
          return <RefundRequest />;
        case 'fines':
          return <FinesAdmin />;
        case 'reports':
          return <Reports />;
        default:
          return <FinanceDashboard />;
      }
    } else {
      // User sections
      switch (activeSection) {
        case 'dashboard':
          return <UserDashboard setActiveSection={setActiveSection} />;
        case 'wallet':
          return <UserWalletManagement />;
        case 'payment':
          return <UserPayment />;
        case 'refund':
          return <RequestRefund />;
        case 'fines':
          return <UserFines />;
        case 'reports':
          return <UserTransactions />;
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
