const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // This is the "Auto-Create" magic. 
            // It tells Atlas to use 'mgtech' the moment data is saved.
            dbName: 'mgtech', 
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Active Database: ${conn.connection.name}`); 
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;