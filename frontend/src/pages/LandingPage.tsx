import { Button, Center, Loader, Table, Text, Flex, Popover, Dialog } from "@mantine/core";
import { deleteQuestion, getQuestions } from "../services/QuestionsAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import WelcomeComponent from "../components/WelcomeComponent";
import { User } from "../types/User";
import { isAdmin } from "../utils/userUtils";
import { getUserData } from "../services/UserAPI";
import { matchingServiceURL } from "../services/MatchingAPI";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { useDisclosure, useInterval, useTimeout } from "@mantine/hooks";

const LandingPage = () => {
  const { jwt } = useContext(UserContext);
  const [ webSocket, setWebSocket ] = useState<WebSocket | undefined>(undefined);
  const [opened, {toggle, close}] = useDisclosure(false);
  const [ timer, setTimer ] = useState(0);
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: questions,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteQuestion(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });

  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
  });

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
      <WelcomeComponent />
      <Flex justify="space-between">
        {user && isAdmin(user) && (
          <Button component={Link} to="/create">
            Create new question
          </Button>
        )}
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
      </Flex>
      <Table>
        <thead>
          <tr>
            <th>Question Id</th>
            <th>Title</th>
            <th>Category</th>
            <th>Complexity</th>
            {user && isAdmin(user) && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {questions?.map((question) => (
            <tr key={question._id}>
              <td>{question._id}</td>
              <td>
                <Text to={`/question/${question._id}`} component={Link}>
                  {question.title}
                </Text>
              </td>
              <td>{question.categories.join(",")}</td>
              <td>{question.complexity}</td>
              {user && isAdmin(user) && (
                <td>
                  <Button
                    onClick={() => deleteQuestionMutation.mutate(question._id)}
                    loading={deleteQuestionMutation.isLoading}
                  >
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
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
      {(isLoading || isRefetching) && (
        <Center>
          <Loader />
        </Center>
      )}
    </section>
  );
};

export default LandingPage;
