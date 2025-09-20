const express = require('express');
const aiController = require('../controller/ai.controller');
const { protect } = require('../middleware/auth');
const router = express.Router();

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      await protect(req, res, next);
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};

router.post('/get-response', optionalAuth, aiController.getReview);
router.get('/get-response', optionalAuth, aiController.getReview);

module.exports = router;