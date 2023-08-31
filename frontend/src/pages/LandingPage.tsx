import { Table } from "@mantine/core";
import { getQuestions } from "../services/QuestionsAPI";

const LandingPage = () => {
  const questions = getQuestions();
  return (
    <Table>
      <thead>
        <tr>
          <th>Question Id</th>
          <th>Title</th>
          <th>Category</th>
          <th>Complexity</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <tr key={question.id}>
            <td>{question.id}</td>
            <td>{question.title}</td>
            <td>{question.categories.join(",")}</td>
            <td>{question.complexity}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LandingPage;
