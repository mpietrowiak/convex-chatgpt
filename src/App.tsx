import { useState } from "react";
import "./App.css";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import ChatBubble from "./components/ChatBubble";

function App() {
  const [text, setText] = useState("");
  const messages = useQuery(api.messages.list) || [];
  const sendMessage = useAction(api.openai.chat);
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="overflow-y-scroll flex-1">
        <ul className="flex flex-col gap-4 items-start p-4">
          {/* {messages.map((message) => (
          <li tw="mx-auto" key={message.id}>
            {message.body}
          </li>
        ))} */}

          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              id={message.id}
              message={message.body}
              isUser={message.author === "user"}
            />
          ))}
        </ul>
      </div>

      <div className="flex border-t-2  p-3 gap-3 shadow-lg border-t-1 border-zinc-600">
        <input
          type="text"
          value={text}
          className="flex-1 rounded-lg p-4 h-10 outline-zinc-500 outline outline-1 focus:outline-cyan-500 transition-colors"
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={async () => {
            console.log(await sendMessage({ body: text }));
            setText("");
          }}
          className="rounded-lg h-10 px-4 py-0"
        >
          Send message
        </button>
      </div>
    </div>
  );
}

export default App;
