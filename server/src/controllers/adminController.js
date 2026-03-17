const User = require('../models/User');
const Journal = require('../models/Journal');

// @desc    Get All Users & Doctors
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update User Status (Suspend/Activate)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = status;
      await user.save();
      res.json({ message: `User ${status === 'suspended' ? 'Suspended' : 'Activated'} Successfully` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User Deleted Successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get System Stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalJournals = await Journal.countDocuments();
        
        res.json({
            totalUsers,
            totalDoctors,
            totalJournals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
