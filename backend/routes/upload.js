const express = require('express');
const multer = require('multer');
const fs = require('fs');
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
    const dataBuffer = fs.readFileSync(filePath);
    const mode = req.query.mode || 'study_guide';
    
    // Send to Gemini
    console.log('🧠 Sending to Gemini...', mode);
    const geminiResponse = await sendToGemini(dataBuffer.toString(), mode);
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
        cacheControl: 'public, max-age=31536000',
      },
      public: true
    });

    // Make the file publicly accessible
    const file = bucket.file(destination);
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('✅ Study guide available at:', publicUrl);

    // Clean up local files
    fs.unlinkSync(filePath);
    fs.unlinkSync(studyGuidePath);

    return res.json({ 
      file: `results/${studyGuideFileName}`,
      url: publicUrl
    });

  } catch (err) {
    console.error("🔥 Upload route error:", err);
    return res.status(500).json({ error: 'Error processing file' });
  }
});

module.exports = router;
