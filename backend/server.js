const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure dotenv reads .env from the root directory regardless of where you start the server
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const chatRoutes = require('./routes/chatRoutes');

// Safely locate and load groqService to prevent module-not-found crashes
let groqService;
const possiblePaths = [
    './groqService', 
    './services/groqService', 
    '../groqService', 
    '../services/groqService'
];

for (const servicePath of possiblePaths) {
    try {
        groqService = require(servicePath);
        break;
    } catch (err) {
        // Continue searching if path is not found
    }
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend assets cleanly from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', chatRoutes);

// --- ENDPOINT TO CLEAR CHAT MEMORY ---
app.post('/api/clear-chat', (req, res) => {
    if (groqService) {
        if (typeof groqService.clearSession === 'function') {
            groqService.clearSession();
        } else if (typeof groqService.clearHistory === 'function') {
            groqService.clearHistory();
        }
    }
    res.json({ success: true, message: 'Chat memory cleared' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running cleanly!' });
});

// Root route fallback to serve frontend UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});