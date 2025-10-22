import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./UserTransactions.css";

function UserTransactions() {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ date: "" });
  const [error, setError] = useState("");

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/payments");
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payments.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments by selected date
  const filteredPayments = payments.filter((p) => {
    if (!filters.date) return true;
    return new Date(p.date).toISOString().slice(0, 10) === filters.date;
  });

  // Export CSV
  const exportToCSV = () => {
    if (filteredPayments.length === 0) return;

    const headers = [
      "Payment ID",
      "Code ID",
      "Buyer ID",
      "Giver ID",
      "Book ID",
      "Amount",
      "Status",
    ];
    const rows = filteredPayments.map((p) => [
      p.paymentId,
      p.codeId,
      p.buyerId,
      p.giverId,
      p.bookId,
      p.amount.toFixed(2),
      p.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Payments_Report_${filters.date || "all"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const exportToPDF = () => {
    if (filteredPayments.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Page border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Header
    const generatedDate = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("📚 Book Exchange Platform", 14, 15);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${generatedDate}`, pageWidth - 14, 15, { align: "right" });

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Payments Report", pageWidth / 2, 30, { align: "center" });

    // Description
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `This report contains payment transactions for ${filters.date || "all dates"}.`,
      pageWidth / 2,
      40,
      { align: "center" }
    );

    // Table
    const columns = [
      "Payment ID",
      "Code ID",
      "Buyer ID",
      "Giver ID",
      "Book ID",
      "Amount (Rs)",
      "Status",
    ];
    const rows = filteredPayments.map((p) => [
      p.paymentId,
      p.codeId,
      p.buyerId,
      p.giverId,
      p.bookId,
      p.amount.toFixed(2),
      p.status,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 55,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 123, 255], fontStyle: "bold", halign: "center" },
      bodyStyles: { halign: "center" },
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 25 },
        2: { cellWidth: 28 },
        3: { cellWidth: 28 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 22 },
      },
    });

    // Summary (simplified: only total payments and amount)
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalPayments = filteredPayments.length;
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, finalY);

    doc.setFont("helvetica", "normal");
    doc.text(`Total Payments: ${totalPayments}`, 14, finalY + 8);
    doc.text(`Total Amount: Rs. ${totalAmount.toFixed(2)}`, 14, finalY + 16);

    // Footer (page numbers)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    doc.save(`Payments_Report_${filters.date || "all"}.pdf`);
  };

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <h2>� Payments Report</h2>

        {/* Date Filter */}
        <div className="transaction-filters">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <button onClick={exportToCSV} disabled={filteredPayments.length === 0}>
            Export CSV
          </button>
          <button onClick={exportToPDF} disabled={filteredPayments.length === 0}>
            Export PDF
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {filteredPayments.length === 0 ? (
          <p className="empty">No payments found for this date.</p>
        ) : (
          <div className="transaction-list">
            {filteredPayments.map((p) => (
              <div key={p._id} className="transaction-card">
                <p><strong>Payment ID:</strong> {p.paymentId}</p>
                <p><strong>Code ID:</strong> {p.codeId}</p>
                <p><strong>Buyer ID:</strong> {p.buyerId}</p>
                <p><strong>Giver ID:</strong> {p.giverId}</p>
                <p><strong>Book ID:</strong> {p.bookId}</p>
                <p><strong>Amount:</strong> Rs. {p.amount.toFixed(2)}</p>
                <p><strong>Status:</strong> {p.status}</p>
                <p><strong>Date:</strong> {new Date(p.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserTransactions;
