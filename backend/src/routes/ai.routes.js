const express = require('express');
const aiController = require('../controller/ai.controller');
const router = express.Router();


router.post('/get-response', aiController.getReview);
router.get('/get-response', aiController.getReview);


module.exports = router;