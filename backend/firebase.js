require('dotenv').config();
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('./firebaseKey.json');

if (!process.env.FIREBASE_STORAGE_BUCKET) {
  console.error('ERROR: FIREBASE_STORAGE_BUCKET is not set in .env file');
  console.error('Please create a .env file in the backend directory with:');
  console.error('FIREBASE_STORAGE_BUCKET=gs://sparkandprepper-25830.firebasestorage.app');
  process.exit(1);
}

// Initialize Firebase Admin with the correct bucket
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'sparkandprepper-25830.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// Test the connection
bucket.exists().then(([exists]) => {
  if (exists) {
    console.log('✅ Firebase Storage connected');
  } else {
    console.error('❌ Bucket does not exist:', bucket.name);
  }
}).catch(err => {
  console.error('❌ Firebase Storage error:', err);
});

// Export the bucket for use in other files
module.exports = bucket; 