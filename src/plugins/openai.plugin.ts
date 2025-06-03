import { AIInstance, AIOptions } from "@/api/interfaces/aiModels"
import { OpenAI } from "openai"

class Openai implements AIInstance {
  private apiKey: string | null = null
  private instance: OpenAI | null = null
  private defaultModel: string

  constructor(options: AIOptions = {}) {
    this.defaultModel = options.defaultModel || 'gpt-4o-mini'
  }

  /**
   * Set the API key for OpenAI
   * @param apiKey The API key from the company database
   */
  setApiKey(apiKey: string): void {
    if (!apiKey) {
      console.warn('OpenAI API key is empty or invalid')
      return
    }

    try {
      this.apiKey = apiKey
      this.instance = new OpenAI({ apiKey: this.apiKey, dangerouslyAllowBrowser: true })
    } catch (error) {
      console.error('Error initializing OpenAI API:', error)
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
   * Generate content using the OpenAI API
   * @param prompt The text prompt to send to OpenAI
   * @returns The generated text response
   */
  async generateContent(prompt: string): Promise<string> {
    if (!this.isApiKeySet()) {
      throw new Error('OpenAI API key not set. Make sure to call setApiKey with a valid API key first.')
    }

    try {
      // Usar la librería directamente en el frontend según la API de OpenAI
      const response = await this.instance!.chat.completions.create({
        model: this.defaultModel,
        messages: [{ role: 'user', content: prompt }],
      })

      if (!response || !response.choices[0].message.content) {
        throw new Error('No response received from OpenAI API')
      }

      return response.choices[0].message.content
    } catch (error) {
      console.error('Error generating content with OpenAI:', error)
      throw error
    }
  }
}

export default Openai