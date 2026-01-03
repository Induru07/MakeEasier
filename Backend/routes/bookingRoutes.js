const express = require('express');
const router = express.Router();

// Mock fallback responses
const mockResponses = [
    "Welcome to The Royal Salon! I'm delighted to assist you.",
    "How may I help you book your appointment today?",
    "I shall be happy to reserve a time for you.",
    "Please tell me what service you'd like to book."
];

// This route handles the chat messages
router.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log('Chat request received:', userMessage);

    try {
        const response = await fetch('http://127.0.0.1:11434/api/generate', { // Used IP 127.0.0.1 for stability
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3:8b', 
                prompt: `...`,
                stream: false 
            })
        });

        if (!response.ok) throw new Error('Ollama service is not responding.');

        const data = await response.json();
        return res.json({ response: data.response }); // ADD 'return' HERE

    } catch (error) {
        console.log('Ollama unavailable, using fallback:', error.message);
    }

    // This now only runs if the try block fails
    const randomReply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    res.json({ response: randomReply });

});

module.exports = router;