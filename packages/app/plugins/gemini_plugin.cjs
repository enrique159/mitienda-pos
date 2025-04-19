const { GoogleGenAI } = require("@google/genai")
const env = require("../../env.json")
const googleAIKey = env.GOOGLE_AI_KEY

const ai = new GoogleGenAI({ apiKey: googleAIKey })

exports.main = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works",
  })
  console.log(response.text)
}
