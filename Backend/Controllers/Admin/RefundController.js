const Refund = require("../../Model/RefundModel");
const Wallet = require("../../Model/WalletModel");
const Payment = require("../../Model/AdminPaymentModel");
const Notification = require("../../Model/NotificationModel");

// Create refund request (user)
const createRefundRequest = async (req, res) => {
  try {
    const { paymentId, buyerId, giverId, description } = req.body;
    if (!paymentId || !buyerId || !description) {
      return res.status(400).json({ message: "Payment ID, Buyer ID, and Description are required" });
    }

    const refund = new Refund({ paymentId, buyerId, giverId, description });
    await refund.save();

    // ✅ Create admin notification
    await new Notification({
      type: "REFUND",
      message: `New refund request submitted by Buyer ${buyerId}. Approve or reject it.`,
      referenceId: refund._id
    }).save();

    res.status(201).json({ message: "Refund request submitted successfully", refund });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all refund requests (admin)
const getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find().sort({ requestDate: -1 });
    res.status(200).json({ refunds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve refund (wallet updates)
const approveRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const refund = await Refund.findById(id);
    if (!refund) return res.status(404).json({ message: "Refund request not found" });
    if (refund.status === "APPROVED") return res.status(400).json({ message: "Refund already approved" });

    const payment = await Payment.findOne({ paymentId: refund.paymentId });
    if (!payment) return res.status(404).json({ message: "Original payment not found" });

    const refundAmount = payment.amount;

    // Buyer wallet → credit full amount
    let buyerWallet = await Wallet.findOne({ userId: refund.buyerId, type: "user" });
    if (!buyerWallet) buyerWallet = new Wallet({ userId: refund.buyerId, type: "user", balance: 0 });
    buyerWallet.balance += refundAmount;
    await buyerWallet.save();

    // Giver wallet → debit 90%
    let giverWallet = await Wallet.findOne({ userId: refund.giverId, type: "user" });
    if (!giverWallet) giverWallet = new Wallet({ userId: refund.giverId, type: "user", balance: 0 });
    giverWallet.balance -= refundAmount * 0.9;
    if (giverWallet.balance < 0) giverWallet.balance = 0;
    await giverWallet.save();

    // System wallet → debit 10%
    let systemWallet = await Wallet.findOne({ type: "system" });
    if (!systemWallet) systemWallet = new Wallet({ userId: "SYSTEM", type: "system", balance: 0 });
    systemWallet.balance -= refundAmount * 0.1;
    if (systemWallet.balance < 0) systemWallet.balance = 0;
    await systemWallet.save();

    refund.status = "APPROVED";
    await refund.save();

    res.status(200).json({
      message: "Refund approved and wallets updated",
      refund,
      buyerWallet,
      giverWallet,
      systemWallet,
      buyerRefunded: refundAmount,
      giverDeducted: refundAmount * 0.9,
      systemDeducted: refundAmount * 0.1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject refund (no wallet changes)
const rejectRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const refund = await Refund.findByIdAndUpdate(id, { status: "REJECTED" }, { new: true });
    if (!refund) return res.status(404).json({ message: "Refund request not found" });
    res.status(200).json({ message: "Refund rejected", refund });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete refund request
const deleteRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const refund = await Refund.findByIdAndDelete(id);
    if (!refund) return res.status(404).json({ message: "Refund request not found" });
    res.status(200).json({ message: "Refund request deleted", refund });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get refunds by user ID
const getRefundsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const refunds = await Refund.find({ buyerId: userId }).sort({ requestDate: -1 });
    res.status(200).json({ refunds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRefundRequest,
  getAllRefunds,
  approveRefund,
  rejectRefund,
  deleteRefund,
  getRefundsByUser
};
