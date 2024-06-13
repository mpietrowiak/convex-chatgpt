"use node";
import OpenAI from "openai";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const chat = action(async (ctx, { body }) => {
  if (typeof body !== "string") {
    throw new Error("Message body is required");
  }
  const { messages, botMessageId } = await ctx.runMutation(api.messages.send, {
    body,
  });
  const fail = async (reason: any) => {
    throw new Error(reason);
  };
  // Grab the API key from environment variables
  // Specify this in your dashboard: `npx convex dashboard`
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    await fail("Add your OPENAI_API_KEY as an env variable");
  }
  const openai = new OpenAI({ apiKey });

  const openaiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: body as string,
      },
    ],
  });
  console.log("OpenAI response: " + JSON.stringify(openaiResponse, null, 2));
  const response = openaiResponse.choices[0].message.content;
  console.log("Response: " + response);

  await ctx.runMutation(api.messages.update, {
    messageId: botMessageId,
    patch: {
      body: response,
      // Track how many tokens we're using for various messages
      usage: openaiResponse.usage?.completion_tokens,
      updatedAt: Date.now(),
    },
  });
});
