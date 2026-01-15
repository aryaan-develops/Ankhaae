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

// @desc    Register new user (User OR Doctor)
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    // 1. Frontend se saara data receive karo
    const { 
      username, 
      email, 
      password, 
      role,           // 'user' ya 'doctor'
      specialization, // Sirf Doctor ke liye
      fees,           // Sirf Doctor ke liye
      experience,     // Sirf Doctor ke liye
      about           // Sirf Doctor ke liye
    } = req.body;

    // 2. Check kar user pehle se hai kya
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists bhai' });
    }

    // 3. Password Encrypt kar (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Doctor Logic Check
    // Agar role 'doctor' select kiya hai, toh isDoctor true hoga
    const isDoctor = role === 'doctor';

    // 5. User Create kar
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user', // Default 'user'
      isDoctor: isDoctor,
      
      // Ye fields tabhi save honge agar banda doctor hai
      specialization: isDoctor ? specialization : "",
      fees: isDoctor ? Number(fees) : 0,
      experience: isDoctor ? Number(experience) : 0,
      about: isDoctor ? about : ""
    });

    // 6. Response bhej
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,       // Role bhi bhejo
        isDoctor: user.isDoctor, // Status bhi bhejo
        token: generateToken(user.id),
      });
    }
  } catch (error) {
    console.error("Signup Error:", error);
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

    // 2. Password match kar
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,         // Frontend ko batao ki ye Doctor hai ya User
        isDoctor: user.isDoctor,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Email ya Password galat hai' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};