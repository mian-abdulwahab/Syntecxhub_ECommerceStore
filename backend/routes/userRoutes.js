const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { updateUserCart } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', authUser);
router.route('/cart').put(protect, updateUserCart);
router.get('/profile', protect, getUserProfile); // Only logged-in users can see their profile

module.exports = router;