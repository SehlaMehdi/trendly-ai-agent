const express = require('express');
const router = express.Router();
const { generateSupportResponse } = require('../services/groqService');

// POST /api/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Strict Type and Content Validation
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ error: 'A valid message string is required.' });
        }

        const sanitizedMessage = message.trim();

        // 2. Length Constraints (prevents token exhaustion and abuse)
        if (sanitizedMessage.length > 1000) {
            return res.status(400).json({ error: 'Message exceeds the maximum allowed length of 1000 characters.' });
        }

        // 3. Service Invocation
        const reply = await generateSupportResponse(sanitizedMessage);
        
        return res.json({ reply });

    } catch (error) {
        // Log the full error internally, but return a safe generic message to the client
        console.error('Error in chat route [POST /api/chat]:', error);
        
        return res.status(500).json({
            reply: 'I apologize, but something went wrong on our server. Please contact support@trendly.com.'
        });
    }
});

module.exports = router;