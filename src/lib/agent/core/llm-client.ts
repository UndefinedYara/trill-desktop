import { GoogleGenAI, GenerateContentConfig } from "@google/genai";

export interface LLMClientOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  systemInstruction?: string;
  tools?: Record<any, any>[];
}

export class LLMClient {
  private ai: GoogleGenAI;
  public defaultModel: string;
  private defaultConfig: GenerateContentConfig;

  constructor(options: LLMClientOptions = {}) {
    // If apiKey is omitted, the SDK automatically looks for process.env.GEMINI_API_KEY
    this.ai = new GoogleGenAI(options.apiKey ? { apiKey: options.apiKey } : {});
    this.defaultModel = options.model || "gemini-3.1-flash-lite";

    // Centralize your default configuration
    this.defaultConfig = {
      temperature: options.temperature ?? 0.7,
      systemInstruction: options.systemInstruction,
      tools: options.tools,
    };
  }

  private buildConfig(
    overrides?: GenerateContentConfig,
  ): GenerateContentConfig {
    return {
      ...this.defaultConfig,
      ...overrides,
    };
  }

  async generateStream(
    contents: any, // Accepts string or an array of standard Content objects
    configOverrides?: GenerateContentConfig,
  ) {
    const config = this.buildConfig(configOverrides);
    return await this.ai.models.generateContentStream({
      model: this.defaultModel,
      contents: contents,
      config: config,
    });
  }

  async generate(
    prompt: string,
    configOverrides?: GenerateContentConfig,
  ): Promise<string> {
    const config = this.buildConfig(configOverrides);

    const response = await this.ai.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config: config,
    });

    return response.text || "";
  }

  startChat(configOverrides?: GenerateContentConfig) {
    const config = this.buildConfig(configOverrides);

    return this.ai.chats.create({
      model: this.defaultModel,
      config: config,
    });
  }
}
