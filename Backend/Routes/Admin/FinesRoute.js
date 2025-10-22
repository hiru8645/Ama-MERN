// Route/Admin/FineRoute.js
const express = require("express");
const router = express.Router();
const {
  createFine,
  getAllFines,
  getUserFines,
  approveFine,
  rejectFine,
  deleteFine,
  payFine
} = require("../../Controllers/Admin/FinesController");

// Create fine manually
router.post("/create", createFine);

// Auto + Get all (admin)
router.get("/", getAllFines);

// Get user fines
router.get("/user/:userId", getUserFines);

// Approve / Reject
router.put("/:id/approve", approveFine);
router.put("/:id/reject", rejectFine);

// Delete
router.delete("/:id", deleteFine);

// Mark as paid
router.put("/:id/pay", payFine);

module.exports = router;
