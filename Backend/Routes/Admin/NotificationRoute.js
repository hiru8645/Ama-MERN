const express = require("express");
const router = express.Router();
const {
  getNotifications,
  deleteNotification,
  clearAllNotifications,
} = require("../../Controllers/Admin/NotificationController");

router.get("/", getNotifications);
router.delete("/:id", deleteNotification);
router.delete("/", clearAllNotifications); // clear all

module.exports = router;
