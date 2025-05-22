import { App, Plugin } from 'vue'
import { GoogleGenAI } from '@google/genai'
import { AIInstance, AIOptions } from '@/api/interfaces/aiModels'

class Gemini implements AIInstance {
  private apiKey: string | null = null
  private instance: GoogleGenAI | null = null
  private defaultModel: string

  constructor(options: AIOptions = {}) {
    this.defaultModel = options.defaultModel || 'gemini-2.5-flash'
  }

  /**
   * Set the API key for Google Gemini
   * @param apiKey The API key from the company database
   */
  setApiKey(apiKey: string): void {
    if (!apiKey) {
      console.warn('Gemini API key is empty or invalid')
      return
    }

    try {
      this.apiKey = apiKey
      this.instance = new GoogleGenAI({ apiKey: this.apiKey })
      console.log('Gemini API initialized successfully')
    } catch (error) {
      console.error('Error initializing Gemini API:', error)
      this.apiKey = null
      this.instance = null
    }
  }

  /**
   * Check if the API key has been set
   */
  isApiKeySet(): boolean {
    return !!this.apiKey && !!this.instance
  }

  /**
   * Generate content using the Gemini API
   * @param prompt The text prompt to send to Gemini
   * @returns The generated text response
   */
  async generateContent(prompt: string): Promise<string> {
    if (!this.isApiKeySet()) {
      throw new Error('Gemini API key not set. Make sure to call setApiKey with a valid API key first.')
    }

    try {
      // Usar la librería directamente en el frontend según la API de @google/genai
      const response = await this.instance!.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
      })

      if (!response || !response.text) {
        throw new Error('No response received from Gemini API')
      }

      return response.text
    } catch (error) {
      console.error('Error generating content with Gemini:', error)
      throw error
    }
  }
}

export default Gemini