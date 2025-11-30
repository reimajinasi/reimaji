import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export const aiModel = openrouter(process.env.AI_MODEL || 'google/gemini-2.5-flash');
