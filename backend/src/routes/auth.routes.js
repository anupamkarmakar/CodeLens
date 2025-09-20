const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getReviewHistory,
  addReviewToHistory,
  saveUserCode,
} = require('../controller/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/history', protect, getReviewHistory);
router.post('/history', protect, addReviewToHistory);
router.post('/save-code', protect, saveUserCode);

module.exports = router;