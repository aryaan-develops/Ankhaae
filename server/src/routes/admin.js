const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, deleteUser, getStats } = require('../controllers/adminController');

// All Routes for Admin
router.get('/users', getAllUsers);
router.put('/user/:id/status', updateUserStatus);
router.delete('/user/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;
