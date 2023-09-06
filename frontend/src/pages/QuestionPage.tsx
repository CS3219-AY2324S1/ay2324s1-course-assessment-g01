import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../services/QuestionsAPI";
import { useParams } from "react-router-dom";
import { Text, Title, LoadingOverlay, Paper } from "@mantine/core";

const QuestionPage = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(id!),
  });

  return (
    <section style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data && (
        <>
          <Title mb="md">
            {data._id}: {data.title}
          </Title>
          <Paper withBorder p="md">
            <Title order={2}>Description</Title>
            <Text component="pre" style={{ whiteSpace: "pre-wrap" }}>
              {data.description}
            </Text>
          </Paper>
        </>
      )}
      {isError && <Text>{"Error: Not found"}</Text>}
    </section>
  );
};

export default QuestionPage;
