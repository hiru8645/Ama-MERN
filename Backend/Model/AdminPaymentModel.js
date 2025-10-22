const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Counter schema for auto-increment
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

const paymentSchema = new Schema({
  paymentId: { type: Number, unique: true }, // Auto increment
  codeId: { type: String, required: true },  // User-provided
  buyerId: { type: String, required: true },
  giverId: { type: String, required: true },
  bookId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  date: { type: Date, default: Date.now }
});

// Pre-save middleware for auto-increment paymentId
paymentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "paymentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.paymentId = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
