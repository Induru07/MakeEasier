/* --- 1. WINDOW CONTROLS (Open/Minimize) --- */
function toggleChat() {
    const win = document.getElementById('chat-window');
    // Toggle between showing (flex) and hiding (none)
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
    } else {
        win.style.display = 'none';
    }
}

/* --- 2. CHAT ENGINE --- */
async function sendMessage() {
    const input = document.getElementById('userInput');
    const msgText = input.value.trim();
    if (!msgText) return;

    appendMessage(msgText, 'user');
    input.value = '';

    // --- ADDED: Create a loading bubble ---
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg bot loading-bubble';
    loadingDiv.innerText = "Mia is thinking...";
    document.getElementById('messages').appendChild(loadingDiv);
    // Yield one frame so the browser can paint the loading bubble
    await new Promise((resolve) => requestAnimationFrame(resolve));
    // --------------------------------------

    try {
        const response = await fetch('/api/bookings/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msgText })
        });

        const data = await response.json();
        
        // --- ADDED: Remove loading bubble before showing answer ---
        loadingDiv.remove();
        // ---------------------------------------------------------
        
        appendMessage(data.response, 'bot');

    } catch (error) {
        loadingDiv.remove(); // Remove even if there is an error
        appendMessage("Error: The salon server is sleeping.", "bot");
    }
}

/* --- 3. UI HELPERS --- */
function appendMessage(text, sender) {
    const messagesContainer = document.getElementById('messages');
    const div = document.createElement('div');
    
    // Assign class 'bot' or 'user' for different colors
    div.className = `msg ${sender}`;
    div.innerText = text;
    
    messagesContainer.appendChild(div);
    
    // Auto-scroll to the newest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Allow user to press "Enter" instead of clicking Send
document.getElementById('userInput').addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});