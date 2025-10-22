const express = require("express");
const router = express.Router();
const {
  createWallet,
  getAllWallets,
  updateWalletBalance,
  deleteWallet,
  getSystemWallet,
  updateSystemWallet,
  getWalletByUserId,
} = require("../../Controllers/Admin/WalletController");

// SYSTEM
router.get("/system", getSystemWallet);
router.put("/system/balance", updateSystemWallet);

// USER
router.post("/create", createWallet);
router.get("/", getAllWallets);
router.put("/:userId/balance", updateWalletBalance);
router.delete("/:userId", deleteWallet);
router.get("/:userId", getWalletByUserId);

module.exports = router;
