import { Badge, Input, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import * as Y from "yjs";

export type ChatMessage = {
  message: string;
  userId: number;
};
const ChatComponent = ({
  chatlog,
  id,
}: {
  chatlog: Y.Array<ChatMessage>;
  id: number;
}) => {
  const [chatlogState, setchatlogState] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  useEffect(() => {
    const set = () => setchatlogState(chatlog.toArray());
    chatlog.observe(set);
    return () => chatlog.unobserve(set);
  }, [chatlog]);

  return (
    <Stack justify="space-between" style={{ flex: 1, minHeight: 0 }}>
      <Title size={"h2"}>Chat</Title>
      <Stack style={{ overflow: "auto", flex: 1, minHeight: 0 }}>
        {chatlogState.map((message) => (
          <Badge
            mih={24}
            style={{
              alignSelf: id === message.userId ? "flex-end" : "flex-start",
            }}
            bg={id === message.userId ? "blue" : ""}
          >
            {message.message}
          </Badge>
        ))}
      </Stack>
      <div>
        <Input
          placeholder="Send a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.currentTarget.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter" && currentMessage != "") {
              setCurrentMessage("");
              chatlog.push([{ userId: id, message: currentMessage }]);
            }
          }}
        />
      </div>
    </Stack>
  );
};

export default ChatComponent;
