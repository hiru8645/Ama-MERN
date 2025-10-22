const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fineSchema = new Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  overdueDays: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Fine", fineSchema);
