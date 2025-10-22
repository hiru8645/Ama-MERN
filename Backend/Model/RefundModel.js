const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Counter for auto-increment refundId
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model("RefundCounter", counterSchema);

const refundSchema = new Schema({
  refundId: { type: Number, unique: true }, // Auto increment
  paymentId: { type: Number, required: true }, // This comes from Payments.paymentId
  buyerId: { type: String, required: true },
  giverId: { type: String },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  requestDate: { type: Date, default: Date.now }
});

// Auto-increment refundId
refundSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "refundId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.refundId = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Refund", refundSchema);
