const bucket = require('./firebase');
const fs = require('fs');
const path = require('path');

async function testFirebase() {
  try {
    // Create a test file
    const testFile = path.join(__dirname, 'test.txt');
    fs.writeFileSync(testFile, 'Hello Firebase!');

    // Upload to Firebase
    console.log('Uploading test file...');
    const upload = await bucket.upload(testFile, {
      destination: 'test.txt',
      public: true,
      metadata: {
        contentType: 'text/plain',
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/test.txt`;
    console.log('✅ Upload successful!');
    console.log('Public URL:', publicUrl);

    // Clean up
    fs.unlinkSync(testFile);
    console.log('Local test file cleaned up');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFirebase(); 