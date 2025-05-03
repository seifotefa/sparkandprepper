const axios = require('axios');
require('dotenv').config();

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function sendToGemini(text, mode = 'study_guide') {
  const prompt = getPromptForMode(text, mode);
  console.log(`🧠 Sending to Gemini [${mode}]`);

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        timeout: 30000, // 30 seconds timeout
      }
    );

    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Gemini API request timed out');
    } else {
      console.error('❌ Gemini API Error:', error.response?.data || error.message);
    }

    throw new Error('Failed to communicate with Gemini API');
  }
}

function getPromptForMode(text, mode) {
  switch (mode) {
    case 'chat_ai':
      return `You are an AI tutor trained only on the following course material. Answer questions naturally like a tutor.\nMaterial:\n${text}`;

    case 'practice_exam':
      return `From the material below, generate a 5-question practice exam:\n- Include MCQs and short answers\n- Include correct answers\nMaterial:\n${text}`;

    case 'cheatsheet':
      return `Extract a condensed cheat sheet from the following material:\n- Key formulas\n- Definitions\n- Bullet points\n- Common tips/pitfalls\nMaterial:\n${text}`;

    case 'flashcards':
      return `Create at least 10 flashcards from this content. Each should include:\n- A question (MCQ or short answer)\n- An answer\n- (Optional) A hint\nMaterial:\n${text}`;

    case 'study_guide':
    default:
      return `Analyze the following material and return:\n- A summary\n- Key concepts\n- Common pitfalls\n- Suggested practice topics\nMaterial:\n${text}`;
  }
}

module.exports = { sendToGemini };
