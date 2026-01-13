// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('./models/User');
require('./models/Journal');
const app = express();
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journal');
// Middleware
app.use(express.json()); // JSON data padhne ke liye
app.use(cors()); // Frontend connection allow karne ke liye

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected: Magical Database Ready");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
        process.exit(1);
    }
};
connectDB();

// Basic Route (Testing ke liye)
app.get('/', (req, res) => {
    res.send('API is running... The Healing begins here.');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});