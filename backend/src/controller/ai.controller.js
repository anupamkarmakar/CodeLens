const aiService = require('../services/ai.services');


module.exports.getReview = async (req, res) => {

    const prompt = (req.body && req.body.prompt) || req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await aiService.generateText(prompt);
        res.json({ review: response });
    } catch (error) {
        console.error('Error generating review:', error);
        res.status(500).json({ error: 'Failed to generate code review' });
    }

}