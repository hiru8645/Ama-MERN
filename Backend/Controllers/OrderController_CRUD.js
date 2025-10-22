const Order = require("../Model/OrderModel");

// Get all orders
const getAllOrders = async (req, res, next) => {
    let orders;
    try {
        orders = await Order.find();
    } catch (err) {
        console.log(err);
    }

    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ orders });
};

// Add order
const addOrder = async (req, res, next) => {
    const { items, totalItems, totalPrice, userid, username, status } = req.body;

    try {
        const order = new Order({
            items,
            totalItems,
            totalPrice,
            userid,
            username,
            status: status || 'Pending'
        });
        await order.save();

        return res.status(201).json({ order });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to add order" });
    }
};

// Get by Id
const getById = async (req, res, next) => {
    const id = req.params.id;
    let order;
    try {
        order = await Order.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
};

// Update Order
const updateOrder = async (req, res, next) => {
    const id = req.params.id;
    const { items, totalItems, totalPrice, status } = req.body;

    let order;

    try {
        order = await Order.findByIdAndUpdate(id, {
            items,
            totalItems,
            totalPrice,
            status
        }, { new: true });
    } catch (err) {
        console.log(err);
    }

    if (!order) {
        return res.status(404).json({ message: "Unable to update order" });
    }

    return res.status(200).json({ order });
};

// Delete Order
const deleteOrder = async (req, res, next) => {
    const id = req.params.id;

    let order;
    try {
        order = await Order.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    
    if (!order) {
        return res.status(404).json({ message: "Unable to delete order" });
    }

    return res.status(200).json({ order });
};

exports.getAllOrders = getAllOrders;
exports.addOrder = addOrder;
exports.getById = getById;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;