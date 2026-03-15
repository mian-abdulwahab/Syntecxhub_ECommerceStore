const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { 
        orderItems, 
        shippingAddress, 
        totalPrice,
        paymentMethod // Now capturing paymentMethod from frontend
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x.product,
                _id: undefined
            })),
            shippingAddress,
            paymentMethod,
            totalPrice,
            // LOGIC: PayPal is paid immediately. Cash is paid on delivery.
            isPaid: paymentMethod === 'PayPal' ? true : false,
            paidAt: paymentMethod === 'PayPal' ? Date.now() : null,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
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