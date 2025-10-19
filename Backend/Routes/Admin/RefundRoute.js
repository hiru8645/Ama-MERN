const express = require("express");
const router = express.Router();
const {
  createRefundRequest,
  getAllRefunds,
  approveRefund,
  rejectRefund,
  deleteRefund,
  getRefundsByUser
} = require("../../Controllers/Admin/RefundController");

router.post("/create", createRefundRequest);
router.get("/", getAllRefunds);
router.get("/user/:userId", getRefundsByUser);
router.put("/:id/approve", approveRefund);
router.put("/:id/reject", rejectRefund);
router.delete("/:id", deleteRefund);

module.exports = router;
