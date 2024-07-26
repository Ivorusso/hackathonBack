import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly model;

  constructor() {
    const apiKey = 'AIzaSyAOMOOGrP9emnRHOiUSoltjfdYOZ_96msY'
    if (!apiKey) {
      throw new Error('API key is not defined');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeMessage(message: string): Promise<string> {
    try {
      const prompt = `
      You are a customer support agent responding to a client's message. The following is a conversation history. Analyze the tone of the most recent client message and generate at least two appropriate responses that you (the customer support agent) might give. Responses should be polite, helpful, and professional, and should address the client's concerns or emotions effectively. 
      
      Conversation history:
      ${message}
      
      Please provide your responses below, each on a new line. Make sure to include at least one response that aims to calm the client if they are upset, and another that addresses the issue or provides a solution if the client is seeking help.
      `;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      
      this.logger.log(`Response from AI: ${text}`);
      
      return text;
    } catch (error) {
      this.logger.error(`Error analyzing message: ${error.message}`, error.stack);
      throw error;
    }
  }
}


