// Controllers/Admin/FinesController.js
const Fine = require("../../Model/FinesModel");
const Payment = require("../../Model/AdminPaymentModel");
const Wallet = require("../../Model/WalletModel");

const FINE_PER_DAY = 100; // Rs per overdue day
const BORROW_DAYS = 14;   // 14 days allowed

// 🔹 Auto Calculate Fines (runs before fetching fines)
const calculateFines = async () => {
  try {
    const payments = await Payment.find({});

    for (const payment of payments) {
      const borrowDate = payment.date;
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

      const today = new Date();
      const overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

      if (overdueDays > 0) {
        const existingFine = await Fine.findOne({
          userId: payment.buyerId,
          bookId: payment.bookId,
          status: { $ne: "PAID" } // only check unpaid
        });

        if (!existingFine) {
          const fine = new Fine({
            userId: payment.buyerId,
            bookId: payment.bookId,
            overdueDays: overdueDays,
            amount: overdueDays * FINE_PER_DAY,
            status: "PENDING"
          });
          await fine.save();
        }
      }
    }
  } catch (err) {
    console.error("Error calculating fines:", err.message);
  }
};

/// Create Fine Manually
const createFine = async (req, res) => {
  try {
    const { userId, bookId, daysOverdue, amount } = req.body;

    if (!userId || !bookId || !daysOverdue || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fine = new Fine({
      userId,
      bookId,
      overdueDays: daysOverdue,   
      amount,
      status: "PENDING"
    });

    await fine.save();
    res.status(201).json({ message: "Fine created successfully", fine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get all fines (admin)
const getAllFines = async (req, res) => {
  try {
    await calculateFines();
    const fines = await Fine.find().sort({ createdAt: -1 });
    res.status(200).json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get fines for a specific user
const getUserFines = async (req, res) => {
  try {
    const { userId } = req.params;
    await calculateFines();
    const fines = await Fine.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Approve Fine (adds amount to system wallet)
const approveFine = async (req, res) => {
  try {
    const { id } = req.params;

    // Find fine first
    const fine = await Fine.findById(id);
    if (!fine) return res.status(404).json({ message: "Fine not found" });

    if (fine.status === "APPROVED") {
      return res.status(400).json({ message: "Fine already approved" });
    }

    // Update fine status
    fine.status = "APPROVED";
    await fine.save();

    // Add fine amount to system wallet
    let systemWallet = await Wallet.findOne({ type: "system" });
    if (!systemWallet) systemWallet = new Wallet({ userId: "SYSTEM", type: "system", balance: 0 });
    systemWallet.balance += fine.amount;
    await systemWallet.save();

    res.json({
      message: "Fine approved and amount added to system wallet",
      fine,
      systemWallet,
      creditedAmount: fine.amount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Reject Fine
const rejectFine = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await Fine.findByIdAndUpdate(id, { status: "REJECTED" }, { new: true });
    if (!fine) return res.status(404).json({ message: "Fine not found" });
    res.json({ message: "Fine rejected", fine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Delete Fine
const deleteFine = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await Fine.findByIdAndDelete(id);
    if (!fine) return res.status(404).json({ message: "Fine not found" });
    res.json({ message: "Fine deleted", fine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Mark as Paid (user action)
const payFine = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await Fine.findByIdAndUpdate(id, { status: "PAID" }, { new: true });
    if (!fine) return res.status(404).json({ message: "Fine not found" });
    res.json({ message: "Fine paid successfully", fine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  calculateFines,
  createFine,
  getAllFines,
  getUserFines,
  approveFine,
  rejectFine,
  deleteFine,
  payFine
};
