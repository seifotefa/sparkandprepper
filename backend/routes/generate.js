const express = require('express');
const fs = require('fs');
const path = require('path');
const bucket = require('../firebase');
const { sendToGemini } = require('../services/gemini');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { baseFilename, mode } = req.body;
  if (!baseFilename || !mode) {
    return res.status(400).json({ error: 'Missing parameters.' });
  }

  const fileId = `${baseFilename}-${mode}.pdf`;
  const tmpDir = path.join(__dirname, '../tmp');

  try {
    // Ensure tmp directory exists
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Get the study guide content
    const studyGuideFile = bucket.file(`public/results/${baseFilename}.pdf`);
    const tempStudyGuidePath = path.join(tmpDir, 'temp-study-guide.pdf');
    
    await studyGuideFile.download({
      destination: tempStudyGuidePath
    });

    // Read and parse the PDF
    const dataBuffer = fs.readFileSync(tempStudyGuidePath);
    const pdfData = await pdfParse(dataBuffer);
    const studyText = pdfData.text;

    // Generate new content
    console.log('🧠 Sending to Gemini [' + mode + ']');
    const geminiResp = await sendToGemini(studyText, mode);
    const text = geminiResp?.candidates?.[0]?.content?.parts?.[0]?.text || 'No content';

    // Create new PDF
    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage();
    const fontSize = 12;
    const textLines = text.split('\n');
    const yStart = 750;
    let y = yStart;

    for (const line of textLines) {
      if (y < 50) {
        currentPage = pdfDoc.addPage();
        y = yStart;
      }
      currentPage.drawText(line, { x: 50, y: y -= 20, size: fontSize });
    }

    // Save and upload new PDF
    const pdfBytes = await pdfDoc.save();
    const tmpPdfPath = path.join(tmpDir, fileId);
    fs.writeFileSync(tmpPdfPath, pdfBytes);

    // Upload to Firebase with public access
    const destination = `generated/${mode}s/${fileId}`;
    await bucket.upload(tmpPdfPath, {
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
    console.log('✅ Feature generated at:', publicUrl);

    // Clean up temp files
    fs.unlinkSync(tmpPdfPath);
    fs.unlinkSync(tempStudyGuidePath);

    return res.json({ url: publicUrl });
  } catch (err) {
    console.error("❌ Error in generate route:", err);
    return res.status(500).json({ error: 'Failed to generate PDF.' });
  }
});

module.exports = router;
