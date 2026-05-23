import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

console.log("API KEY:", process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
  try {
    console.log("Sending request...");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Explain photosynthesis simply.'
        }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    console.log("\nResponse:\n");

    console.log(
      completion.choices[0]?.message?.content
    );

  } catch (error) {
    console.error("\nERROR:\n");
    console.error(error);
  }
}

testGroq();