const Order = require("../Model/OrderModel");
const Book = require("../Model/InventoryModel");
const Product = require("../Model/ProductModel");
const Notification = require("../Model/NotificationModel");

exports.createOrder = async (req, res) => {
  try {
    const { items, userid, username, customerName, customerContact, bookName, orderDate } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order items required." });
    }

    let totalItems = 0;
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      // First try to find by custom product code, then by bookId in inventory
      let book = await Book.findOne({ bookId: item.bookId });
      
      // If not found in inventory, try to find in products by code and sync to inventory
      if (!book) {
        const product = await Product.findOne({ code: item.bookId });
        if (product) {
          // Create inventory entry from product data
          book = new Book({
            bookId: product.code,
            itemName: product.name,
            quantity: product.stockCurrent,
            price: parseFloat(product.price)
          });
          await book.save();
        }
      }
      
      if (!book) {
        return res.status(404).json({ success: false, message: `Book not found: ${item.bookId}` });
      }
      if (book.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough quantity for ${book.itemName}` });
      }
      
      // Reduce stock in inventory
      book.quantity -= item.quantity;
      await book.save();

      // Also reduce stock in products collection if it exists
      const product = await Product.findOne({ code: item.bookId });
      if (product) {
        product.stockCurrent = Math.max(0, product.stockCurrent - item.quantity);
        await product.save();
      }

      orderItems.push({
        bookId: book.bookId, // This will now be the custom product code
        itemName: book.itemName,
        price: book.price,
        quantity: item.quantity
      });
      totalItems += item.quantity;
      totalPrice += book.price * item.quantity;
    }

    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    let nextOrderNumber = 1;
    if (lastOrder && lastOrder.orderId) {
      const lastNum = parseInt(lastOrder.orderId.replace("ORD-", ""));
      if (!isNaN(lastNum)) nextOrderNumber = lastNum + 1;
    }
    const orderId = `ORD-${nextOrderNumber}`;

    const order = await Order.create({
      orderId,
      items: orderItems,
      totalItems,
      totalPrice,
      userid,
      username,
      customerName,
      customerContact,
      bookId: orderItems[0]?.bookId,
      bookName: bookName || orderItems[0]?.itemName,
      quantity: orderItems[0]?.quantity,
      orderDate: orderDate ? new Date(orderDate) : new Date()
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { itemName, quantity, price } = req.body;

    const lastBook = await Book.findOne().sort({ createdAt: -1 });
    let nextBookNumber = 1000;
    if (lastBook && lastBook.bookId) {
      const lastNum = parseInt(lastBook.bookId.replace("BK-", ""));
      if (!isNaN(lastNum)) nextBookNumber = lastNum + 1;
    }
    const bookId = `BK-${nextBookNumber}`;

    const newBook = await Book.create({ bookId, itemName, quantity, price });

    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ success: false, message: "Only pending orders can be approved" });
    order.status = "Approved";
    order.approval = { approvedBy: req.body.approvedBy || "Admin", approvedAt: new Date() };
    await order.save();
    // Notify specific user on approval
    try {
      await Notification.create({
        userId: order.userid,
        type: "ORDER_APPROVED",
        message: `Your order ${order.orderId || order._id} has been approved.`
      });
    } catch (_) {}
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ success: false, message: "Only pending orders can be rejected" });
    
    // Restore inventory quantities when rejecting
    for (const item of order.items) {
      const book = await Book.findOne({ bookId: item.bookId }) || await Book.findById(item.bookId);
      if (book) {
        book.quantity += item.quantity;
        await book.save();
      }
      
      // Also restore stock in products collection if it exists
      const product = await Product.findOne({ code: item.bookId });
      if (product) {
        product.stockCurrent += item.quantity;
        await product.save();
      }
    }
    
    order.status = "Rejected";
    order.approval = { approvedBy: req.body.approvedBy || "Admin", approvedAt: new Date(), rejectedReason: req.body.rejectedReason || "" };
    await order.save();
    try {
      await Notification.create({
        userId: order.userid,
        type: "ORDER_REJECTED",
        message: `Your order ${order.orderId || order._id} was declined.`
      });
    } catch (_) {}
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resolveDispute = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.dispute) return res.status(404).json({ success: false, message: "Order or dispute not found" });
    order.dispute.status = "Resolved";
    order.dispute.resolution = req.body.resolution || "";
    await order.save();
    res.status(200).json({ success: true, data: order.dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Approved") return res.status(400).json({ success: false, message: "Only approved orders can be completed" });
    if (order.paymentStatus !== "Paid") return res.status(400).json({ success: false, message: "Order must be paid before completing" });
    order.status = "Completed";
    await order.save();
    try {
      await Notification.create({
        userId: order.userid,
        type: "ORDER_COMPLETED",
        message: `Order placed successfully`
      });
    } catch (_) {}
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark order as paid
exports.markPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Approved") return res.status(400).json({ success: false, message: "Only approved orders can be paid" });
    order.paymentStatus = "Paid";
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" });
    
    // Restore inventory quantities when cancelling
    for (const item of order.items) {
      const book = await Book.findOne({ bookId: item.bookId }) || await Book.findById(item.bookId);
      if (book) {
        book.quantity += item.quantity;
        await book.save();
      }
      
      // Also restore stock in products collection if it exists
      const product = await Product.findOne({ code: item.bookId });
      if (product) {
        product.stockCurrent += item.quantity;
        await product.save();
      }
    }
    
    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addDisputeMessage = async (req, res) => {
  try {
    const { message, sender } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!message || !sender) return res.status(400).json({ success: false, message: "Message and sender required" });
    if (!order.dispute) order.dispute = { status: "Open", messages: [], resolution: "" };
    order.dispute.messages.push({ sender, message, sentAt: new Date() });
    await order.save();
    res.status(200).json({ success: true, data: order.dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    
    // Allow deletion of Pending orders as well as Completed, Cancelled, and Rejected orders
    if (order.status !== "Pending" && order.status !== "Rejected" && order.status !== "Cancelled" && order.status !== "Completed") {
      return res.status(403).json({ success: false, message: "Only pending, completed, rejected or cancelled orders can be deleted" });
    }
    
    // Restore inventory quantities before deleting the order
    for (const item of order.items) {
      const book = await Book.findOne({ bookId: item.bookId }) || await Book.findById(item.bookId);
      if (book) {
        book.quantity += item.quantity;
        await book.save();
      }
    }
    
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await Order.find({ userid }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing pending order (edit in place)
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, customerContact, items } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ success: false, message: "Only pending orders can be edited" });

    // Only supporting single-item edits for now
    const newItem = Array.isArray(items) ? items[0] : null;
    if (!newItem || !newItem.bookId || !newItem.quantity) {
      return res.status(400).json({ success: false, message: "items[0].bookId and quantity required" });
    }

    const currentItem = order.items[0];
    // If book changed or quantity changed, adjust inventory
    const newBook = await Book.findOne({ bookId: newItem.bookId }) || await Book.findById(newItem.bookId);
    if (!newBook) return res.status(404).json({ success: false, message: "Book not found" });

    // If book changed, refund previous quantity to old book stock
    if (currentItem.bookId !== newBook.bookId) {
      const oldBook = await Book.findOne({ bookId: currentItem.bookId }) || await Book.findById(currentItem.bookId);
      if (oldBook) {
        oldBook.quantity += currentItem.quantity;
        await oldBook.save();
      }
      
      // Also restore stock in old product
      const oldProduct = await Product.findOne({ code: currentItem.bookId });
      if (oldProduct) {
        oldProduct.stockCurrent += currentItem.quantity;
        await oldProduct.save();
      }
      
      // deduct full new quantity from new book
      if (newBook.quantity < newItem.quantity) {
        return res.status(400).json({ success: false, message: `Not enough quantity for ${newBook.itemName}` });
      }
      newBook.quantity -= newItem.quantity;
      await newBook.save();
      
      // Also reduce stock in new product
      const newProduct = await Product.findOne({ code: newBook.bookId });
      if (newProduct) {
        newProduct.stockCurrent = Math.max(0, newProduct.stockCurrent - newItem.quantity);
        await newProduct.save();
      }
    } else {
      // Same book, only adjust by delta
      const delta = newItem.quantity - currentItem.quantity;
      if (delta > 0) {
        if (newBook.quantity < delta) {
          return res.status(400).json({ success: false, message: `Not enough quantity for ${newBook.itemName}` });
        }
        newBook.quantity -= delta;
        await newBook.save();
        
        // Also reduce stock in product
        const product = await Product.findOne({ code: newBook.bookId });
        if (product) {
          product.stockCurrent = Math.max(0, product.stockCurrent - delta);
          await product.save();
        }
      } else if (delta < 0) {
        newBook.quantity += Math.abs(delta);
        await newBook.save();
        
        // Also increase stock in product
        const product = await Product.findOne({ code: newBook.bookId });
        if (product) {
          product.stockCurrent += Math.abs(delta);
          await product.save();
        }
      }
    }

    // Update order fields
    order.items[0].bookId = newBook.bookId;
    order.items[0].itemName = newBook.itemName;
    order.items[0].price = newBook.price;
    order.items[0].quantity = Number(newItem.quantity);

    order.customerName = customerName ?? order.customerName;
    order.customerContact = customerContact ?? order.customerContact;
    order.bookId = newBook.bookId;
    order.bookName = newBook.itemName;
    order.quantity = Number(newItem.quantity);

    // Recompute totals
    order.totalItems = order.items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    order.totalPrice = order.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
