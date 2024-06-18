import { useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import ChatBubble from "./components/ChatBubble";

// async function handleGptResponse(
//   onUpdate: (update: string) => void,
//   requestBody: { messageId: Id<"messages">; messages: Doc<"messages">[] }
// ) {
//   const convexSiteUrl = import.meta.env.VITE_CONVEX_URL.replace(
//     /\.cloud$/,
//     ".site"
//   );
//   const response = await fetch(`${convexSiteUrl}/chat`, {
//     method: "POST",
//     body: JSON.stringify(requestBody),
//     headers: { "Content-Type": "application/json" },
//   });
//   // Taken from https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
//   const responseBody = response.body;

//   const reader = responseBody?.getReader();
//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) {
//       onUpdate(new TextDecoder().decode(value));
//       return;
//     }
//     onUpdate(new TextDecoder().decode(value));
//   }
// }

function App() {
  const [text, setText] = useState("");
  const messages = useQuery(api.messages.list) || [];
  const sendMessage = useAction(api.openai.chat);

  const messagesBottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesBottomRef.current?.scrollIntoView();
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="overflow-y-scroll flex-1">
        <ul className="flex flex-col gap-4 items-start p-4">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              id={message.id}
              message={message.body}
              isUser={message.author === "user"}
            />
          ))}
          <div ref={messagesBottomRef}></div>
        </ul>
      </div>

      <div>
        <form
          className="flex border-t-2  p-3 gap-3 shadow-lg border-t-1 border-zinc-600"
          onSubmit={async (e) => {
            e.preventDefault();
            setText("");
            await sendMessage({ body: text });
          }}
        >
          <input
            type="text"
            value={text}
            className="flex-1 rounded-lg p-4 h-10 outline-zinc-500 outline outline-1 focus:enabled:outline-cyan-500 transition-colors"
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="rounded-lg h-10 px-4 py-0"
            disabled={text.length === 0}
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
