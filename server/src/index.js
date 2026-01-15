require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // <--- 1. HTTP Server Import kiya
const { Server } = require("socket.io"); // <--- 2. Socket.io Import kiya

// Models
require('./models/User');
require('./models/Journal');
const Message = require('./models/Message'); // <--- 3. Message Model (Chat save karne ke liye)

const app = express();

// --- 4. Server Setup for Socket.io ---
const server = http.createServer(app); // Express ko HTTP server mein wrap kiya

app.use(express.json()); 
app.use(cors()); 

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/messages', require('./routes/messages'));

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

// --- 5. SOCKET.IO LOGIC (Chat System) ---
const io = new Server(server, {
  cors: {
    // Yahan wo URLs daalo jahan se frontend chalega (Localhost aur Live dono)
    origin: ["http://localhost:5173", "http://localhost:5000", "https://ankhaae.vercel.app"],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);

  // 1. Room Join karna (User aur Doctor ke beech private chat)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // 2. Message bhejna
  socket.on("send_message", async (data) => {
    console.log("Message Received:", data);
    
    // A. Database mein save karo
    try {
        const newMessage = new Message(data);
        await newMessage.save();
    } catch (err) {
        console.error("Msg save error:", err);
    }

    // B. Room mein dusre bande ko bhejo
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
// ----------------------------------------

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running... The Healing begins here.');
});

// --- 6. SERVER START (Change: app.listen -> server.listen) ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});