const bucket = require('./firebase');
const fs = require('fs');
const path = require('path');

async function setupFirebaseStorage() {
  try {
    console.log('🚀 Starting Firebase Storage setup...');

    // Test directories we need
    const directories = [
      'generated/',
      'public/results/',
      'uploads/'
    ];

    // Create a test PDF file
    const testPdfContent = '%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF';
    const testPdfPath = path.join(__dirname, 'test.pdf');
    fs.writeFileSync(testPdfPath, testPdfContent);

    console.log('📁 Creating directory structure...');

    // Upload test files to each directory
    for (const dir of directories) {
      const testFile = {
        source: testPdfPath,
        destination: `${dir}test-file.pdf`,
      };

      try {
        await bucket.upload(testFile.source, {
          destination: testFile.destination,
          metadata: {
            contentType: 'application/pdf',
          },
          public: true,
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${testFile.destination}`;
        console.log(`✅ Created ${dir} - Test file available at: ${publicUrl}`);
      } catch (err) {
        console.error(`❌ Error creating ${dir}:`, err.message);
      }
    }

    // Clean up local test file
    fs.unlinkSync(testPdfPath);
    console.log('\n✨ Setup complete! Check Firebase Console to verify the structure.');

    // List all files in the bucket
    console.log('\n📋 Current files in storage:');
    const [files] = await bucket.getFiles();
    files.forEach(file => {
      console.log(`- ${file.name}`);
    });

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupFirebaseStorage(); 