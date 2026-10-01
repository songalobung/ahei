/**
 * AHEI Careers AI Provider Pool Configuration
 * Provider failover order:
 * 1. Cloudflare Workers AI
 * 2. Groq
 * 3. Google AI Studio / Gemini
 * 4. Cerebras
 * 5. OpenRouter (:free model)
 * 6. Local Grounded Knowledge Fallback
 */

export interface AIProviderConfig {
  id: string;
  name: string;
  endpoint: string | ((env: NodeJS.ProcessEnv) => string);
  model: string;
  envKey: string;
  type: 'openai_compatible' | 'gemini' | 'cloudflare';
  headers?: (env: NodeJS.ProcessEnv) => Record<string, string>;
  formatPayload: (systemPrompt: string, userMessage: string, model: string) => Record<string, any>;
  parseResponse: (data: any) => string | null;
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  // 1. Cloudflare Workers AI
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    envKey: 'CLOUDFLARE_API_TOKEN',
    model: '@cf/meta/llama-3.1-8b-instruct',
    type: 'cloudflare',
    endpoint: (env) =>
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID || ''}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
    headers: (env) => ({
      Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    }),
    formatPayload: (systemPrompt, userMessage) => ({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
    }),
    parseResponse: (data) => {
      if (data?.result?.response) return data.result.response.trim();
      return null;
    },
  },

  // 2. Groq Cloud
  {
    id: 'groq',
    name: 'Groq Cloud',
    envKey: 'GROQ_API_KEY',
    model: 'qwen/qwen3.8-27b',
    type: 'openai_compatible',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    headers: (env) => ({
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    }),
    formatPayload: (systemPrompt, userMessage, model) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.2,
    }),
    parseResponse: (data) => {
      const content = data?.choices?.[0]?.message?.content;
      return content ? content.trim() : null;
    },
  },

  // 3. Google AI Studio / Gemini
  {
    id: 'gemini',
    name: 'Google AI Studio (Gemini)',
    envKey: 'GEMINI_API_KEY',
    model: 'gemini-3.8-flash',
    type: 'gemini',
    endpoint: (env) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${env.GEMINI_API_KEY || ''}`,
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    formatPayload: (systemPrompt, userMessage) => ({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.2,
      },
    }),
    parseResponse: (data) => {
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? text.trim() : null;
    },
  },

  // 4. Cerebras
  {
    id: 'cerebras',
    name: 'Cerebras Inference',
    envKey: 'CEREBRAS_API_KEY',
    model: 'llama3.1-8b',
    type: 'openai_compatible',
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    headers: (env) => ({
      Authorization: `Bearer ${env.CEREBRAS_API_KEY}`,
      'Content-Type': 'application/json',
    }),
    formatPayload: (systemPrompt, userMessage, model) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.2,
    }),
    parseResponse: (data) => {
      const content = data?.choices?.[0]?.message?.content;
      return content ? content.trim() : null;
    },
  },

  // 5. OpenRouter (:free model)
  {
    id: 'openrouter',
    name: 'OpenRouter (Free Tier)',
    envKey: 'OPENROUTER_API_KEY',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    type: 'openai_compatible',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    headers: (env) => ({
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://ahei-index.org',
      'X-Title': 'AHEI African Higher Education Index',
      'Content-Type': 'application/json',
    }),
    formatPayload: (systemPrompt, userMessage, model) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.2,
    }),
    parseResponse: (data) => {
      const content = data?.choices?.[0]?.message?.content;
      return content ? content.trim() : null;
    },
  },
];
