const Payment = require("../../Model/AdminPaymentModel");
const Wallet = require("../../Model/WalletModel");
const Notification = require("../../Model/NotificationModel");

// Create new payment (user side form)
const createPayment = async (req, res) => {
  try {
    const { codeId, buyerId, giverId, bookId, amount } = req.body;

    if (!codeId || !buyerId || !giverId || !bookId || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payment = new Payment({ codeId, buyerId, giverId, bookId, amount });
    await payment.save();

    // ✅ Create admin notification
    await new Notification({
      type: "PAYMENT",
      message: `New payment submitted by Buyer ${buyerId}. Approve or reject it.`,
      referenceId: payment._id
    }).save();

    return res.status(201).json({ message: "Payment created successfully", payment });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    return res.status(200).json({ payments });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Approve payment (wallet updates)
const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "PENDING") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    // Buyer wallet deduction
    const buyerWallet = await Wallet.findOne({ userId: payment.buyerId, type: "user" });
    if (!buyerWallet) return res.status(404).json({ message: "Buyer wallet not found" });
    if (buyerWallet.balance < payment.amount) {
      return res.status(400).json({ message: "Insufficient funds in buyer wallet" });
    }
    buyerWallet.balance -= payment.amount;
    await buyerWallet.save();

    // Split amount
    const giverShare = payment.amount * 0.9;
    const systemShare = payment.amount * 0.1;

    // Giver wallet
    let giverWallet = await Wallet.findOne({ userId: payment.giverId, type: "user" });
    if (!giverWallet) {
      giverWallet = new Wallet({ userId: payment.giverId, type: "user", balance: 0 });
    }
    giverWallet.balance += giverShare;
    await giverWallet.save();

    // System wallet
    let systemWallet = await Wallet.findOne({ type: "system" });
    if (!systemWallet) {
      systemWallet = new Wallet({ userId: "SYSTEM", type: "system", balance: 0 });
    }
    systemWallet.balance += systemShare;
    await systemWallet.save();

    // Update payment status
    payment.status = "APPROVED";
    await payment.save();

    res.json({
      message: "Payment approved and wallets updated",
      payment,
      buyerWallet,
      giverWallet,
      systemWallet,
      giverReceived: giverShare,
      systemReceived: systemShare,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject payment
const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "PENDING") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    payment.status = "REJECTED";
    await payment.save();

    res.json({ message: "Payment rejected (no wallet changes)", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payments by specific date (Reports)
const getPaymentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const payments = await Payment.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 });

    if (!payments.length) return res.status(404).json({ message: "No payments found for this date" });

    const totalAmount = payments.reduce((sum, tx) => sum + tx.amount, 0);

    return res.status(200).json({ payments, totalAmount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 🔹 Get all payments (transactions) by Buyer
const getPaymentsByBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const payments = await Payment.find({ buyerId }).sort({ date: -1 });

    if (!payments.length) {
      return res.status(404).json({ message: "No payments found for this buyer" });
    }

    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching buyer payments", error: err.message });
  }
};

// 🔹 Get all payments (transactions) by Giver
const getPaymentsByGiver = async (req, res) => {
  try {
    const { giverId } = req.params;
    const payments = await Payment.find({ giverId }).sort({ date: -1 });

    if (!payments.length) {
      return res.status(404).json({ message: "No payments found for this giver" });
    }

    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching giver payments", error: err.message });
  }
};

// Get all transactions of a user (buyer + giver)
const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const buyerTransactions = await Payment.find({ buyerId: userId }).sort({ date: -1 });
    const giverTransactions = await Payment.find({ giverId: userId }).sort({ date: -1 });

    res.status(200).json({ buyerTransactions, giverTransactions });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user transactions", error: err.message });
  }
};



module.exports = {
  createPayment,
  getAllPayments,
  approvePayment,
  rejectPayment,
  deletePayment,
  getPaymentsByDate,
  getPaymentsByBuyer,
  getPaymentsByGiver,
  getUserTransactions,
};
