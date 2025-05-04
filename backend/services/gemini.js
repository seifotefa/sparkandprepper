const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in .env file');
  console.error('Please create a .env file in the backend directory with:');
  console.error('GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize model with Gemini 2.0 Flash
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

async function generateContent(prompt) {
  try {
    console.log('Generating content with Gemini 2.0 Flash...');
    
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const response = await result.response;
    
    if (!response.text()) {
      throw new Error('Empty response from Gemini 2.0 Flash');
    }
    
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

async function sendToGemini(content, mode) {
  try {
    let prompt;
    switch (mode) {
      case 'study_guide':
        prompt = `Create a comprehensive study guide from the following content. Format it with clear sections, bullet points, and highlight key concepts, definitions, and examples:

Content:
${content}

Please format the study guide with:
- Clear section headings
- Bullet points for key concepts
- Important definitions in bold
- Examples where relevant
- Summary points at the end`;
        break;

      case 'practice_exam':
        prompt = `Create a practice exam with 10 multiple choice questions based on this content:

Content:
${content}

Format as:
Question 1: [Question text]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Correct Answer: [Letter]
Explanation: [Brief explanation]

[Repeat for all 10 questions]`;
        break;

      case 'flashcards':
        prompt = `Create 10 flashcards from this content. Each flashcard should focus on a key concept, definition, or important fact:

Content:
${content}

Format as:
Card 1:
Q: [Clear, concise question]
A: [Direct, comprehensive answer]

[Repeat for all 10 cards]`;
        break;

      case 'summary':
        prompt = `Create a concise summary of the key points from this content:

Content:
${content}

Please include:
- Main concepts and ideas
- Key relationships between concepts
- Important definitions
- Notable examples or applications`;
        break;

      default:
        prompt = `Analyze and explain this content in a clear and organized way:

Content:
${content}

Please provide:
- Main points and key takeaways
- Important concepts and definitions
- Examples where relevant
- Logical organization of ideas`;
    }

    return await generateContent(prompt);
  } catch (error) {
    console.error('Error in sendToGemini:', error);
    throw new Error(`Failed to generate ${mode}: ${error.message}`);
  }
}

// Test the model connection
async function testConnection() {
  try {
    console.log('Testing Gemini 2.0 Flash connection...');
    const result = await generateContent('Hello, please confirm you are working.');
    if (result) {
      console.log('✅ Gemini 2.0 Flash connected successfully');
    } else {
      console.warn('⚠️ Unexpected response from Gemini 2.0 Flash');
    }
  } catch (error) {
    console.error('❌ Gemini 2.0 Flash connection failed:', error);
    throw error;
  }
}

// Run the test on startup
testConnection().catch(error => {
  console.error('Failed to initialize Gemini service:', error);
  process.exit(1);
});

module.exports = {
  sendToGemini,
  generateContent
}; 