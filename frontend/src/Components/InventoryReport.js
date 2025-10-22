import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import "./Report.css";

// API URLs for different modules
const API_ENDPOINTS = {
  products: "http://localhost:5001/api/products",
  inventory: "http://localhost:5001/api/inventory",
  suppliers: "http://localhost:5001/api/suppliers",
  users: "http://localhost:5001/api/users",
  orders: "http://localhost:5001/api/orders"
};

const InventoryReport = () => {
  const [reportData, setReportData] = useState({
    products: [],
    inventory: [],
    suppliers: [],
    borrowedBooks: [],
    returnedBooks: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notification, setNotification] = useState("");

  // Helper function to fetch data from APIs
  const fetchFromAPI = async (url) => {
    try {
      console.log(`🔄 Fetching data from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(`✅ Data received from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching from ${url}:`, error);
      return [];
    }
  };

  // Load all data from different APIs
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🚀 Starting data load from all APIs...");

      const [products, inventory, suppliers, , orders] = await Promise.all([
        fetchFromAPI(API_ENDPOINTS.products),
        fetchFromAPI(API_ENDPOINTS.inventory),
        fetchFromAPI(API_ENDPOINTS.suppliers),
        fetchFromAPI(API_ENDPOINTS.users),
        fetchFromAPI(API_ENDPOINTS.orders)
      ]);

      setReportData({
        products: Array.isArray(products) ? products : [],
        inventory: Array.isArray(inventory) ? inventory : [],
        suppliers: Array.isArray(suppliers) ? suppliers : [],
        borrowedBooks: [],
        returnedBooks: [],
        orders: Array.isArray(orders) ? orders : []
      });

      setLastUpdated(new Date());
      console.log("✅ All data loaded successfully");
      
    } catch (error) {
      console.error("❌ Error loading data:", error);
      showNotification("Error loading report data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    
    // Auto-refresh every 30 seconds
    const autoRefreshInterval = setInterval(() => {
      console.log("📊 Auto-refreshing report data...");
      loadAllData();
    }, 30000);
    
    return () => clearInterval(autoRefreshInterval);
  }, [loadAllData]);

  // Helper functions for calculations
  const { products, suppliers, orders } = reportData;

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(""), 3000);
  };

  const getLowStockBooks = () => {
    return products.filter(product => (product.stockCurrent || 0) < 10);
  };

  const getStockDistributionData = () => {
    // Get available counts for the two specific book types
    const dataStructuresBook = products.find(p => p.name && p.name.toLowerCase().includes('data structures'));
    const agileDevBook = products.find(p => p.name && p.name.toLowerCase().includes('agile development'));
    
    const dataStructuresAvailable = dataStructuresBook ? (dataStructuresBook.stockCurrent || 0) : 0;
    const agileDevAvailable = agileDevBook ? (agileDevBook.stockCurrent || 0) : 0;

    return [
      { name: 'Data Structures', value: dataStructuresAvailable, color: '#3498db' },
      { name: 'Agile Development', value: agileDevAvailable, color: '#2ecc71' }
    ];
  };

  const getCategoryDistributionData = () => {
    const categoryCount = {};
    products.forEach(product => {
      const category = product.category || 'Computer Science';
      categoryCount[category] = (categoryCount[category] || 0) + (product.stockTotal || 0);
    });

    return Object.entries(categoryCount).map(([category, totalBooks]) => ({
      name: category,
      totalBooks
    }));
  };

  // PDF Generation Function - Restructured Layout
  const generatePDFReport = () => {
    // Calculate stats first (same as web interface)
    const currentBorrowedBooks = borrowedBooks.filter(b => !returnedBooks.find(r => r.id === b.id)).length;
    const pdfStats = {
      totalBooksInSystem: products.reduce((sum, p) => sum + (p.stockTotal || 0), 0),
      availableBooks: products.reduce((sum, p) => sum + (p.stockCurrent || 0), 0),
      totalBorrowed: borrowedBooks.length,
      totalReturned: returnedBooks.length,
      currentlyBorrowed: currentBorrowedBooks,
      overdueBooks: borrowedBooks.filter(book => {
        const borrowDate = new Date(book.borrowDate);
        const dueDate = new Date(borrowDate.getTime() + (book.borrowDays * 24 * 60 * 60 * 1000));
        return new Date() > dueDate && !returnedBooks.find(r => r.id === book.id);
      }).length,
      lowStockCount: getLowStockBooks().length
    };

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    // ===== PAGE 1: SECTIONS A, B, C =====
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INVENTORY REPORT", pageWidth / 2, 20, { align: "center" });
    
    // Date
    doc.setFontSize(12);
    doc.text(reportDate, pageWidth / 2, 30, { align: "center" });
    
    // A. Book Summary (Table)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("A. Book Summary", 15, 50);
    
    // Table headers
    const tableStartY = 65;
    const rowHeight = 12;
    const colPositions = [15, 40, 110, 135, 160];
    
    // Header row
    doc.setFillColor(52, 152, 219);
    doc.setTextColor(255, 255, 255);
    doc.rect(15, tableStartY - 8, 175, rowHeight, 'F');
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Book ID", colPositions[0] + 2, tableStartY - 2);
    doc.text("Title", colPositions[1] + 2, tableStartY - 2);
    doc.text("Available", colPositions[2] + 2, tableStartY - 2);
    doc.text("Total", colPositions[3] + 2, tableStartY - 2);
    doc.text("Status", colPositions[4] + 2, tableStartY - 2);
    
    // Table data rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    
    const topBooks = products.slice(0, 5);
    topBooks.forEach((product, index) => {
      const y = tableStartY + 4 + (index * rowHeight);
      const bookId = product.code || `B00${index + 1}`;
      const available = product.stockCurrent || 0;
      const total = product.stockTotal || 0;
      
      // Status calculation
      let status;
      if (available === 0) {
        status = "Out of Stock";
      } else if (available <= 3) {
        status = "Low Stock";
      } else {
        status = "Available";
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(15, y - 6, 175, rowHeight, 'F');
      }
      
      // Table data
      doc.text(bookId, colPositions[0] + 2, y);
      doc.text(product.name?.substring(0, 25) || "N/A", colPositions[1] + 2, y);
      doc.text(available.toString(), colPositions[2] + 2, y);
      doc.text(total.toString(), colPositions[3] + 2, y);
      doc.text(status, colPositions[4] + 2, y);
    });
    
    // Table border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(15, tableStartY - 8, 175, rowHeight * (topBooks.length + 1));
    
    // B. Borrow/Return Overview
    const sectionBY = 150;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("B. Borrow/Return Overview", 15, sectionBY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`• Total Books Borrowed: ${pdfStats.totalBorrowed}`, 20, sectionBY + 15);
    doc.text(`• Total Books Returned: ${pdfStats.totalReturned}`, 20, sectionBY + 25);
    doc.text(`• Currently Borrowed: ${pdfStats.currentlyBorrowed}`, 20, sectionBY + 35);
    doc.text(`• Overdue Books: ${pdfStats.overdueBooks}`, 20, sectionBY + 45);
    
    // C. Low Stock Alert
    const sectionCY = 210;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("C. Low Stock Alert", 15, sectionCY);
    
    const lowStockItems = getLowStockBooks().slice(0, 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (lowStockItems.length > 0) {
      lowStockItems.forEach((book, index) => {
        doc.text(`• ${book.name?.substring(0, 40) || "N/A"} - Stock: ${book.stockCurrent || 0}`, 20, sectionCY + 15 + (index * 10));
      });
    } else {
      doc.text("✓ All books have adequate stock levels", 20, sectionCY + 15);
    }
    
    // Page 1 Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Page 1 of 2", pageWidth / 2, 280, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, 288, { align: "center" });
    
    // ===== PAGE 2: SECTIONS D, E =====
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    
    // Page 2 Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INVENTORY ANALYTICS", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(reportDate, pageWidth / 2, 30, { align: "center" });
    
    // D. Visual Analytics
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("D. Visual Analytics", 15, 50);
    
    // Book Types Distribution (Numbers Only)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Book Types Distribution", 20, 75);
    
    // Get available counts for the two specific book types
    const dataStructuresBook = products.find(p => p.name && p.name.toLowerCase().includes('data structures'));
    const agileDevBook = products.find(p => p.name && p.name.toLowerCase().includes('agile development'));
    
    const dataStructuresCount = dataStructuresBook ? (dataStructuresBook.stockCurrent || 0) : 0;
    const agileDevCount = agileDevBook ? (agileDevBook.stockCurrent || 0) : 0;
    const totalBooksShown = dataStructuresCount + agileDevCount;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`• Data Structures Available: ${dataStructuresCount} books`, 25, 90);
    doc.text(`• Agile Development Available: ${agileDevCount} books`, 25, 100);
    if (totalBooksShown > 0) {
      const dsPercentage = ((dataStructuresCount / totalBooksShown) * 100).toFixed(1);
      const agilePercentage = ((agileDevCount / totalBooksShown) * 100).toFixed(1);
      doc.text(`• Data Structures: ${dsPercentage}% of available books`, 25, 110);
      doc.text(`• Agile Development: ${agilePercentage}% of available books`, 25, 120);
    }
    
    // Category Distribution (Numbers Only)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Category Distribution", 20, 145);
    
    const categoryData = getCategoryDistributionData().slice(0, 3);
    const totalCategoryBooks = categoryData.reduce((sum, cat) => sum + cat.totalBooks, 0);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (categoryData.length > 0) {
      categoryData.forEach((cat, index) => {
        const percentage = totalCategoryBooks > 0 ? ((cat.totalBooks / totalCategoryBooks) * 100).toFixed(1) : 0;
        doc.text(`• ${cat.name}: ${cat.totalBooks} books (${percentage}%)`, 25, 160 + (index * 10));
      });
    } else {
      doc.text("• No category data available", 25, 160);
    }
    
    // Summary statistics with book type breakdown
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const totalSystemBooks = pdfStats.totalBooksInSystem;
    doc.text(`Total Books in System: ${totalSystemBooks} | Data Structures: ${dataStructuresCount} | Agile Development: ${agileDevCount}`, 20, 140);
    
    // E. System Information
    const sectionEY = 170;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("E. System Information", 15, sectionEY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`• Total Products in System: ${products.length}`, 20, sectionEY + 15);
    doc.text(`• Total Orders Processed: ${orders.length}`, 20, sectionEY + 25);
    doc.text(`• Total Suppliers: ${suppliers.length}`, 20, sectionEY + 35);
    doc.text(`• Report Generated: ${new Date().toLocaleString()}`, 20, sectionEY + 45);
    doc.text(`• Auto-Refresh: Every 30 seconds`, 20, sectionEY + 55);
    doc.text(`• Last Updated: ${lastUpdated.toLocaleString()}`, 20, sectionEY + 65);
    
    // System Summary Box
    doc.setDrawColor(52, 152, 219);
    doc.setFillColor(240, 248, 255);
    doc.setLineWidth(1);
    doc.rect(15, sectionEY + 75, 170, 35, 'FD');
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 152, 219);
    doc.text("System Status Summary", 20, sectionEY + 85);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const systemHealth = lowStockItems.length === 0 ? "Excellent" : lowStockItems.length <= 2 ? "Good" : "Needs Attention";
    doc.text(`• System Health: ${systemHealth}`, 20, sectionEY + 95);
    doc.text(`• Low Stock Items: ${getLowStockBooks().length}`, 20, sectionEY + 103);
    
    // Page 2 Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Page 2 of 2", pageWidth / 2, 270, { align: "center" });
    doc.text("End of Report - Generated by Inventory Management System", pageWidth / 2, 280, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    
    // Save PDF
    doc.save(`Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification("PDF Report generated successfully with clean charts!", "success");
  };

  // Force refresh function
  const handleRefresh = () => {
    showNotification("🔄 Refreshing report data...", "info");
    loadAllData();
  };

  if (loading) {
    return (
      <div className="report-page">
        <div className="loading-spinner">
          <h2>📊 Loading Inventory Report...</h2>
          <p>Fetching data from all modules...</p>
        </div>
      </div>
    );
  }

  // Get borrow/return data from localStorage  
  const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
  const returnedBooks = JSON.parse(localStorage.getItem('returnedBooks') || '[]');

  // Helper function to get accurate status based on actual data
  const getBookStatus = (product) => {
    const available = product.stockCurrent || 0;
    
    if (available === 0) return { status: "Out of Stock", class: "status-danger" };
    if (available <= 3) return { status: "Critical Stock", class: "status-danger" };
    if (available <= 5) return { status: "Low Stock", class: "status-warning" };
    return { status: "In Stock", class: "status-good" };
  };
  
  // Calculate comprehensive stats
  const reportStats = {
    totalBooksInSystem: products.reduce((sum, p) => sum + (p.stockTotal || 0), 0),
    availableBooks: products.reduce((sum, p) => sum + (p.stockCurrent || 0), 0),
    totalBorrowed: borrowedBooks.length,
    totalReturned: returnedBooks.length,
    currentlyBorrowed: borrowedBooks.filter(b => !returnedBooks.find(r => r.id === b.id)).length,
    overdueBooks: borrowedBooks.filter(book => {
      const borrowDate = new Date(book.borrowDate);
      const dueDate = new Date(borrowDate.getTime() + (book.borrowDays * 24 * 60 * 60 * 1000));
      return new Date() > dueDate && !returnedBooks.find(r => r.id === book.id);
    }).length,
    lowStockCount: getLowStockBooks().length
  };

  return (
    <div className="inventory-report-container">
      {notification && (
        <div className={`notification ${notification.type || 'info'}`}>
          {notification.message || notification}
        </div>
      )}

      <div className="report-header">
        <h2>� Inventory Management Reports</h2>
        <div className="report-actions">
          <button onClick={handleRefresh} className="btn-refresh">
            🔄 Refresh Data
          </button>
          <button onClick={generatePDFReport} className="btn-generate-pdf">
            📄 Generate PDF Report
          </button>
        </div>
        <div className="last-updated">
          Last Updated: {lastUpdated.toLocaleString()}
        </div>
      </div>

      {/* A. Book Summary Section */}
      <div className="report-section">
        <h3>📚 A. Book Summary</h3>
        <div className="book-summary-table">
          <table>
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Available</th>
                <th>Total Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map((product, index) => {
                const bookId = product.code || `B00${index + 1}`;
                const available = product.stockCurrent || 0;
                const total = product.stockTotal || 0;
                const { status, class: statusClass } = getBookStatus(product);

                return (
                  <tr key={product._id || index}>
                    <td>{bookId}</td>
                    <td>{product.name || "N/A"}</td>
                    <td>{product.category || "General"}</td>
                    <td>{available}</td>
                    <td>{total}</td>
                    <td><span className={`status-badge ${statusClass}`}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* B. Borrow/Return Overview */}
      <div className="report-section">
        <h3>📖 B. Borrow/Return Overview</h3>
        <div className="overview-stats">
          <div className="overview-grid">
            <div className="stat-box">
              <div className="stat-number">{reportStats.totalBorrowed}</div>
              <div className="stat-label">Total Books Borrowed</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{reportStats.totalReturned}</div>
              <div className="stat-label">Total Books Returned</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{reportStats.currentlyBorrowed}</div>
              <div className="stat-label">Currently Borrowed</div>
            </div>
            <div className="stat-box danger">
              <div className="stat-number">{reportStats.overdueBooks}</div>
              <div className="stat-label">Overdue Books</div>
            </div>
          </div>
        </div>
      </div>

      {/* C. Low Stock Books Alert */}
      <div className="report-section">
        <h3>⚠️ C. Low Stock Books</h3>
        <div className="low-stock-section">
          {getLowStockBooks().length > 0 ? (
            <div className="low-stock-grid">
              {getLowStockBooks().slice(0, 6).map((book, index) => (
                <div key={book._id || index} className="low-stock-card">
                  <div className="book-title">{book.name}</div>
                  <div className="stock-info">
                    <span className="current-stock">{book.stockCurrent || 0}</span>
                    <span className="stock-label">in stock</span>
                  </div>
                  <div className="restock-alert">⚠️ Needs Restocking</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-low-stock">
              ✅ All books have adequate stock levels!
            </div>
          )}
        </div>
      </div>

      {/* D. Visual Analytics */}
      <div className="report-section">
        <h3>📊 D. Visual Analytics</h3>
        <div className="charts-container">
          <div className="chart-card">
            <h4>Book Types Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStockDistributionData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {getStockDistributionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Category Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getCategoryDistributionData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalBooks" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ...E. Summary Statistics section removed... */}

      {/* E. System Information */}
      <div className="report-section">
        <h3>🔧 E. System Information</h3>
        <div className="system-info">
          <div className="info-row">
            <span className="info-label">Total Products:</span>
            <span className="info-value">{products.length}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Orders:</span>
            <span className="info-value">{orders.length}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Report Generated:</span>
            <span className="info-value">{new Date().toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Auto-Refresh:</span>
            <span className="info-value">Every 30 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;