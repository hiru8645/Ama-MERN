
// MongoDB Compass connection (Connection name: "admin")


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const inventoryRouter = require("./Routes/InventoryRoutes");
const productRouter = require("./Routes/ProductRoutes");
const supplierRouter = require("./Routes/SupplierRoutes");
const ticketRouter = require("./Routes/TicketRoutes");
const userRouter = require("./Routes/UserRoutes");
const orderRouter = require("./Routes/OrderRoutes");

// Finance routes from Project folder
const refundRoutes = require("./Routes/Admin/RefundRoute");
const paymentRoutes = require("./Routes/Admin/AdminPaymentRoute");
const walletRoutes = require("./Routes/Admin/WalletRoute");
const fineRoutes = require("./Routes/Admin/FinesRoute"); 
const notificationRoutes = require("./Routes/Admin/NotificationRoute");

const app = express();


//Middleware
app.use(cors());
app.use(express.json());

// Main routes
app.use("/api/inventory", inventoryRouter);
app.use("/api/products", productRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Finance routes
app.use("/api/payments", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/fines", fineRoutes); 
app.use("/api/notifications", notificationRoutes);

// Error handling middleware
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
});

mongoose.connect("mongodb://localhost:27017/admin")
.then(() => console.log("Connected to MongoDB Compass (localhost:27017, DB: admin)"))
.then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Visit: http://localhost:${PORT}/api/payments`);
    });
})
.catch((err) => console.log("MongoDB connection error:", err));