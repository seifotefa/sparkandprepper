const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');
const bucket = require('../firebase');
const { sendToGemini } = require('../services/gemini');

const router = express.Router();

// Ensure tmp directory exists
const tmpDir = path.join(__dirname, '../tmp');
fs.mkdir(tmpDir, { recursive: true }).catch(console.error);

router.post('/generate', async (req, res) => {
  const { baseFilename, mode } = req.body;
  
  if (!baseFilename || !mode) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required parameters: baseFilename and mode' 
    });
  }

  const fileId = `${baseFilename}-${mode}-${Date.now()}.pdf`;
  const tempSourcePath = path.join(tmpDir, `source-${Date.now()}.pdf`);
  const tempOutputPath = path.join(tmpDir, fileId);

  try {
    console.log(`🔄 Generating ${mode} from ${baseFilename}`);

    // Download source PDF
    console.log('📥 Downloading source PDF...');
    const sourceFile = bucket.file(`results/${baseFilename}`);
    const [exists] = await sourceFile.exists();
    
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Source file not found'
      });
    }

    await sourceFile.download({
      destination: tempSourcePath
    });

    // Read and parse the PDF
    console.log('📄 Parsing PDF content...');
    const sourceBuffer = await fs.readFile(tempSourcePath);
    const pdfData = await pdfParse(sourceBuffer);

    // Generate new content with Gemini
    console.log(`🧠 Generating ${mode} content...`);
    const generatedContent = await sendToGemini(pdfData.text, mode);

    // Create new PDF
    console.log('📝 Creating new PDF...');
    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage([612, 792]); // Standard US Letter size
    const fontSize = 12;
    const margin = 50;
    const lineHeight = 20;
    const textWidth = 512; // Page width minus margins
    let y = 792 - margin; // Start from top margin

    // Add title
    const title = mode.replace(/_/g, ' ').toUpperCase();
    currentPage.drawText(title, {
      x: margin,
      y: y,
      size: 20,
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });
    y -= lineHeight * 2;

    // Add content
    const textLines = generatedContent.split('\n');
    const regularFont = await pdfDoc.embedFont('Helvetica');

    for (const line of textLines) {
      if (y < margin + lineHeight) {
        currentPage = pdfDoc.addPage([612, 792]);
        y = 792 - margin;
      }

      currentPage.drawText(line.trim(), {
        x: margin,
        y,
        size: fontSize,
        font: regularFont,
        maxWidth: textWidth,
        lineHeight
      });
      y -= lineHeight;
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(tempOutputPath, pdfBytes);

    // Upload to Firebase
    console.log('☁️ Uploading to Firebase...');
    const destination = `generated/${mode}/${fileId}`;
    await bucket.upload(tempOutputPath, {
      destination,
      metadata: {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000',
        metadata: {
          sourceFile: baseFilename,
          mode,
          timestamp: Date.now()
        }
      }
    });

    // Make file public
    const generatedFile = bucket.file(destination);
    await generatedFile.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('✅ Generated content available at:', publicUrl);

    // Clean up temp files
    await Promise.all([
      fs.unlink(tempSourcePath),
      fs.unlink(tempOutputPath)
    ]);

    return res.json({
      success: true,
      mode,
      file: destination,
      url: publicUrl,
      sourceFile: baseFilename,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('❌ Generate route error:', error);
    
    // Clean up temp files in case of error
    try {
      await Promise.all([
        fs.unlink(tempSourcePath).catch(() => {}),
        fs.unlink(tempOutputPath).catch(() => {})
      ]);
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to generate content',
      details: error.message
    });
  }
});

// Get generation status
router.get('/status/:fileId', async (req, res) => {
  try {
    const file = bucket.file(`generated/${req.params.fileId}`);
    const [exists] = await file.exists();

    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Generated file not found'
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
    console.error('Error checking generation status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check generation status',
      details: error.message
    });
  }
});

module.exports = router;
