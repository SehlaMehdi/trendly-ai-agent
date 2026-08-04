const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

// Helper function to create and display message bubbles
function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('bot-message');
    }

    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);

    // Keep chat view focused on the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle form submit when user clicks "Send" or hits Enter
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const messageText = userInput.value.trim();
    if (!messageText) return;

    // Display user's question in UI
    appendMessage('user', messageText);
    userInput.value = '';

    // Create temporary loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message');
    loadingDiv.textContent = 'Thinking...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Send request to our Express backend server
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();

        // Update placeholder with actual AI response
        if (data.reply) {
            loadingDiv.textContent = data.reply;
        } else {
            loadingDiv.textContent = 'Sorry, something went wrong. Please try again.';
        }
    } catch (error) {
        console.error('Error connecting to backend:', error);
        loadingDiv.textContent = 'Unable to reach backend server. Please ensure backend is running at http://localhost:3000.';
    }
});