import { Button, Center, Loader, Table, Text } from "@mantine/core";
import { deleteQuestion, getQuestions } from "../services/QuestionsAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import WelcomeComponent from "../components/WelcomeComponent";

const LandingPage = () => {
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

  return (
    <section>
      <WelcomeComponent />
      <Button component={Link} to="/create">
        Create new question
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Question Id</th>
            <th>Title</th>
            <th>Category</th>
            <th>Complexity</th>
            <th>Delete</th>
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
              <td>
                <Button
                  onClick={() => deleteQuestionMutation.mutate(question._id)}
                  loading={deleteQuestionMutation.isLoading}
                >
                  Delete
                </Button>
              </td>
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
