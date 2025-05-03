const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { sendToGemini } = require('../services/gemini');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  console.log("📥 Upload route hit");

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    const mode = req.query.mode || 'study_guide';
    const geminiResponse = await sendToGemini(extractedText, mode);

    const text = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const resultsDir = path.join(__dirname, '../public/results');
    if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

    const filename = `${Date.now()}.txt`;
    const outputPath = path.join(resultsDir, filename);

    fs.writeFileSync(outputPath, text, 'utf8');
    fs.unlinkSync(filePath);

    console.log(`✅ Saved result at: ${outputPath}`);
    res.json({ file: `results/${filename}` }); // Relative to 'public/'
  } catch (err) {
    console.error("🔥 Upload route error:", err);
    res.status(500).json({ error: 'Error processing file' });
  }
});

module.exports = router;
