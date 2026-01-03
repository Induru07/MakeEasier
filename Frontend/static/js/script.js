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
const userInput = document.getElementById('userInput');
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Auto-expand textarea to fit content (max 3 rows)
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto'; // Reset height to recalculate
    userInput.style.height = Math.min(userInput.scrollHeight, 72) + 'px'; // ~3 rows = 72px
});

/* --- VOICE RECOGNITION LOGIC --- */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stops automatically when you finish a sentence
    recognition.lang = 'en-US';

    function startVoiceTyping() {
        const micBtn = document.getElementById('mic-btn');
        micBtn.classList.add('listening'); // Add listening class for animation
        recognition.start();
    }

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
        
        // Optional: Automatically send the message after speaking
        // sendMessage(); 
    };

    recognition.onend = () => {
        document.getElementById('mic-btn').classList.remove('listening'); // Remove listening animation
    };

    recognition.onerror = (event) => {
        console.error("Speech Error: ", event.error);
        document.getElementById('mic-btn').classList.remove('listening'); // Remove listening animation on error
    };
} else {
    console.log("Speech Recognition not supported in this browser.");
    document.getElementById('mic-btn').style.display = 'none';
}

const tx = document.getElementById('userInput');

tx.addEventListener("input", function() {
    // Reset height to calculate correctly
    this.style.height = 'auto'; 
    
    // Set new height based on scrollHeight
    // The 'Math.min' ensures it doesn't grow forever
    this.style.height = (this.scrollHeight) + 'px';
});

// Update your existing Enter key listener to handle the textarea
tx.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Shift+Enter allows new lines
        e.preventDefault();
        sendMessage();
        tx.style.height = 'auto'; // Reset height after sending
    }
});