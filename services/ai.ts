import OpenAI from 'openai';
import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'OPENAI_API_KEY';

// In-memory cache for performance (avoid async reads on every message)
let apiKey: string | null = null;

/**
 * Load API key from secure storage into memory.
 * Call this on app start before checking isConfigured().
 */
export async function loadApiKey(): Promise<string | null> {
  try {
    const storedKey = await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
    if (storedKey) {
      apiKey = storedKey;
    }
    return apiKey;
  } catch (error) {
    console.error('Failed to load API key from secure storage:', error);
    return null;
  }
}

/**
 * Save API key to secure storage and memory.
 */
export async function saveApiKey(key: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, key);
    apiKey = key;
  } catch (error) {
    console.error('Failed to save API key to secure storage:', error);
    throw error;
  }
}

/**
 * Clear API key from secure storage and memory.
 */
export async function clearApiKey(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
    apiKey = null;
  } catch (error) {
    console.error('Failed to clear API key from secure storage:', error);
    throw error;
  }
}

/**
 * @deprecated Use saveApiKey() instead for persistent storage.
 * This is kept for backwards compatibility but only sets in-memory.
 */
export function setApiKey(key: string) {
  apiKey = key;
}

export function getApiKey(): string | null {
  return apiKey;
}

export function isConfigured(): boolean {
  return apiKey !== null && apiKey.length > 0;
}

const SYSTEM_PROMPT = `You are VyraCoach, an expert AI fitness coach and training partner. Your role is to help users achieve their fitness goals with personalized advice, motivation, and support.

Your personality:
- Encouraging and positive, but not over-the-top
- Knowledgeable about fitness, nutrition, and recovery
- Direct and practical with advice
- You celebrate progress and help users push through challenges

Your capabilities:
- Create and suggest workout routines
- Provide form tips and exercise guidance
- Offer nutrition advice and meal suggestions
- Help with goal setting and tracking
- Provide motivation and accountability
- Suggest recovery and rest strategies

Guidelines:
- Keep responses concise (2-4 sentences usually)
- Be specific and actionable with advice
- Ask clarifying questions when needed
- Remember the user is training for a 5K (their current goal)
- Always prioritize safety - recommend consulting professionals for injuries or medical concerns

Current user context:
- Name: Alex
- Goal: Complete a 5K
- Focus: Running
- Level: Intermediate
- Current streak: 7 days`;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function sendMessage(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Required for React Native
  });

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Cost-effective and fast
    messages,
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
}
