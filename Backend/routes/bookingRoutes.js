const express = require('express');
const router = express.Router();

// This route handles the chat messages
router.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Talking to your local Ollama instance (Port 11434)
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:3b', 
                prompt: `System: You are the VIP Concierge for "The Royal Salon". 
                Your tone is elegant, professional, and welcoming.
                Goal: Help the user book a haircut.
                Step 1: Greet them and ask for their preferred hair style.
                Step 2: Once they give a style, ask for a date and time.
                Step 3: If they provide all info, say "I shall prepare the royal chair for you."
                
                Current User Input: ${userMessage}`,
                stream: false // Set to false so we get the whole reply at once
            })
        });

        if (!response.ok) throw new Error('Ollama service is not responding.');

        const data = await response.json();
        
        // Send the AI's reply back to the website
        res.json({ response: data.response });

    } catch (error) {
        console.error('Ollama Error:', error);
        res.status(500).json({ response: "Apologies, my royal records are temporarily unavailable." });
    }
});

module.exports = router;