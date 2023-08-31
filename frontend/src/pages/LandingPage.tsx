import { Button, Table } from "@mantine/core";
import { deleteQuestion, getQuestions } from "../services/QuestionsAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const queryClient = useQueryClient();
  
  const questionsQuery = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteQuestion(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });

  return (
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
        {questionsQuery.data?.map((question) => (
          <tr key={question.id}>
            <td>{question.id}</td>
            <td>
              <Link to={`/question/${question.id}`}>{question.title}</Link>
            </td>
            <td>{question.categories.join(",")}</td>
            <td>{question.complexity}</td>
            <td>
              <Button
                onClick={() => deleteQuestionMutation.mutate(question.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LandingPage;
