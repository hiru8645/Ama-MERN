import React, { useState } from 'react'; 
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';   
import Dashboard from './Components/Dashboard';
import Product from './Components/Product';
import Category from './Components/Category';
import Alerts from './Components/Alerts';
import InventoryReport from './Components/InventoryReport'; // ✅ Import InventoryReport
import BookDescription from './Components/BookDescription';
import Supplier from './Components/Supplier';
import Profile from './Components/Profile'; // ✅ Import Profile
import BorrowReturn from './Components/BorrowReturn';
import InventoryPanel from './Components/InventoryPanel';
import UserPanel from './Components/UserPanel';
import OrderPanel from './Components/OrderPanel';
import FinancePanel from './Components/FinancePanel';
import SupportPanel from './Components/SupportPanel';
import { DashboardProvider } from './contexts/DashboardContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { isInventoryManager } from './utils/roleUtils';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // Default page is Home
  const [selectedBook, setSelectedBook] = useState(null);

  // Create a protected content component that uses auth context
  const ProtectedContent = () => {
    const { user, isLoggedIn } = useAuth();

    const renderPage = () => {
      // Book description page
      if (currentPage === 'bookDescription' && selectedBook) {
        return (
          <BookDescription
            book={selectedBook}
            goBack={() => setCurrentPage('categories')}
          />
        );
      }

      // Render other pages based on currentPage
      switch (currentPage) {
        case 'home':
          return <Home setCurrentPage={setCurrentPage} />;
        case 'dashboard':
          return <Dashboard setCurrentPage={setCurrentPage} />;
        case 'products':
          return <Product setCurrentPage={setCurrentPage} />;
        case 'categories':
          return (
            <Category
              setCurrentPage={setCurrentPage}
              viewBookDescription={(book) => {
                setSelectedBook(book);
                setCurrentPage('bookDescription');
              }}
            />
          );
        case 'alerts':
          return <Alerts setCurrentPage={setCurrentPage} />;
        case 'report': // ✅ New Report page
          return <InventoryReport setCurrentPage={setCurrentPage} />;
        case 'suppliers': 
          return <Supplier setCurrentPage={setCurrentPage} />;
        case 'profile': // ✅ New Profile page
          return <Profile setCurrentPage={setCurrentPage} />;
        case 'borrowReturn':
          return <BorrowReturn setCurrentPage={setCurrentPage} />;
        case 'inventory':
          // Add access control check for inventory panel
          if (!isLoggedIn) {
            alert('Please log in to access the inventory panel.');
            setCurrentPage('home');
            return <Home setCurrentPage={setCurrentPage} />;
          }
          if (!isInventoryManager(user)) {
            alert('Access denied. Only inventory managers can access this panel.');
            setCurrentPage('home');
            return <Home setCurrentPage={setCurrentPage} />;
          }
          return <InventoryPanel setCurrentPage={setCurrentPage} />;
        case 'user':
          return <UserPanel setCurrentPage={setCurrentPage} />;
        case 'order':
          return <OrderPanel setCurrentPage={setCurrentPage} />;
        case 'finance':
          return <FinancePanel setCurrentPage={setCurrentPage} />;
        case 'helpdesk':
          return <SupportPanel setCurrentPage={setCurrentPage} />;
        default:
          return <Home setCurrentPage={setCurrentPage} />;
      }
    };

    return (
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Only show sidebar when not on home page or panel pages that have their own sidebars */}
        {currentPage !== 'home' && 
         currentPage !== 'finance' && 
         currentPage !== 'user' && 
         currentPage !== 'order' && 
         currentPage !== 'profile' && 
         currentPage !== 'helpdesk' && (
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        )}
        <main style={{ 
          flex: 1, 
          padding: (currentPage === 'home' || 
                   currentPage === 'finance' || 
                   currentPage === 'user' || 
                   currentPage === 'order' || 
                   currentPage === 'profile' || 
                   currentPage === 'helpdesk') ? '0' : '20px',
          width: (currentPage === 'home' || 
                 currentPage === 'finance' || 
                 currentPage === 'user' || 
                 currentPage === 'order' || 
                 currentPage === 'profile' || 
                 currentPage === 'helpdesk') ? '100%' : 'calc(100% - 250px)'
        }}>
          {renderPage()}
        </main>
      </div>
    );
  };

  return (
    <AuthProvider>
      <DashboardProvider>
        <InventoryProvider>
          <ProtectedContent />
        </InventoryProvider>
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
