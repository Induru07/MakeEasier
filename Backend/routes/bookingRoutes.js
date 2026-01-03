const express = require('express');
const router = express.Router();

const mockResponses = [
    "I'm sorry, my royal gears are turning slowly today. Could you repeat that?",
    "How may I help you book your appointment today?",
    "The salon is ready for you! What style are we looking for?"
];

router.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log('User sent:', userMessage);

    try {
        const response = await fetch('http://127.0.0.1:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3:8b', // ENSURE THIS IS DOWNLOADED 100%
                messages: [
                    { role: 'system', content: 'You are an elegant salon concierge. Help the user book a haircut.' },
                    { role: 'user', content: userMessage }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`);
        }

        const data = await response.json();
        
        // Use 'message.content' for the /api/chat endpoint
        return res.json({ response: data.message.content });

    } catch (error) {
        console.error('AI Error:', error.message);
        
        // Only send fallback if the AI actually failed
        const randomReply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        return res.json({ response: randomReply });
    }
});

module.exports = router;