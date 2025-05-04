const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const PDFDocument = require('pdfkit');
const pdfParse = require('pdf-parse');
const bucket = require('../firebase');
const { sendToGemini } = require('../services/gemini');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Ensure tmp directory exists
const tmpDir = path.join(__dirname, '../tmp');
fs.mkdir(tmpDir, { recursive: true }).catch(console.error);

router.post('/', upload.single('file'), async (req, res) => {
  console.log("📥 Upload route hit");

  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      error: 'No file uploaded' 
    });
  }

  try {
    // Extract text from PDF
    console.log('📄 Extracting text from PDF...');
    const pdfData = await pdfParse(req.file.buffer);
    const mode = req.query.mode || 'study_guide';
    
    // Send to Gemini
    console.log('🧠 Sending to Gemini...', mode);
    const generatedContent = await sendToGemini(pdfData.text, mode);

    // Generate result PDF
    const timestamp = Date.now();
    const resultFileName = `${mode}_${timestamp}.pdf`;
    const resultPath = path.join(tmpDir, resultFileName);

    // Create PDF
    console.log('📝 Creating PDF...');
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(resultPath);
    
    doc.pipe(writeStream);

    // Add title
    doc.fontSize(20)
       .text(mode.replace('_', ' ').toUpperCase(), {
         align: 'center',
         underline: true
       })
       .moveDown();

    // Add content
    doc.fontSize(12)
       .text(generatedContent, {
         align: 'left',
         lineGap: 5
       });

    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Upload to Firebase
    console.log('☁️ Uploading to Firebase...');
    const destination = `results/${mode}/${resultFileName}`;
    await bucket.upload(resultPath, {
      destination,
      metadata: {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000',
        metadata: {
          originalName: req.file.originalname,
          timestamp: timestamp,
          mode: mode
        }
      }
    });

    // Make the file publicly accessible
    const file = bucket.file(destination);
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('✅ Generated content available at:', publicUrl);

    // Clean up temporary file
    await fs.unlink(resultPath);

    return res.json({ 
      success: true,
      mode,
      file: destination,
      url: publicUrl,
      originalName: req.file.originalname,
      timestamp
    });

  } catch (error) {
    console.error("🔥 Upload route error:", error);
    return res.status(500).json({ 
      success: false,
      error: 'Error processing file',
      details: error.message
    });
  }
});

// Get upload status
router.get('/status/:filename', async (req, res) => {
  try {
    const file = bucket.file(`results/${req.params.filename}`);
    const [exists] = await file.exists();

    if (!exists) {
      return res.status(404).json({ 
        success: false,
        error: 'File not found' 
      });
    }

    const [metadata] = await file.getMetadata();
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 // 1 hour
    });

    res.json({
      success: true,
      url,
      metadata
    });

  } catch (error) {
    console.error('Error checking file status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check file status',
      details: error.message
    });
  }
});

module.exports = router;
