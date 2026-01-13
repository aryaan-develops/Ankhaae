// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');
const mongoose = require('mongoose');

// Jab koi POST request karega /signup pe -> signup controller chalega
router.post('/signup', signup);

// Jab koi POST request karega /login pe -> login controller chalega
router.post('/login', login);

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Password mat bhejo
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.put('/update-insta', async (req, res) => {
  const { userId, instagramId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { instagramId }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
router.get('/find-friend/:userId', async (req, res) => {
  try {
    const currentUserId = req.params.userId;

    // 1. Aise users dhundo jinke paas Insta ID hai, aur wo 'Main' nahi hoon
    // Aggregate framework use karenge random user uthane ke liye
    const match = await User.aggregate([
      { 
        $match: { 
          instagramId: { $exists: true, $ne: "" }, // Insta ID honi chahiye
          _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } // Main khud nahi hona chahiye
        } 
      },
      { $sample: { size: 1 } } // Randomly 1 user pick karo
    ]);

    if (match.length === 0) {
      return res.status(404).json({ message: "Abhi koi aur dost available nahi hai." });
    }

    // Sirf zaroori data bhejo (Password mat bhejna!)
    const friend = match[0];
    res.json({
      username: friend.username,
      instagramId: friend.instagramId,
      level: friend.level
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;