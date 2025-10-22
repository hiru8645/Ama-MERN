const mongoose = require("mongoose");

const disputeMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

const disputeSchema = new mongoose.Schema({
  status: { type: String, enum: ["Open", "Resolved", "Rejected"], default: "Open" },
  messages: [disputeMessageSchema],
  resolution: { type: String }
});

// Legacy item schema kept for compatibility with existing frontend
const orderItemSchema = new mongoose.Schema({
  bookId: { type: String },
  itemName: { type: String },
  price: { type: Number },
  quantity: { type: Number }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    // New simplified fields
    customerName: { type: String, required: false },
    customerContact: { type: String, required: false },
    bookId: { type: String, required: false },
    bookName: { type: String, required: false },
    quantity: { type: Number, required: false },
    orderDate: { type: Date, required: false },

    // Legacy fields for compatibility
    items: [orderItemSchema],
    totalItems: { type: Number, required: false },
    totalPrice: { type: Number, required: false },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled", "Completed"],
      default: "Pending"
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid"
    },
    userid: { type: String, required: false },
    username: { type: String, required: false },
    approval: {
      approvedBy: { type: String },
      approvedAt: { type: Date },
      rejectedReason: { type: String }
    },
    dispute: disputeSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);