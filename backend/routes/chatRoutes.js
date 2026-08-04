const express = require('express');
const router = express.Router();
const { generateSupportResponse } = require('../services/groqService');

// POST /api/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message content is required.' });
        }

        const reply = await generateSupportResponse(message);
        return res.json({ reply });
    } catch (error) {
        console.error('Error in chat route:', error);
        return res.status(500).json({
            reply: 'I apologize, but something went wrong on our server. Please contact support@trendly.com.'
        });
    }
});

module.exports = router;