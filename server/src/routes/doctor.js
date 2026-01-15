const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

// 1. GET ALL DOCTORS (Search Feature)
router.get('/all', async (req, res) => {
  try {
    // Sirf wahi users dhundo jinka role 'doctor' hai
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. BECOME A DOCTOR (Temporary API for testing)
// Isse tum kisi bhi user ko doctor bana sakte ho
router.put('/upgrade/:userId', async (req, res) => {
  try {
    const { specialization, experience, fees, about } = req.body;
    
    const user = await User.findByIdAndUpdate(req.params.userId, {
      role: 'doctor',
      isDoctor: true,
      specialization,
      experience,
      fees,
      about
    }, { new: true });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update Failed" });
  }
});

// 3. BOOK APPOINTMENT (Simple Storage for now)
// Note: Iske liye alag Model chahiye hoga, abhi bas console log karenge
router.post('/book', async (req, res) => {
    // Future mein yahan 'Appointment' model banega
    res.json({ message: "Appointment Request Sent! Doctor will contact you." });
});

router.get('/patients/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;

        // 1. Find all messages where receiver is this doctor
        // Using 'distinct' to get unique user IDs
        const senderIds = await Message.distinct('senderId', { receiverId: doctorId });

        // 2. Also find users whom the doctor messaged (in case doctor started chat)
        const receiverIds = await Message.distinct('receiverId', { senderId: doctorId });

        // 3. Combine unique IDs
        const allUserIds = [...new Set([...senderIds, ...receiverIds])];

        // 4. Fetch User details for these IDs
        const patients = await User.find({ _id: { $in: allUserIds } }).select('username email _id');

        res.json(patients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;