import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Reports.css";

function Reports() {
  const [buyerTransactions, setBuyerTransactions] = useState([]);
  const [giverTransactions, setGiverTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const userId = "IT23650534"; // hardcoded for now

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/payments/user/${userId}`);
        setBuyerTransactions(res.data.buyerTransactions || []);
        setGiverTransactions(res.data.giverTransactions || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 📌 Merge both transactions for report
  const allTransactions = [
    ...buyerTransactions.map((tx) => ({ ...tx, type: "Paid" })),
    ...giverTransactions.map((tx) => ({ ...tx, type: "Received" })),
  ];

  // 📌 Filter by date
  const filteredTransactions = allTransactions.filter((tx) => {
    if (!filterDate) return true;
    return new Date(tx.date).toISOString().slice(0, 10) === filterDate;
  });

  // 📌 CSV Export
  const exportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      "Payment ID",
      "Buyer ID",
      "Giver ID",
      "Book ID",
      "Amount",
      "Status",
      "Type",
      "Date",
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.paymentId,
      tx.buyerId,
      tx.giverId,
      tx.bookId,
      tx.amount.toFixed(2),
      tx.status,
      tx.type,
      new Date(tx.date).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `UserTransactions_${filterDate || "all"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📌 PDF Export
  const exportPDF = () => {
    if (filteredTransactions.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Border
    doc.setDrawColor(0);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(" Book Exchange Platform ", 14, 15);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 15, { align: "right" });

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("My Transactions Report", pageWidth / 2, 30, { align: "center" });

    // Table
    const columns = [
      "Payment ID",
      "Buyer ID",
      "Giver ID",
      "Book ID",
      "Amount (Rs)",
      "Status",
      "Type",
      "Date",
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.paymentId,
      tx.buyerId,
      tx.giverId,
      tx.bookId,
      tx.amount.toFixed(2),
      tx.status,
      tx.type,
      new Date(tx.date).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 45,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 123, 255], fontStyle: "bold", halign: "center" },
      bodyStyles: { halign: "center" },
      theme: "grid",
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    const total = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    doc.setFontSize(12);
    doc.text(`Total Transactions: ${filteredTransactions.length}`, 14, finalY);
    doc.text(`Total Amount: Rs. ${total.toFixed(2)}`, 14, finalY + 8);

    // Footer page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    doc.save(`UserTransactions_${filterDate || "all"}.pdf`);
  };

  if (loading) return <p className="loading">Loading transactions...</p>;

  return (
    <div className="reports-page">
      <div className="reports-container">
        <h2>� My Transactions Report</h2>

        {/* Filters */}
        <div className="report-filters">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button onClick={exportCSV} disabled={filteredTransactions.length === 0}>
            Export CSV
          </button>
          <button onClick={exportPDF} disabled={filteredTransactions.length === 0}>
            Export PDF
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="report-empty">No transactions found for this date.</p>
        ) : (
          <div className="report-list">
            {filteredTransactions.map((tx) => (
              <div key={tx.paymentId} className="report-card">
                <p><strong>Type:</strong> {tx.type}</p>
                <p><strong>Status:</strong> {tx.status}</p>
                <p><strong>Amount:</strong> Rs.{tx.amount}</p>
                <p><strong>Book:</strong> {tx.bookId}</p>
                <p><strong>Buyer:</strong> {tx.buyerId}</p>
                <p><strong>Giver:</strong> {tx.giverId}</p>
                <p><strong>Date:</strong> {new Date(tx.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
