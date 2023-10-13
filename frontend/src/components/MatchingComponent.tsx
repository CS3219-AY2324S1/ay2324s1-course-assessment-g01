import { Button, Dialog, Flex, Loader, Popover, Text } from "@mantine/core";
import { useDisclosure, useInterval } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchingServiceURL } from "../services/MatchingAPI";
import { User } from "../types/User";
import { Question } from "../types/Question";

interface Props {
  user: User | undefined;
  jwt: string | null;
}

const MatchingComponent = ({ user, jwt }: Props) => {
  const TIME_OUT_DURATION = 30;
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];

  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<string>("");
  const [isTimeOut, setIsTimeOut] = useState(false);
  const webSocketRef = useRef<WebSocket | undefined>(undefined);
  const [opened, { toggle, close }] = useDisclosure(false);
  const nav = useNavigate();

  const closeMatching = useCallback(() => {
    webSocketRef.current?.send(
      JSON.stringify({
        user_id: user?.user_id,
        action: "Stop",
        jwt: jwt,
      }),
    );
    webSocketRef.current?.close();
  }, [jwt, user]);

  const matchTimeout = () => {
    console.log("Timeout");
    interval.stop();
    closeMatching();
    setIsTimeOut(true);
  };

  const interval = useInterval(() => {
    setTimer((t) => {
      if (t >= TIME_OUT_DURATION) matchTimeout();
      return t + 1;
    });
  }, 1000);

  const matchMaking = (diff: string) => {
    const soc = new WebSocket(matchingServiceURL);
    if (webSocketRef.current) webSocketRef.current?.close();
    webSocketRef.current = soc;
    setDifficulty(diff);
    if (!opened) toggle();
    soc.addEventListener("open", () => {
      soc.send(
        JSON.stringify({
          user_id: user?.user_id,
          action: "Start",
          difficulty: diff,
          jwt: jwt,
        }),
      );
    });

    type MatchResponse = {
      room_id: number;
      question: Question;
    };

    soc.addEventListener("message", (event) => {
      try {
        const data: MatchResponse = JSON.parse(event.data);
        console.log(data);
        if (data.room_id)
          nav(`/collab/${data.room_id}`, {
            state: { question: data.question },
          });
      } catch (e) {
        console.log(e);
      }
    });

    soc.addEventListener("error", (event) => {
      console.log(`error: ${event}`);
    });

    // Initialise states for matching and start timer
    setIsTimeOut(false);
    setTimer(0);
    interval.start();

    return () => {
      soc.close();
    };
  };

  // For clean up purposes
  useEffect(() => {
    return () => {
      closeMatching();
    };
  }, [closeMatching, user]);

  return (
    <section>
      {/* This is the buttons to start matching service */}
      <Popover position="bottom" shadow="md">
        <Popover.Target>
          <Button>Collaborate</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Flex direction="column">
            {DIFFICULTIES.map((diff) => (
              <Button key={diff} onClick={() => matchMaking(diff)}>
                {diff}
              </Button>
            ))}
          </Flex>
        </Popover.Dropdown>
      </Popover>
      {/* This is the dialog that will appear at the bottom with the matching status */}
      <Dialog opened={opened} onClose={close} size="lg" radius="md">
        <Flex direction={"row"} justify="space-between">
          <Text size="sm" mb="xs" weight={500}>
            {isTimeOut
              ? "The connection has timed out"
              : `Matching you with another user...   ${timer}s`}
          </Text>
          {!isTimeOut && <Loader />}
        </Flex>
        <Flex direction={"row"} justify="space-between">
          <Button
            onClick={() => {
              closeMatching();
              close();
            }}
          >
            Cancel
          </Button>
          {isTimeOut && (
            <Button onClick={() => matchMaking(difficulty)}>Retry</Button>
          )}
        </Flex>
      </Dialog>
    </section>
  );
};

export default MatchingComponent;
