const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

async function testDirect() {
  try {
    console.log('Testing direct AI call...');
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Say hello"
    });
    console.log('Response:', response.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testDirect();