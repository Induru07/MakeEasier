/**
 * 1. TOGGLE CHAT VISIBILITY
 * Handles both opening the chat and the minimize button.
 */
function toggleChat() {
    const win = document.getElementById('chat-window');
    // If hidden, show it as flex. If visible, hide it.
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
    } else {
        win.style.display = 'none';
    }
}

/**
 * 2. SEND MESSAGE
 * Connects to the Express API at /api/bookings/chat
 */
async function sendMessage() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg) return;

    // Display User Message immediately
    appendMessage(msg, 'user');
    input.value = '';

    try {
        const response = await fetch('/api/bookings/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        const data = await response.json();
        // Display Bot Response
        appendMessage(data.response, 'bot');

    } catch (error) {
        appendMessage("Sorry, the concierge is currently offline.", "bot");
        console.error("Connection Error:", error);
    }
}

/**
 * 3. UI HELPER
 */
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    msgDiv.innerText = text;
    const container = document.getElementById('messages');
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight; // Scroll to bottom
}

// Support for Enter Key
document.getElementById('userInput').addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});