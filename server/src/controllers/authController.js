// server/src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token Generate karne ka function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // 30 din tak login rahega
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check kar user pehle se hai kya
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists bhai' });
    }

    // 2. Password Encrypt kar (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. User Create kar
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Response bhej (User info + Token)
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id), // Ye token frontend save karega
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Email check kar
    const user = await User.findOne({ email });

    // 2. Password match kar (Bcrypt se)
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Email ya Password galat hai' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};