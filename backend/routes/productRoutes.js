const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct,
    deleteProduct // Import the delete function
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Path: /api/products
router.route('/')
    .get(getProducts) // Public: View all products
    .post(protect, admin, createProduct); // Admin: Create sample product

// Path: /api/products/:id
router.route('/:id')
    .get(getProductById) // Public: View details
    .put(protect, admin, updateProduct) // Admin: Update product details
    .delete(protect, admin, deleteProduct); // Admin: Remove product

module.exports = router;