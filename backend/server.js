const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// 1. API Routes (Keep these at the top)
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// 2. PRODUCTION LOGIC
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    
    // Serve the static files from the React build folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // Catch-all route for React SPA
    // This ensures refreshing /profile or /cart doesn't throw a 404
    // FIX: Use (.*) to capture all routes for the React SPA
    app.get(/(.*)/, (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);