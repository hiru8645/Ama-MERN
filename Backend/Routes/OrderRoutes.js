const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/OrderController");

// Books (Inventory)
router.post("/books", orderController.createBook);
router.get("/books", orderController.getAllBooks);

// Orders
router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/approve", orderController.approveOrder);
router.patch("/:id/reject", orderController.rejectOrder);
router.patch("/:id/resolve-dispute", orderController.resolveDispute);
router.patch("/:id/complete", orderController.completeOrder);
router.patch("/:id/paid", orderController.markPaid);
router.patch("/:id/cancel", orderController.cancelOrder);
router.put("/:id", orderController.updateOrder);
router.post("/:id/dispute", orderController.addDisputeMessage);
router.delete("/:id", orderController.deleteOrder);
router.get("/user/:userid", orderController.getOrdersByUserId);

module.exports = router;
