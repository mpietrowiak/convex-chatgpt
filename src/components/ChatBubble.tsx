import clsx from "clsx";
import Markdown from "react-markdown";

export interface ChatBubbleProps {
  id: string;
  message: string;
  isUser: boolean;
}

export default function ChatBubble(props: ChatBubbleProps) {
  return (
    <div
      key={props.id}
      className={clsx("bg-zinc-900 p-4 rounded-xl text-left ", {
        "self-end bg-cyan-600": props.isUser,
      })}
    >
      <Markdown>{props.message}</Markdown>
    </div>
  );
}
