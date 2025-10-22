const express = require("express");
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  approvePayment,
  rejectPayment,
  deletePayment,
  getPaymentsByDate,
  getPaymentsByBuyer,
  getPaymentsByGiver,
  getUserTransactions
} = require("../../Controllers/Admin/AdminPaymentController");

// Create payment (user form)
router.post("/create", createPayment);

// Get all payments (admin view)
router.get("/", getAllPayments);

// Approve/Reject payments
router.put("/:id/approve", approvePayment);
router.put("/:id/reject", rejectPayment);

// Delete payment
router.delete("/:id", deletePayment);

// Reports (filter by date)
router.get("/reports", getPaymentsByDate);

// Get payments by buyer
router.get("/buyer/:buyerId", getPaymentsByBuyer);

// Get payments by giver
router.get("/giver/:giverId", getPaymentsByGiver);

// Get all transactions of a specific user
router.get("/user/:userId", getUserTransactions);



module.exports = router;
