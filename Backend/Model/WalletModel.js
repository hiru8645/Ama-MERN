const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: function () {
        return this.type === "user";
      },
      unique: false,
    },
    type: {
      type: String,
      enum: ["user", "system"],
      default: "user",
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "LKR",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
