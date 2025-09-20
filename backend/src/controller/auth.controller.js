const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'codelens_secret', {
    expiresIn: '30d',
  });
};


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        lastCode: user.lastCode,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        lastCode: user.lastCode,
        reviewHistory: user.reviewHistory.slice(-10)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.lastCode = req.body.lastCode || user.lastCode;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        lastCode: updatedUser.lastCode,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getReviewHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      const history = user.reviewHistory
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);
      
      res.json(history);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReviewToHistory = async (req, res) => {
  try {
    const { code, review } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.reviewHistory.push({
        code,
        review,
        createdAt: new Date()
      });

      if (user.reviewHistory.length > 100) {
        user.reviewHistory = user.reviewHistory.slice(-100);
      }

      user.lastCode = code;
      await user.save();

      res.json({ message: 'Review added to history' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveUserCode = async (req, res) => {
  try {
    const { code, review } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lastCode = code;

    if (review) {
      user.reviewHistory.push({
        code,
        review,
        createdAt: new Date()
      });
    }

    await user.save();

    res.json({
      message: 'Code saved successfully',
      lastCode: user.lastCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getReviewHistory,
  addReviewToHistory,
  saveUserCode,
};