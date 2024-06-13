import { useState } from "react";
import "./App.css";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [text, setText] = useState("");
  const messages = useQuery(api.messages.list) || [];
  const sendMessage = useAction(api.openai.chat);
  return (
    <>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.body}</li>
        ))}
      </ul>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={async () => {
          console.log(await sendMessage({ body: text }));
          setText("");
        }}
      >
        Send message
      </button>
    </>
  );
}

export default App;
