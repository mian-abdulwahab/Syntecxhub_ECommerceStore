const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { 
            orderItems, 
            shippingAddress, 
            totalPrice,
            paymentMethod 
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map((x) => ({
                name: x.name,
                qty: x.qty,
                image: x.image,
                price: x.price,
                product: x.product || x._id, // Ensure we have the product ID
            })),
            shippingAddress: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode, // CRITICAL: This was missing
                country: shippingAddress.country,
            },
            paymentMethod,
            totalPrice,
            // These satisfy the "required" fields in your Schema
            itemsPrice: totalPrice, 
            shippingPrice: 0,
            taxPrice: 0,
            isPaid: paymentMethod === 'PayPal' ? true : false,
            paidAt: paymentMethod === 'PayPal' ? Date.now() : null,
            isDelivered: false, // Explicitly set to avoid validation issues
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("ORDER SAVE ERROR:", error.message);
        res.status(500).json({ message: "Database Save Failed: " + error.message });
    }
};
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders (ADMIN ONLY)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

// @desc    Update order to delivered (ADMIN ONLY)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        // LOGIC: If it's a Cash order, marking as delivered also marks it as paid
        if (order.paymentMethod === 'Cash') {
            order.isPaid = true;
            order.paidAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = { 
    addOrderItems, 
    getOrderById, 
    getMyOrders,
    getOrders, 
    updateOrderToDelivered 
};