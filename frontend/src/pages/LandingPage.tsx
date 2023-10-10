import { Button, Center, Loader, Table, Text, Flex, Popover, Dialog } from "@mantine/core";
import { deleteQuestion, getQuestions } from "../services/QuestionsAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import WelcomeComponent from "../components/WelcomeComponent";
import { User } from "../types/User";
import { isAdmin } from "../utils/userUtils";
import { getUserData } from "../services/UserAPI";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import MatchingComponent from "../components/MatchingComponent";

const LandingPage = () => {
  const { jwt } = useContext(UserContext);
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

  return (
    <section>
      <WelcomeComponent />
      <Flex justify="space-between">
        {user && isAdmin(user) && (
          <Button component={Link} to="/create">
            Create new question
          </Button>
        )}
        <MatchingComponent user={user} jwt={jwt}/>
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
      {(isLoading || isRefetching) && (
        <Center>
          <Loader />
        </Center>
      )}
    </section>
  );
};

export default LandingPage;
