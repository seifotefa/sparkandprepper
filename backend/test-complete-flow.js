const fs = require('fs');
const path = require('path');
const bucket = require('./firebase');
const { sendToGemini } = require('./services/gemini');

async function testCompleteFlow() {
  try {
    console.log('🚀 Testing complete upload and generate flow...');

    // 1. Create a test PDF
    const testPdfPath = path.join(__dirname, 'test-upload.pdf');
    const testContent = '%PDF-1.4\nTest content for study guide generation\n%%EOF';
    fs.writeFileSync(testPdfPath, testContent);
    console.log('📄 Created test PDF');

    // 2. Upload to Firebase Storage
    const uploadDestination = 'uploads/test-upload.pdf';
    await bucket.upload(testPdfPath, {
      destination: uploadDestination,
      metadata: {
        contentType: 'application/pdf',
      },
      public: true,
    });

    const uploadUrl = `https://storage.googleapis.com/${bucket.name}/${uploadDestination}`;
    console.log('⬆️ Uploaded to Firebase:', uploadUrl);

    // 3. Generate study guide
    const studyGuideContent = await sendToGemini(testContent, 'study_guide');
    const studyGuideText = studyGuideContent?.candidates?.[0]?.content?.parts?.[0]?.text || 'Test study guide content';
    
    // 4. Save study guide to Firebase
    const studyGuidePath = path.join(__dirname, 'test-study-guide.pdf');
    fs.writeFileSync(studyGuidePath, studyGuideText);
    
    const studyGuideDestination = `public/results/study_guide_${Date.now()}.pdf`;
    await bucket.upload(studyGuidePath, {
      destination: studyGuideDestination,
      metadata: {
        contentType: 'application/pdf',
      },
      public: true,
    });

    const studyGuideUrl = `https://storage.googleapis.com/${bucket.name}/${studyGuideDestination}`;
    console.log('📚 Created study guide:', studyGuideUrl);

    // Clean up local files
    fs.unlinkSync(testPdfPath);
    fs.unlinkSync(studyGuidePath);

    // List all files in storage
    console.log('\n📋 Current files in storage:');
    const [files] = await bucket.getFiles();
    files.forEach(file => {
      console.log(`- ${file.name}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCompleteFlow(); 