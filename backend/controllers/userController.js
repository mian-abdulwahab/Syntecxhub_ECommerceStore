const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// FIX: Added .toString() to ensure the ID is a simple string for verification
const generateToken = (id) => {
    return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, { 
        expiresIn: '30d' 
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            cartItems: user.cartItems || [], 
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            cartItems: [], 
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Update user cart
// @route   PUT /api/users/cart
const updateUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.cartItems = req.body.cartItems;
            const updatedUser = await user.save();
            res.json(updatedUser.cartItems);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating cart' });
    }
};

// @desc    Get user profile (Private)
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            isAdmin: user.isAdmin,
            cartItems: user.cartItems 
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { authUser, registerUser, getUserProfile, updateUserCart };