const mongoose = require('mongoose');

const fileMetaSchema = new mongoose.Schema({
  userId: String,
  baseFilename: String,  // example: 'study-guide-12345.pdf'
  type: String,          // 'study_guide', 'cheatsheet', etc.
  firebasePath: String,  // path or public URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileMeta', fileMetaSchema);
