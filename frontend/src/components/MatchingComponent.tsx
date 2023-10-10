import { Button, Dialog, Flex, Loader, Popover, Text } from "@mantine/core";
import { useDisclosure, useInterval, useTimeout } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchingServiceURL } from "../services/MatchingAPI";
import { User } from "../types/User";

interface Props {
  user : User | undefined;
  jwt : string | null;
}

const MatchingComponent = ({user, jwt} : Props) => {
  const [ webSocket, setWebSocket ] = useState<WebSocket | undefined>(undefined);
  const [opened, {toggle, close}] = useDisclosure(false);
  const [ timer, setTimer ] = useState(0);
  const nav = useNavigate();

  const matchMaking = (diff : string) => {
    const soc = new WebSocket(matchingServiceURL);
    if (webSocket) webSocket!.close();
    setWebSocket(soc);
    if (!opened) toggle();
    soc.addEventListener("open", () => {
      soc.send(JSON.stringify({
        "user_id": user?.user_id,
        "action": "Start",
        "difficulty": diff,
        "jwt": jwt
      }));
    })

    soc.addEventListener("message", (event) => {
      console.log(event.data);
      // Current way to parse the matching success format
      // matched_user:3,room_id:4
      let parsedData = event.data.split(',');
      if (parsedData.length > 1) {
        parsedData = parsedData.map((x : string) => x.split(':'));
        console.log(parsedData);
        nav(`/collab/${parsedData[1][1]}`);
      }
    })

    soc.addEventListener("error", (event) => {
      console.log(`error: ${event}`);
    })

    return () => {
      soc.close();
    };
  }
  
  const matchTimeout = () => {
    console.log("Timeout");
    webSocket?.close();
    close();
  }
  
  const interval = useInterval(() => setTimer(t => t + 1), 1000);
  const { start, clear } = useTimeout(matchTimeout, 30.5 * 1000);
  const difficulties = ["Easy", "Medium", "Hard"];

  return (
    <section>
      <Popover position="bottom" shadow="md">
      <Popover.Target>
        <Button>Collaborate</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Flex direction="column">
        {
          difficulties.map((diff) => (
          <Button key={diff}
            onClick={() => {
            matchMaking(diff);
            setTimer(0);
            start();
            interval.start();
            }}>
            {diff}
          </Button>
          ))
        }
        </Flex>
      </Popover.Dropdown>
      </Popover>
      <Dialog opened={opened} onClose={close} size="lg" radius="md">
        <Flex direction={"row"} justify="space-between">
        <Text size="sm" mb="xs" weight={500}>
          {`Matching you with another user...   ${timer}s`}
        </Text>
        <Loader/>
        </Flex>
        <Button>
          Cancel matchmaking
        </Button>
      </Dialog>
    </section>
  )
}

export default MatchingComponent;