import OpenAI from 'openai';

let openai;

// Function to get completion using OpenAI API
export async function getCompletion(prompt, apiKey) {
  // Initialize OpenAI if not already done
  if (!openai) {
    openai = new OpenAI({
      apiKey: apiKey
    });
  }

  // Create chat completion with specified parameters
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert programmer that writes clear, concise, and helpful code comments."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2048
  });

  // Return the completed message content
  return completion.choices[0].message.content;
}