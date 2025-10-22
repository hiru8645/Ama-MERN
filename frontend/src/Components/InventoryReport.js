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
  const borrowReturns = []; // Mock data for now

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(""), 3000);
  };

  const getLowStockBooks = () => {
    return products.filter(product => (product.stockCurrent || 0) < 10);
  };

  const getStockDistributionData = () => {
    const availableBooks = products.reduce((sum, p) => sum + (p.stockCurrent || 0), 0);
    const totalBooks = products.reduce((sum, p) => sum + (p.stockTotal || 0), 0);
    const borrowedBooks = totalBooks - availableBooks;

    return [
      { name: 'Available', value: availableBooks, color: '#3498db' },
      { name: 'Borrowed', value: borrowedBooks, color: '#e74c3c' }
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

  // PDF Generation Function - Clean Implementation
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Calculate stats first
    const stats = {
      totalBooksInSystem: products.reduce((sum, product) => sum + (product.stockTotal || 0), 0),
      availableBooks: products.reduce((sum, product) => sum + (product.stockCurrent || 0), 0),
      borrowedBooks: borrowReturns.filter(b => b.status === 'borrowed').length || 2
    };

    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    // ===== PAGE 1: DATA TABLES =====
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INVENTORY REPORT", pageWidth / 2, 20, { align: "center" });
    
    // Date
    doc.setFontSize(12);
    doc.text(reportDate, pageWidth / 2, 30, { align: "center" });
    
    // A. Book Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("A. Book Summary", 15, 45);
    
    // Table border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 50, 180, 40);
    
    // Table headers with background
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 50, 180, 8, 'F');
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Book ID", 15, 56);
    doc.text("Title", 45, 56);
    doc.text("Available", 105, 56);
    doc.text("Borrowed", 135, 56);
    doc.text("Status", 165, 56);
    
    // Header bottom line
    doc.line(10, 58, 190, 58);
    
    // Vertical lines
    doc.line(40, 50, 40, 90);
    doc.line(100, 50, 100, 90);
    doc.line(130, 50, 130, 90);
    doc.line(160, 50, 160, 90);
    
    // Table data - top 4 products
    doc.setFont("helvetica", "normal");
    const topBooks = products.slice(0, 4);
    topBooks.forEach((product, index) => {
      const y = 66 + (index * 8);
      const bookId = `B00${index + 1}`;
      const available = product.stockCurrent || 0;
      const borrowed = (product.stockTotal || 0) - available;
      const status = available > 10 ? "Available" : available > 5 ? "Low Stock" : "Out of Stock";
      
      doc.text(bookId, 15, y);
      doc.text(product.name?.substring(0, 18) || "N/A", 45, y);
      doc.text(available.toString(), 110, y);
      doc.text(borrowed.toString(), 140, y);
      doc.text(status, 165, y);
      
      if (index < topBooks.length - 1) {
        doc.line(10, y + 2, 190, y + 2);
      }
    });
    
    // B. Borrow/Return Overview
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("B. Borrow/Return Overview", 15, 110);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const borrowedCount = borrowReturns.filter(b => b.status === 'borrowed').length;
    const returnedCount = borrowReturns.filter(b => b.status === 'returned').length;
    const overdueCount = borrowReturns.filter(b => b.status === 'overdue').length;
    
    doc.text(`Total Books Borrowed: ${borrowedCount}`, 15, 125);
    doc.text(`Total Books Returned: ${returnedCount}`, 15, 135);
    doc.text(`Currently Borrowed: ${borrowedCount}`, 15, 145);
    doc.text(`Overdue Books: ${overdueCount}`, 15, 155);
    
    // C. Low Stock Books
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("C. Low Stock Books", 15, 175);
    
    const lowStockItems = getLowStockBooks().slice(0, 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    lowStockItems.forEach((book, index) => {
      doc.text(`${book.name?.substring(0, 30) || "N/A"}: ${book.stockCurrent || 0}`, 15, 185 + (index * 10));
    });
    
    // D. Notifications
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("D. Notifications Sent", 15, 215);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Overdue reminders sent: 2`, 15, 225);
    
    // E. Summary Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("E. Summary", 15, 245);
    
    // Summary table border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 250, 180, 40);
    
    // Table headers with background
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 250, 180, 8, 'F');
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Metric", 15, 256);
    doc.text("Count", 150, 256);
    
    // Header line
    doc.line(10, 258, 190, 258);
    doc.line(140, 250, 140, 290);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Total Books in System`, 15, 266);
    doc.text(`${stats.totalBooksInSystem}`, 155, 266);
    doc.line(10, 268, 190, 268);
    
    doc.text(`Available Books`, 15, 276);
    doc.text(`${stats.availableBooks}`, 155, 276);
    doc.line(10, 278, 190, 278);
    
    doc.text(`Borrowed Books`, 15, 286);
    doc.text(`${stats.borrowedBooks}`, 155, 286);
    
    // Page 1 Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Page 1 of 2", pageWidth / 2, 300, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, 308, { align: "center" });
    
    // ===== PAGE 2: CHARTS AND ANALYTICS =====
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    
    // Page 2 Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INVENTORY ANALYTICS & CHARTS", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(reportDate, pageWidth / 2, 30, { align: "center" });
    
    // Decorative line
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(1);
    doc.line(50, 35, pageWidth - 50, 35);
    
    const chartsStartY = 50;
    
    // Page 2 Content Organization
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("VISUAL ANALYTICS DASHBOARD", 15, chartsStartY);
    
    // Section divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, chartsStartY + 5, pageWidth - 15, chartsStartY + 5);
    
    // Section 1: Stock Distribution Analysis
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. STOCK DISTRIBUTION ANALYSIS", 15, chartsStartY + 20);
    
    // Clean Stock Distribution Chart
    const chartX = 40;
    const chartY = chartsStartY + 50;
    const chartRadius = 20;
    
    const availableBooks = stats.availableBooks || 0;
    const borrowedBooks = stats.borrowedBooks || 0;
    const totalBooks = availableBooks + borrowedBooks;
    
    if (totalBooks > 0) {
      const availablePercentage = (availableBooks / totalBooks) * 100;
      const borrowedPercentage = (borrowedBooks / totalBooks) * 100;
      
      // Main chart circle
      doc.setDrawColor(150, 150, 150);
      doc.setFillColor(240, 240, 240);
      doc.setLineWidth(1);
      doc.circle(chartX, chartY, chartRadius, 'FD');
      
      // Available books (larger blue circle)
      doc.setFillColor(52, 152, 219);
      doc.circle(chartX, chartY, chartRadius - 2, 'F');
      
      // Borrowed books (smaller red circle overlay)
      if (borrowedBooks > 0) {
        const borrowedSize = Math.max(5, (borrowedPercentage / 100) * chartRadius);
        doc.setFillColor(231, 76, 60);
        doc.circle(chartX + 6, chartY - 6, borrowedSize, 'F');
      }
      
      // Center percentage label
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(`${availablePercentage.toFixed(0)}%`, chartX - 6, chartY + 2);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.text(`Available`, chartX - 12, chartY + 15);
      
      // Legend
      const legendX = 80;
      const legendY = chartY - 15;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(52, 152, 219);
      doc.text(`● Available Books: ${availableBooks} (${availablePercentage.toFixed(1)}%)`, legendX, legendY);
      
      doc.setTextColor(231, 76, 60);
      doc.text(`● Borrowed Books: ${borrowedBooks} (${borrowedPercentage.toFixed(1)}%)`, legendX, legendY + 12);
      
      // Insights
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Total Books in Circulation: ${totalBooks}`, legendX, legendY + 28);
      const utilizationRate = (borrowedBooks / totalBooks * 100).toFixed(1);
      doc.text(`Library Utilization Rate: ${utilizationRate}%`, legendX, legendY + 40);
      
      doc.setTextColor(0, 0, 0);
    }
    
    // Section 2: Inventory Status & Alerts (moved up from section 3)
    const alertsStartY = chartsStartY + 120;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2. INVENTORY STATUS & ALERTS", 15, alertsStartY);
    
    const lowStockAlert = getLowStockBooks();
    const lowStockCount = lowStockAlert.length;
    
    // Dashboard container
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(247, 248, 249);
    doc.setLineWidth(0.5);
    doc.rect(15, alertsStartY + 15, 175, 50, 'FD');
    
    const alertBoxX = 25;
    const alertBoxY = alertsStartY + 25;
    
    // Alert status box
    if (lowStockCount > 0) {
      // Red alert
      doc.setDrawColor(231, 76, 60);
      doc.setFillColor(255, 240, 240);
      doc.setLineWidth(1.5);
      doc.rect(alertBoxX, alertBoxY, 75, 30, 'FD');
      
      // Alert circle
      doc.setFillColor(231, 76, 60);
      doc.circle(alertBoxX + 15, alertBoxY + 15, 8, 'F');
      
      // Count
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(lowStockCount.toString(), alertBoxX + (lowStockCount > 9 ? 11 : 13), alertBoxY + 18);
      
      // Alert text
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(231, 76, 60);
      doc.text("Low Stock Alert", alertBoxX + 27, alertBoxY + 10);
      doc.setFontSize(7);
      doc.text("Items need restocking", alertBoxX + 27, alertBoxY + 20);
    } else {
      // Green status
      doc.setDrawColor(46, 204, 113);
      doc.setFillColor(240, 255, 240);
      doc.setLineWidth(1.5);
      doc.rect(alertBoxX, alertBoxY, 75, 30, 'FD');
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(46, 204, 113);
      doc.text("Stock Levels OK", alertBoxX + 5, alertBoxY + 18);
    }
    
    // Quick stats box
    const statsBoxX = 110;
    doc.setDrawColor(52, 152, 219);
    doc.setFillColor(240, 248, 255);
    doc.rect(statsBoxX, alertBoxY, 70, 30, 'FD');
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 152, 219);
    doc.text("Quick Statistics", statsBoxX + 5, alertBoxY + 10);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Products: ${products.length}`, statsBoxX + 5, alertBoxY + 19);
    doc.text(`Total Suppliers: ${suppliers.length}`, statsBoxX + 5, alertBoxY + 26);
    
    // Page 2 Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Page 2 of 2", pageWidth / 2, alertsStartY + 100, { align: "center" });
    doc.text("End of Report - Generated by Inventory Management System", pageWidth / 2, alertsStartY + 110, { align: "center" });
    
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
                <th>Borrowed</th>
                <th>Total Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map((product, index) => {
                const bookId = `B00${index + 1}`;
                const available = product.stockCurrent || 0;
                const total = product.stockTotal || 0;
                const borrowed = total - available;
                const status = available > 10 ? "In Stock" : available > 5 ? "Low Stock" : "Out of Stock";
                const statusClass = available > 10 ? "status-good" : available > 5 ? "status-warning" : "status-danger";

                return (
                  <tr key={product._id || index}>
                    <td>{bookId}</td>
                    <td>{product.name || "N/A"}</td>
                    <td>{product.category || "General"}</td>
                    <td>{available}</td>
                    <td>{borrowed}</td>
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
            <h4>Stock Distribution</h4>
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

      {/* E. Summary Statistics */}
      <div className="report-section">
        <h3>📋 E. Summary Statistics</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-title">Total Books in System</div>
            <div className="summary-value">{reportStats.totalBooksInSystem}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Available Books</div>
            <div className="summary-value">{reportStats.availableBooks}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Books in Circulation</div>
            <div className="summary-value">{reportStats.currentlyBorrowed}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Total Categories</div>
            <div className="summary-value">{getCategoryDistributionData().length}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Total Suppliers</div>
            <div className="summary-value">{suppliers.length}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Low Stock Items</div>
            <div className="summary-value">{reportStats.lowStockCount}</div>
          </div>
        </div>
      </div>

      {/* F. System Information */}
      <div className="report-section">
        <h3>🔧 F. System Information</h3>
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