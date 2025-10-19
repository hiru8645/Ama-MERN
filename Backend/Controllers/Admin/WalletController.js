const Wallet = require("../../Model/WalletModel");

// 🔹 Create a wallet (user or system)
const createWallet = async (req, res) => {
  try {
    const { userId, type } = req.body;

    const wallet = new Wallet({
      userId: type === "system" ? null : userId,
      type,
      balance: 0,
    });

    await wallet.save();
    res.status(201).json(wallet);
  } catch (err) {
    res.status(500).json({ message: "Error creating wallet", error: err.message });
  }
};

// 🔹 Get all wallets
const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.status(200).json({ wallets });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wallets", error: err.message });
  }
};

// 🔹 Get wallet by userId
const getWalletByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    let wallet = await Wallet.findOne({ userId: userId.trim(), type: "user" });
    
    // If wallet doesn't exist, create one
    if (!wallet) {
      wallet = new Wallet({
        userId: userId.trim(),
        type: "user",
        balance: 0
      });
      await wallet.save();
    }
    
    res.status(200).json({ wallet });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wallet", error: err.message });
  }
};


// 🔹 Get or create system wallet
const getSystemWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ type: "system" });
    if (!wallet) {
      wallet = new Wallet({ userId: "SYSTEM", type: "system", balance: 0 });
      await wallet.save();
    }
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ message: "Error fetching system wallet", error: err.message });
  }
};

// 🔹 Update user wallet balance (no transactions)
const updateWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ userId: userId.trim(), type: "user" });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({ message: "Wallet updated successfully", wallet });
  } catch (err) {
    res.status(500).json({ message: "Error updating wallet", error: err.message });
  }
};

// 🔹 Update system wallet balance (no transactions)
const updateSystemWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ type: "system" });
    if (!wallet) return res.status(404).json({ message: "System wallet not found" });

    if (wallet.balance + amount < 0) {
      return res.status(400).json({ message: "Insufficient funds in system wallet" });
    }

    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({ message: "System wallet updated successfully", wallet });
  } catch (err) {
    res.status(500).json({ message: "Error updating system wallet", error: err.message });
  }
};

// 🔹 Delete user wallet
const deleteWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOneAndDelete({ userId, type: "user" });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    res.status(200).json({ message: "Wallet deleted successfully", wallet });
  } catch (err) {
    res.status(500).json({ message: "Error deleting wallet", error: err.message });
  }
};

module.exports = {
  createWallet,
  getAllWallets,
  getSystemWallet,
  updateWalletBalance,
  updateSystemWallet,
  deleteWallet,
  getWalletByUserId,
};
