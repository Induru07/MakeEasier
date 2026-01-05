const express = require('express');
const router = express.Router();

// Temporary in-memory storage for chat history
// (In a real app, use a database or session)
let chatHistory = []; 

router.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    // 1. Add the new user message to our history
    chatHistory.push({ role: 'user', content: userMessage });

    try {
        const response = await fetch('http://127.0.0.1:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:1b',
                // 2. Send the FULL history, not just one message
                messages: [
                    { 
                        role: 'system', 
                        content: `You are a strict Salon Data Collector. 
                        Your ONLY task is to fill this checklist:
                        1. Gender (Male/Female)
                        2. Service (e.g., Haircut, School cut)
                        3. Time (e.g., Tomorrow evening)

                        CURRENT STATUS:
                        Check the chat history provided below. 
                        - If a piece of info is there, DO NOT ask for it.
                        - If info is missing, ask for it politely in under 10 words.
                        - DO NOT talk about "checking history" or "searching records". Just ask the question.
                        - Once all 3 are known, reply ONLY: "[READY] Summary: [Gender], [Service], [Time]".` 
                    },
                    ...chatHistory
                ]
                stream: false,
                options: { temperature: 0.1 }
            })
        });

        const data = await response.json();
        const aiReply = data.message.content;

        // 3. Add the AI's reply to history so it remembers what it asked
        chatHistory.push({ role: 'assistant', content: aiReply });

        if (aiReply.includes('[READY]')) {
            console.log("MATCH FOUND. RESETTING HISTORY.");
            chatHistory = []; // Clear history for the next customer
            return res.json({ response: "Search triggered! Finding your top 5 salons...", action: "search" });
        }

        return res.json({ response: aiReply });

    } catch (error) {
        console.error('AI Error:', error);
        return res.json({ response: "Sorry, I lost my train of thought. What service did you need?" });
    }
});

module.exports = router;