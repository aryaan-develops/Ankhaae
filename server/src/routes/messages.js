const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get chat history between two users
router.get('/:user1Id/:user2Id', async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    // Database mein wo messages dhundo jo in dono ke beech huye hain
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ createdAt: 1 }); // Purane pehle, naye baad mein

    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete chat history between two users
router.delete('/:user1Id/:user2Id', async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    await Message.deleteMany({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    });
    res.json({ message: "Chat history deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;