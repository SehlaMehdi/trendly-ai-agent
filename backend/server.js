const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure dotenv reads .env from the root directory regardless of where you start the server
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend assets cleanly from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', chatRoutes);

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
