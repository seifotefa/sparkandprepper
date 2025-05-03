const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Firebase bucket
const bucket = require('./firebase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const uploadRoute = require('./routes/upload');
const generateRoute = require('./routes/generate');

// Study guides listing endpoint
app.get('/api/list-study-guides', async (req, res) => {
  try {
    console.log('📂 Fetching study guides from Firebase...');

    // List all files in the bucket
    const [files] = await bucket.getFiles();
    console.log('All files found:', files.map(f => f.name));

    // Filter for study guide PDFs
    const studyGuides = files.filter(file =>
      file.name.includes('study_guide_') &&
      file.name.endsWith('.pdf') &&
      !file.name.endsWith('/.keep')
    );

    console.log('Study guides found:', studyGuides.map(f => f.name));

    if (!studyGuides || studyGuides.length === 0) {
      console.log('❌ No study guides found');
      return res.status(404).json({
        error: 'No study guides found',
        message: 'Please upload a PDF first to generate a study guide.'
      });
    }

    // Sort by creation time (newest first)
    const sortedGuides = studyGuides.sort((a, b) => {
      return new Date(b.metadata.timeCreated) - new Date(a.metadata.timeCreated);
    });

    // Get the most recent file
    const latestFile = sortedGuides[0];
    const latestFileName = latestFile.name
      .split('/')
      .pop() // Get just the filename
      .replace('.pdf', ''); // Remove .pdf extension

    // Generate the correct Firebase Storage URL
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(latestFile.name)}?alt=media`;

    console.log('✅ Latest study guide found:', latestFileName);
    console.log('📄 Public URL:', publicUrl);

    res.json({
      latestFile: latestFileName,
      url: publicUrl,
      allFiles: sortedGuides.map(f => ({
        name: f.name,
        url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(f.name)}?alt=media`,
        timeCreated: f.metadata.timeCreated
      }))
    });
  } catch (error) {
    console.error('❌ Error listing study guides:', error);
    res.status(500).json({
      error: 'Failed to list study guides',
      details: error.message
    });
  }
});

// Debug endpoint to list all files in Firebase
app.get('/api/debug/files', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.json({
      bucketName: bucket.name,
      files: files.map(f => ({
        name: f.name,
        timeCreated: f.metadata.timeCreated,
        size: f.metadata.size,
        url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(f.name)}?alt=media`
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mount routes
app.use('/api/upload', uploadRoute);
app.use('/api', generateRoute);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/htmltests', express.static(path.join(__dirname, 'htmltests')));

// Create required directories if they don't exist
const requiredDirs = ['public', 'public/results', 'tmp'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!require('fs').existsSync(dirPath)) {
    require('fs').mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

// Add this route to check file status
app.post('/api/check-file-status', async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Get the file from Firebase Storage
    const file = bucket.file(filename);
    const [exists] = await file.exists();

    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get the public URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });

    res.json({ url });
  } catch (error) {
    console.error('Error checking file status:', error);
    res.status(500).json({ error: 'Failed to check file status' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Firebase bucket: ${bucket.name}`);
});

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
