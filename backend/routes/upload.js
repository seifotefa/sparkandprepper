const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const bucket = require('../firebase');
const { sendToGemini } = require('../services/gemini');
const PDFDocument = require('pdfkit');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  console.log("📥 Upload route hit");

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    // Read the PDF content
    const fileBuffer = await fs.readFile(filePath);
    const mode = req.query.mode || 'study_guide';
    
    // Send to Gemini
    console.log('🧠 Sending to Gemini...', mode);
    const geminiResponse = await sendToGemini(fileBuffer.toString(), mode);
    const text = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Generate study guide PDF
    const timestamp = Date.now();
    const studyGuideFileName = `study_guide_${timestamp}.pdf`;
    const studyGuidePath = path.join(__dirname, '../tmp', studyGuideFileName);

    // Create PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(studyGuidePath);
    doc.pipe(writeStream);
    doc.fontSize(14).text(text, { align: 'left' });
    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Upload to Firebase with public access
    const destination = `public/results/${studyGuideFileName}`;
    await bucket.upload(studyGuidePath, {
      destination: destination,
      metadata: {
        contentType: 'application/pdf',
      },
      public: true
    });

    // Make it public and get direct download URL
    await bucket.file(destination).makePublic();
    const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

    // Clean up local files
    await fs.unlink(filePath);
    await fs.unlink(studyGuidePath);

    return res.json({ 
      file: studyGuideFileName,
      downloadUrl: downloadUrl
    });

  } catch (err) {
    console.error("🔥 Upload route error:", err);
    try {
      await fs.unlink(filePath);
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
    return res.status(500).json({ error: 'Error processing file' });
  }
});

module.exports = router;
