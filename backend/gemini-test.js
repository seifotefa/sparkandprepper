require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function testGemini() {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            { text: 'Say hello in a fun way' }
          ]
        }
      ]
    });

    console.log("✅ Gemini API Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Gemini API Error:");
    console.error(error.response?.data || error.message);
  }
}

testGemini();
