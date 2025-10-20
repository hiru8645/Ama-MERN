const mongoose = require("mongoose");

// Models
const Order = require("./Model/OrderModel");
const Book = require("./Model/InventoryModel");

async function testOrderEdit() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/admin");
    console.log("Connected to MongoDB");

    // Find a pending order to test with
    let testOrder = await Order.findOne({ status: "Pending" });
    
    if (!testOrder) {
      // Create a test order if none exists
      console.log("Creating a test order...");
      
      const testBook = await Book.findOne();
      if (!testBook) {
        console.log("No books available for testing");
        process.exit(1);
      }
      
      testOrder = await Order.create({
        orderId: `TEST-${Date.now()}`,
        items: [{
          bookId: testBook.bookId,
          itemName: testBook.itemName,
          price: testBook.price,
          quantity: 1
        }],
        totalItems: 1,
        totalPrice: testBook.price,
        userid: "testUser",
        username: "Test User",
        customerName: "Test Customer",
        customerContact: "1234567890",
        bookId: testBook.bookId,
        bookName: testBook.itemName,
        quantity: 1,
        status: "Pending",
        orderDate: new Date()
      });
      
      console.log("Test order created:", testOrder._id);
    }

    console.log("Testing order edit...");
    console.log("Original order:", {
      id: testOrder._id,
      customerName: testOrder.customerName,
      customerContact: testOrder.customerContact,
      items: testOrder.items
    });

    // Test the edit functionality directly
    const updatedData = {
      customerName: "Updated Customer Name",
      customerContact: "9876543210",
      items: [{
        bookId: testOrder.items[0].bookId,
        quantity: 2
      }]
    };

    // Simulate the updateOrder controller logic
    const orderId = testOrder._id;
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log("Order not found");
      process.exit(1);
    }
    
    if (order.status !== "Pending") {
      console.log("Order is not pending, cannot edit");
      process.exit(1);
    }

    const newItem = updatedData.items[0];
    const currentItem = order.items[0];
    const newBook = await Book.findOne({ bookId: newItem.bookId });
    
    if (!newBook) {
      console.log("Book not found");
      process.exit(1);
    }

    // Calculate inventory changes
    const quantityDelta = newItem.quantity - currentItem.quantity;
    console.log("Quantity delta:", quantityDelta);
    
    if (quantityDelta > 0) {
      if (newBook.quantity < quantityDelta) {
        console.log(`Not enough stock. Available: ${newBook.quantity}, Required: ${quantityDelta}`);
        process.exit(1);
      }
      newBook.quantity -= quantityDelta;
    } else if (quantityDelta < 0) {
      newBook.quantity += Math.abs(quantityDelta);
    }
    
    await newBook.save();

    // Update order
    order.customerName = updatedData.customerName;
    order.customerContact = updatedData.customerContact;
    order.items[0].quantity = newItem.quantity;
    order.quantity = newItem.quantity;
    order.totalItems = newItem.quantity;
    order.totalPrice = newBook.price * newItem.quantity;
    
    await order.save();

    console.log("Order updated successfully!");
    console.log("Updated order:", {
      id: order._id,
      customerName: order.customerName,
      customerContact: order.customerContact,
      items: order.items,
      totalPrice: order.totalPrice
    });

    console.log("Updated book inventory:", {
      bookId: newBook.bookId,
      quantity: newBook.quantity
    });

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

testOrderEdit();