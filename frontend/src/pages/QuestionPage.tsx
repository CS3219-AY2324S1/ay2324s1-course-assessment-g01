import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../services/QuestionsAPI";
import { useParams } from "react-router-dom";
import { Text, Title } from "@mantine/core";

const QuestionPage = () => {
  const { id } = useParams();
  const { data, isError } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(parseInt(id!)),
  });

  return (
    <section>
      <Title>
        {data?.id}. {data?.title}
      </Title>
      <Text>{isError ? "Not found" : data?.description}</Text>
    </section>
  );
};

export default QuestionPage;
