const mongoose = require("mongoose");
const Wallet = require("./Model/WalletModel");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/admin")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

const addSampleWallets = async () => {
  try {
    // Clear existing wallets
    await Wallet.deleteMany({});

    // Create sample wallets
    const wallets = [
      { userId: "IT23650534", type: "user", balance: 1000 },
      { userId: "IT23650535", type: "user", balance: 750 },
      { userId: "IT23650536", type: "user", balance: 500 },
      { userId: "SYSTEM", type: "system", balance: 5000 }
    ];

    await Wallet.insertMany(wallets);
    console.log("Sample wallets created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding sample wallets:", error);
    process.exit(1);
  }
};

addSampleWallets();