const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getOrderById, 
    getMyOrders,
    getOrders,             // Added
    updateOrderToDelivered // Added
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware'); // Added admin

// Path: /api/orders
router.route('/')
    .get(protect, admin, getOrders) // Admin: See all orders
    .post(protect, addOrderItems);   // Customer: Create order

// Path: /api/orders/myorders
router.route('/myorders').get(protect, getMyOrders);

// Path: /api/orders/:id
router.route('/:id').get(protect, getOrderById);

// Path: /api/orders/:id/deliver
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;