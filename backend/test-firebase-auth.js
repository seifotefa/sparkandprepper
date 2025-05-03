const admin = require('firebase-admin');
const path = require('path');

async function testFirebaseStorage() {
  try {
    // Initialize Firebase Admin with service account
    const serviceAccount = require('./firebaseKey.json');
    console.log('✅ Service account loaded');
    console.log('Project ID:', serviceAccount.project_id);
    
    // Use the correct bucket name
    const bucketName = 'sparkandprepper-25830.firebasestorage.app';
    
    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucketName
    });
    console.log('✅ Firebase Admin initialized');
    console.log('Attempting to connect to bucket:', bucketName);
    
    const bucket = admin.storage().bucket();
    const [exists] = await bucket.exists();
    console.log('Bucket exists:', exists);
    
    if (exists) {
      console.log('\nListing files...');
      const [files] = await bucket.getFiles();
      console.log('Files found:', files.length);
      files.forEach(file => console.log('-', file.name));
    } else {
      console.error('\n❌ Bucket not found. Please check:');
      console.error('1. Firebase Storage is enabled in Firebase Console');
      console.error('2. Service account has Storage Admin or Storage Object Viewer role');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

// Run the test
testFirebaseStorage(); 