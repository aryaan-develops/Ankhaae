const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const User = require('../models/User'); 
const { GoogleGenerativeAI } = require("@google/generative-ai"); // <--- Import AI
require('dotenv').config();

// AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/journal/create
// @desc    Save Journal + Add XP + Generate AI Response
router.post('/create', async (req, res) => {
  try {
    const { userId, mood, content, dailyWin, dailyChallenge } = req.body;

    // 1. Validation
    if (!userId || !mood || !content) {
      return res.status(400).json({ message: "Saari fields zaroori hain!" });
    }

    // 2. Journal Save karo (Pehle save karna zaroori hai)
    let newJournal = new Journal({
      user: userId,
      mood,
      content,
      dailyWin,
      dailyChallenge,
      aiResponse: "Thinking..." // Temporary placeholder
    });

    await newJournal.save();

    // 3. GAMIFICATION LOGIC (XP & Level)
    const user = await User.findById(userId);
    if (user) {
      user.xp = (user.xp || 0) + 10;
      const previousLevel = user.level || 1;
      const newLevel = Math.floor(user.xp / 50) + 1;
      
      if (newLevel > previousLevel) user.level = newLevel;
      await user.save();
    }

    // --- 4. AI MAGIC STARTS HERE (Gemini) ---
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // AI ko prompt dena (Roleplay karwayenge)
      const prompt = `
        Act as a compassionate, empathetic mental health companion. 
        The user is feeling: ${mood}.
        Here is their journal entry: "${content}".
        
        Write a short, comforting response (max 2-3 sentences). 
        Validate their feelings and offer a gentle word of encouragement. 
        Do not give medical advice. Keep it warm and human-like.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiReply = response.text();

      // Update Journal with AI Reply
      newJournal.aiResponse = aiReply;
      await newJournal.save();

    } catch (aiError) {
      console.error("AI Error:", aiError);
      // Agar AI fail ho jaye, toh koi baat nahi, journal toh save ho hi gaya hai
      newJournal.aiResponse = "I am listening, but I couldn't find the right words right now. 🌿";
      await newJournal.save();
    }
    // --- AI END ---

    res.status(201).json({
      message: "Journal Saved, XP Added & AI Replied!",
      savedJournal: newJournal,
      updatedXP: user ? user.xp : 0,
      updatedLevel: user ? user.level : 1
    });

  } catch (error) {
    console.error("Journal Save Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/journal/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE
router.delete('/:id', async (req, res) => {
  try {
    const journal = await Journal.findByIdAndDelete(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;