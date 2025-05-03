const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/upload');
const path = require('path');
require('dotenv').config();

const app = express(); // ✅ Moved to the top before anything else

app.use(cors()); // ✅ Enable CORS for all routes
app.use(express.json());

// Serve static files from /public (for test.html etc.)
app.use(express.static(path.join(__dirname, 'public')));

// File upload route
app.use('/api/upload', uploadRoute);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
