const bucket = require('./firebase');
const fs = require('fs');
const path = require('path');

async function testStorageSetup() {
  try {
    console.log('🚀 Testing Firebase Storage setup...');

    // Create a test PDF file
    const testContent = '%PDF-1.4\nTest content\n%%EOF';
    const testFile = path.join(__dirname, 'test.pdf');
    fs.writeFileSync(testFile, testContent);

    // Test directories and their test files
    const tests = [
      { dir: 'uploads/', file: 'test-upload.pdf' },
      { dir: 'public/results/', file: 'study_guide_test.pdf' },
      { dir: 'generated/cheatsheets/', file: 'test-cheatsheet.pdf' },
      { dir: 'generated/flashcards/', file: 'test-flashcards.pdf' },
      { dir: 'generated/practice_exams/', file: 'test-exam.pdf' }
    ];

    for (const test of tests) {
      try {
        const destination = test.dir + test.file;
        console.log(`📤 Uploading to ${destination}...`);
        await bucket.upload(testFile, {
          destination: destination,
          metadata: {
            contentType: 'application/pdf'
          }
        });
        console.log(`✅ Successfully uploaded to ${destination}`);
      } catch (err) {
        console.error(`❌ Error uploading to ${test.dir}:`, err.message);
      }
    }

    // Clean up local test file
    fs.unlinkSync(testFile);

    // List all files in storage
    console.log('\n📋 Current files in storage:');
    const [files] = await bucket.getFiles();
    files.forEach(file => {
      console.log(`- ${file.name}`);
    });

  } catch (error) {
    console.error('❌ Setup test failed:', error);
    console.error(error);
  }
}

testStorageSetup(); 