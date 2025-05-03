// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage, uploadBytes } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCtzCeVA9rVfrOOMnlLDYmzub9E9rV-7ME",
//   authDomain: "sparkandprepper.firebaseapp.com",
//   projectId: "sparkandprepper",
//   storageBucket: "sparkandprepper.firebasestorage.app",
//   messagingSenderId: "870954180131",
//   appId: "1:870954180131:web:c251500924002598115b96",
//   measurementId: "G-RBMNQ8ZNHY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const storage = getStorage(app);
// const storageRef = ref(storage);


// const imagesRef = ref(storage, 'images');

// // Create a reference to 'images' folder in Firebase Storage
// // const imagesRef = ref(storage, 'images/');

// // uploadBytes(imagesRef, file).then((snapshot) => {
// //   console.log('Uploaded a blob or file!', snapshot);
// // });


const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize storage
const storage = new Storage({
  keyFilename: path.join(__dirname, 'firebaseKey.json'),
  projectId: 'sparkandprepper-25830'
});

// Update with your exact bucket name from the Firebase Console
const bucketName = 'sparkandprepper-25830.firebasestorage.app';
const bucket = storage.bucket(bucketName);

// Test the connection
bucket.exists().then(([exists]) => {
  if (exists) {
    console.log('✅ Firebase Storage connected');
  } else {
    console.error('❌ Bucket does not exist:', bucketName);
  }
}).catch(err => {
  console.error('❌ Firebase Storage error:', err);
});

module.exports = bucket;


