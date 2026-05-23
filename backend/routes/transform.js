console.log("USING GROQ TRANSFORM ROUTE");  
import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

function getGroqClient() {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

const PROMPTS = {
  adhd: `You are an ADHD-friendly content adapter.
Rewrite the given text into:
- Short chunks of max 2 sentences each
- Start each chunk with an action verb
- Add one relevant emoji per chunk
- End with a one-line "Quick Win" summary
Be energetic and direct.`,

  dyslexia: `You are a dyslexia-friendly content adapter.
Rewrite the given text:
- Use short sentences
- Simple words only
- One idea per sentence
- Add spacing between lines.`,

  autism: `You are an autism-friendly content adapter.
Rewrite the content:
- Use literal explanations
- Avoid metaphors
- Use numbered steps
- Be concrete and predictable.`,

  narrative: `You are a story-based learning designer.
Turn the educational content into a short engaging story with a student named Alex.`
};

async function transformText(text, profileKey) {
  const prompt = PROMPTS[profileKey];

  const groq = getGroqClient();

const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: text
      }
    ],
    model: 'llama-3.3-70b-versatile',
  });

  return completion.choices[0]?.message?.content;
}

router.post('/transform', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'No text provided'
      });
    }

    const [adhd, dyslexia, autism, narrative] =
      await Promise.all([
        transformText(text, 'adhd'),
        transformText(text, 'dyslexia'),
        transformText(text, 'autism'),
        transformText(text, 'narrative'),
      ]);

    res.json({
      adhd,
      dyslexia,
      autism,
      narrative
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

export default router;