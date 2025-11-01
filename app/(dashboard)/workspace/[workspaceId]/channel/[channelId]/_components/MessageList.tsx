import { MessageItem } from "./message/MessageItem";

const messages = [
  {
    id: 1,
    message: "Hello world",
    date: new Date(),
    avatar: "https://avatars.githubusercontent.com/u/76267404?v=4",
    name: "John Doe",
  },
];
export function MessageList() {
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {messages.map((msg) => (
          <MessageItem key={msg.id} {...msg} />
        ))}
      </div>
    </div>
  );
}
