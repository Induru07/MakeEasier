/* --- 1. MOUSE TRACKING (The "Look At" Effect) --- */
document.addEventListener('mousemove', (e) => {
    const pupils = document.querySelectorAll('.pupil');
    
    pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        // Get center of the eye socket
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle to mouse
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        
        // Limit movement radius (so pupil stays in white part)
        const distance = 6; 

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        // Move pupil
        pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
});

/* --- 2. UI TOGGLES --- */
function toggleChat() {
    const win = document.getElementById('chat-window');
    const isVisible = win.style.display === 'flex';
    win.style.display = isVisible ? 'none' : 'flex';
}

function finalizeBooking() {
    alert("✅ Appointment Confirmed! (Data saved to DB)");
    document.getElementById('confirm-card').style.display = 'none';
    appendMessage("The appointment has been secured, Your Highness.", 'bot');
}

/* --- 3. CHAT LOGIC --- */
async function sendMessage() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg) return;

    // Add user message
    appendMessage(msg, 'user');
    input.value = '';
    
    // Hide confirm card if it was open
    document.getElementById('confirm-card').style.display = 'none';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        const data = await response.json();
        appendMessage(data.response, 'bot');

        // Show confirm button if AI says so
        if (data.show_confirm) {
            document.getElementById('confirm-card').style.display = 'block';
        }
    } catch (error) {
        appendMessage("Error: Could not reach the Royal Server.", 'bot');
        console.error(error);
    }
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerText = text;
    const messages = document.getElementById('messages');
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

/* --- 4. VOICE TYPING --- */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = document.getElementById('mic-btn');

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => { micBtn.classList.add('recording'); };
    recognition.onend = () => { micBtn.classList.remove('recording'); };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
    };

    window.toggleVoice = function() {
        if (micBtn.classList.contains('recording')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };
} else {
    micBtn.style.display = 'none'; // Hide mic if not supported
    console.log("Voice typing not supported in this browser.");
}

// Allow pressing "Enter" to send
document.getElementById('userInput').addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});