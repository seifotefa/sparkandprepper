const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const bucket = require('./firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

async function generateContent(prompt) {
  try {
    console.log('📝 Generating content...');
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    const text = response.text();
    if (!text || text.trim() === '') {
      console.warn('⚠️ Empty content generated!');
      throw new Error('Generated content is empty');
    }
    return text;
  } catch (error) {
    console.error('❌ Error generating content:', error);
    throw error;
  }
}

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('❌ Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

async function createPDF(content, type) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const timestamp = Date.now();
      const fileName = `${type}_${timestamp}.pdf`;
      const tmpPath = path.join(__dirname, 'tmp', fileName);

      const writeStream = fs.createWriteStream(tmpPath);
      doc.pipe(writeStream);
      doc.fontSize(12).text(content, { align: 'left', lineGap: 5 });
      doc.end();

      writeStream.on('finish', () => resolve({ tmpPath, fileName }));
      writeStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

async function uploadToFirebase(filePath, userId, type) {
  try {
    const timestamp = Date.now();
    const fileName = path.basename(filePath);
    const destination = `users/${userId}/${type}/${fileName}`;
    console.log(`⬆️ Uploading to Firebase → ${destination}`);

    await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: 'application/pdf',
        metadata: { userId, type, timestamp }
      }
    });

    await bucket.file(destination).makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log(`✅ Uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Firebase upload error:', error);
    throw error;
  }
}

// MAIN route to process PDF
app.post('/api/process-pdf', upload.single('pdf'), async (req, res) => {
  let tempFiles = [];
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file uploaded' });
    }

    const userId = req.user?.id || 'anonymous';
    const text = await extractTextFromPDF(req.file.buffer);

    // Study Guide
    const studyGuidePrompt = `Create a comprehensive study guide with:
- Table of contents
- Main concepts + explanations
- Key terms bolded
- Examples
- Summary
Content:\n${text}`;
    const studyGuide = await generateContent(studyGuidePrompt);
    const studyGuidePDF = await createPDF(studyGuide, 'study_guide');
    tempFiles.push(studyGuidePDF.tmpPath);
    const studyGuideUrl = await uploadToFirebase(studyGuidePDF.tmpPath, userId, 'study_guide');

    // Mock Exam
    const mockExamPrompt = `Create a 10-question multiple choice mock exam from this content. Include explanations for each answer.\nContent:\n${text}`;
    const mockExam = await generateContent(mockExamPrompt);
    const mockExamPDF = await createPDF(mockExam, 'mock_exam');
    tempFiles.push(mockExamPDF.tmpPath);
    const mockExamUrl = await uploadToFirebase(mockExamPDF.tmpPath, userId, 'mock_exam');

    // Cheat Sheet
    const cheatSheetPrompt = `Create a concise cheat sheet with key concepts, formulas, important keywords, and short explanations.\nContent:\n${text}`;
    const cheatSheet = await generateContent(cheatSheetPrompt);
    const cheatSheetPDF = await createPDF(cheatSheet, 'cheat_sheet');
    tempFiles.push(cheatSheetPDF.tmpPath);
    const cheatSheetUrl = await uploadToFirebase(cheatSheetPDF.tmpPath, userId, 'cheat_sheet');

    // Flashcards (return as plain text)
    const flashcardsPrompt = `Create 10 flashcards from this content in format:
"Q: question text\nA: answer text"
Separate each flashcard with two newlines.\nContent:\n${text}`;
    const flashcardsText = await generateContent(flashcardsPrompt);
    const flashcardsPDF = await createPDF(flashcardsText, 'flashcards');
    tempFiles.push(flashcardsPDF.tmpPath);
    await uploadToFirebase(flashcardsPDF.tmpPath, userId, 'flashcards');

    console.log('🎉 All study materials created!');

    res.json({
      success: true,
      studyGuide: studyGuideUrl,
      mockExam: mockExamUrl,
      cheatSheet: cheatSheetUrl,
      flashcards: flashcardsText, // ✅ raw text sent for frontend flashcard logic
      message: 'Study materials generated successfully'
    });

  } catch (error) {
    console.error('❌ Error in /api/process-pdf:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    for (const file of tempFiles) {
      try { if (fs.existsSync(file)) fs.unlinkSync(file); }
      catch (err) { console.error('Temp cleanup error:', err); }
    }
  }
});

// Chatbot endpoint
app.post('/api/ask-gemini', async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question || !context) {
      return res.status(400).json({
        success: false,
        error: 'Missing question or context in request body.'
      });
    }

    console.log(`🔍 Received question: "${question}"`);

    const examples = `
EXAMPLES:
Q: What is photosynthesis?
A: Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create glucose and oxygen.

Q: Define osmosis.
A: Osmosis is the movement of water molecules across a semipermeable membrane from a low solute concentration to a high solute concentration.

Q: What is Newton's second law?
A: Newton's second law states that force equals mass times acceleration (F = ma).

Q: Explain mitosis.
A: Mitosis is the process of cell division that results in two identical daughter cells from a single parent cell.

Q: What is the Pythagorean theorem?
A: The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.

Q: Define democracy.
A: Democracy is a form of government in which power is vested in the people, who rule either directly or through freely elected representatives.

Q: What is an ecosystem?
A: An ecosystem is a community of living organisms interacting with each other and their physical environment.

Q: Explain gravity.
A: Gravity is the force of attraction between two objects with mass.

Q: What is an atom?
A: An atom is the smallest unit of matter that retains the properties of an element.

Q: Define photosynthesis equation.
A: The photosynthesis equation is 6CO2 + 6H2O + sunlight → C6H12O6 + 6O2.
`;

    const prompt = `
You are a helpful study guide chatbot. Use the examples below to answer in a similar style.

${examples}

STUDY GUIDE CONTENT:
${context}

QUESTION:
${question}

Answer clearly in 1-3 sentences.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const response = await result.response;
    const answer = response.text();

    if (!answer || answer.trim() === '') {
      console.warn('⚠️ AI returned empty response!');
      return res.status(500).json({
        success: false,
        error: 'AI did not return a valid answer.'
      });
    }

    console.log(`✅ Answer generated: ${answer}`);

    return res.json({
      success: true,
      answer: answer.trim()
    });

  } catch (error) {
    console.error('❌ Error in /api/ask-gemini:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your question.'
    });
  }
});

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// List study guides
app.get('/api/list-study-guides', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const studyGuides = files.filter(f => f.name.includes('study_guide'));
    const sorted = studyGuides.sort((a, b) => new Date(b.metadata.timeCreated) - new Date(a.metadata.timeCreated));
    const latest = sorted[0];
    const url = latest ? `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(latest.name)}` : null;
    res.json({
      latestFile: latest ? latest.name.split('/').pop().replace('.pdf', '') : null,
      url,
      allFiles: sorted.map(f => ({
        name: f.name,
        url: `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(f.name)}`,
        timeCreated: f.metadata.timeCreated
      }))
    });
  } catch (error) {
    console.error('❌ Error listing study guides:', error);
    res.status(500).json({ error: 'Failed to list study guides', details: error.message });
  }
});

// Debug
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

const requiredDirs = ['tmp'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Firebase bucket: ${bucket.name}`);
});

process.on('unhandledRejection', (err) => console.error('❌ Unhandled Rejection:', err));
process.on('uncaughtException', (err) => console.error('❌ Uncaught Exception:', err));
