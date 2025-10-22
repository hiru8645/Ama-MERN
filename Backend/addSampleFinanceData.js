const mongoose = require("mongoose");
const Payment = require("./Model/AdminPaymentModel");
const Refund = require("./Model/RefundModel");
const Wallet = require("./Model/WalletModel");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/admin")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

const addSampleData = async () => {
  try {
    // Clear existing data
    await Payment.deleteMany({});
    await Refund.deleteMany({});
    await Wallet.deleteMany({});

    // Create sample wallets
    const wallets = [
      { userId: "IT23650534", type: "user", balance: 1000 },
      { userId: "IT23650535", type: "user", balance: 750 },
      { userId: "IT23650536", type: "user", balance: 500 },
      { userId: "SYSTEM", type: "system", balance: 5000 }
    ];

    await Wallet.insertMany(wallets);
    console.log("Sample wallets created");

    // Create sample payments
    const payments = [
      {
        codeId: "PAY001",
        buyerId: "IT23650534",
        giverId: "IT23650535",
        bookId: "BOOK001",
        amount: 150,
        status: "PENDING"
      },
      {
        codeId: "PAY002",
        buyerId: "IT23650536",
        giverId: "IT23650534",
        bookId: "BOOK002",
        amount: 200,
        status: "APPROVED"
      },
      {
        codeId: "PAY003",
        buyerId: "IT23650535",
        giverId: "IT23650536",
        bookId: "BOOK003",
        amount: 175,
        status: "PENDING"
      }
    ];

    await Payment.insertMany(payments);
    console.log("Sample payments created");

    // Create sample refunds
    const refunds = [
      {
        paymentId: "PAY002",
        buyerId: "IT23650536",
        giverId: "IT23650534",
        description: "Item not as described",
        status: "PENDING"
      },
      {
        paymentId: "PAY001", 
        buyerId: "IT23650534",
        giverId: "IT23650535",
        description: "Cancelled order",
        status: "APPROVED"
      }
    ];

    await Refund.insertMany(refunds);
    console.log("Sample refunds created");

    console.log("All sample data added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding sample data:", error);
    process.exit(1);
  }
};

addSampleData();