import { Hono } from 'hono';
import OpenAI from 'openai';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.js';
import { checkSubscription } from '../middleware/subscription.js';

const app = new Hono();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TranslateSchema = z.object({
  text: z.string().min(1).max(1000),
  from: z.string().length(2),
  to: z.string().length(2),
});

// AI Translation - Premium feature
app.post('/', authMiddleware, checkSubscription, async (c) => {
  try {
    const body = await c.req.json();
    const { text, from, to } = TranslateSchema.parse(body);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text from ${from} to ${to}. 
                    Provide only the translation, nothing else. 
                    Keep the tone and style of the original text.
                    If the text contains idioms or expressions, translate them to equivalent expressions in the target language.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });
    
    const translation = completion.choices[0]?.message?.content?.trim();
    
    if (!translation) {
      return c.json({ error: 'Translation failed' }, 500);
    }
    
    return c.json({ translation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request', details: error.errors }, 400);
    }
    console.error('Translation error:', error);
    return c.json({ error: 'Translation failed' }, 500);
  }
});

// Get translation suggestions (example sentences)
app.post('/suggest', authMiddleware, checkSubscription, async (c) => {
  try {
    const { sentence, targetLanguage } = await c.req.json();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a language learning assistant. Given a sentence, provide:
                    1. A natural translation
                    2. A brief grammar note (if relevant)
                    3. 2-3 similar useful sentences in ${targetLanguage}
                    
                    Respond in JSON format:
                    {
                      "translation": "...",
                      "grammarNote": "...",
                      "similarSentences": ["...", "..."]
                    }`,
        },
        {
          role: 'user',
          content: sentence,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });
    
    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    return c.json(result);
  } catch (error) {
    console.error('Suggestion error:', error);
    return c.json({ error: 'Failed to get suggestions' }, 500);
  }
});

export { app as translateRoutes };
