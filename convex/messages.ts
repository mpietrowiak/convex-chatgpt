import { Id } from "./_generated/dataModel";
import { query, mutation, internalMutation } from "./_generated/server";

export const list = query(async (ctx) => {
  return await ctx.db.query("messages").collect();
});

export const send = mutation(async (ctx, { body }) => {
  const r = await ctx.db.insert("messages", {
    body,
    author: "user",
  });
  const botMessageId = await ctx.db.insert("messages", {
    author: "assistant",
  });
  const messages = await ctx.db
    .query("messages")
    .order("desc")
    .filter((q) => q.neq(q.field("body"), undefined))
    .take(21);
  messages.reverse();
  return { messages, botMessageId };
});

// An `internalMuation` can only be called from other server functions.
export const update = mutation(async (ctx, { messageId, patch }) => {
  await ctx.db.patch(messageId as Id<string>, patch as Partial<any>);
});
