const aiService = require('../services/ai.services');
const User = require('../models/User');

module.exports.getReview = async (req, res) => {
    const prompt = (req.body && req.body.prompt) || req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await aiService.generateText(prompt);
        

        if (req.user) {
            try {
                const user = await User.findById(req.user.id);
                if (user) {
                    user.reviewHistory.push({
                        code: prompt,
                        review: response,
                        createdAt: new Date()
                    });


                    if (user.reviewHistory.length > 100) {
                        user.reviewHistory = user.reviewHistory.slice(-100);
                    }

                    user.lastCode = prompt;
                    await user.save();
                }
            } catch (error) {
                console.error('Error saving to history:', error);

            }
        }
        
        res.json({ review: response });
    } catch (error) {
        console.error('Error generating review:', error);
        res.status(500).json({ error: 'Failed to generate code review' });
    }
}