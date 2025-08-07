const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8070;

// Middleware
app.use(cors());
app.use(express.json()); // Replacing body-parser

// MongoDB connection
const URL = process.env.MONGODB_URL;
const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("✅ MongoDB Connection Successful!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit the process if DB connection fails
    }
};
connectDB();