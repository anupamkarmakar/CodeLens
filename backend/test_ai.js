const { GoogleGenAI } = require("@google/genai");

async function test() {
  try {
    console.log('Testing Google GenAI...');
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    console.log('GoogleGenAI instance created');
    console.log('Available methods:', Object.getOwnPropertyNames(ai));
    console.log('Available models methods:', Object.getOwnPropertyNames(ai.models || {}));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();