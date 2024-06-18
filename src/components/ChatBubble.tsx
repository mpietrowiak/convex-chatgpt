import clsx from "clsx";
import { memo } from "react";
import Markdown from "react-markdown";

export interface ChatBubbleProps {
  id: string;
  message: string;
  isUser: boolean;
}

function ChatBubble(props: ChatBubbleProps) {
  console.log("render chatbubble", props);

  return (
    <div
      key={props.id}
      className={clsx("p-4 rounded-xl text-left ", {
        "self-end bg-cyan-600": props.isUser,
        "self-start bg-zinc-900": !props.isUser,
      })}
    >
      <Markdown>{props.message}</Markdown>
    </div>
  );
}

export default memo(ChatBubble);
