import {
  Button,
  Dialog,
  Flex,
  Loader,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useInterval } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Actions,
  matchingMessage,
  matchingServiceURL,
} from "../services/MatchingAPI";
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
  const [isTimeOut, setIsTimeOut] = useState(false);
  const webSocketRef = useRef<WebSocket | undefined>(undefined);
  const difficultyRef = useRef<string>("");
  const [opened, { toggle, close }] = useDisclosure(false);
  const nav = useNavigate();

  const closeMatching = useCallback(() => {
    if (webSocketRef.current?.readyState == 1) {
      webSocketRef.current?.send(
        matchingMessage(
          user?.user_id,
          Actions.cancel,
          difficultyRef.current,
          jwt,
        ),
      );
    }
  }, [jwt, user, difficultyRef]);

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
    if (webSocketRef.current) closeMatching();
    webSocketRef.current = soc;
    difficultyRef.current = diff;

    soc.addEventListener("open", () => {
      soc.send(matchingMessage(user?.user_id, Actions.start, diff, jwt));
    });

    type MatchResponse = {
      room_id: number;
      question: Question;
      error?: string;
    };

    soc.addEventListener("message", (event) => {
      try {
        const parsedData: MatchResponse = JSON.parse(event.data);
        if (parsedData.room_id != undefined) {
          soc.close();          
          nav(`/collab/${parsedData.room_id}`, {
            state: { question: parsedData.question },
          });
        } else if (parsedData.error == "") {
          // Change this when the cancel reply is updated
          soc.close();
        }
      } catch (e) {
        console.log(e);
      }
    });

    soc.addEventListener("error", (event) => {
      console.log(`error: ${event}`);
    });

    // Initialise states for matching and start timer
    if (!opened) toggle();
    setIsTimeOut(false);
    setTimer(0);
    interval.start();
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
          <Stack>
            {DIFFICULTIES.map((diff) => (
              <Button key={diff} onClick={() => matchMaking(diff)}>
                {diff}
              </Button>
            ))}
          </Stack>
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
            <Button onClick={() => matchMaking(difficultyRef.current)}>
              Retry
            </Button>
          )}
        </Flex>
      </Dialog>
    </section>
  );
};

export default MatchingComponent;
