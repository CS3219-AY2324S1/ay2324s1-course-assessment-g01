import { Button, Paper, Stack, Table, Title } from "@mantine/core";
import { useAttemptsQuery, useUserQuery } from "../hooks/queries";
import UsernameComponent from "../components/UsernameComponent";
import { FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
const UserProfilePage = () => {
  const { data: user } = useUserQuery();
  const { data: attempts } = useAttemptsQuery(user?.user_id!, {
    enabled: !!user,
  });

  return (
    <Stack>
      <Paper p={"sm"} bg={"dark"}>
        <UsernameComponent />
      </Paper>
      <Paper p={"sm"} bg={"dark"}>
        <Title>Problems Solved</Title>
        <Table striped>
          <thead>
            <tr>
              <th>Question Id</th>
              <th>Question Name</th>
              <th>Language</th>
              <th>Attemped On</th>
              <th>Passed</th>
            </tr>
          </thead>
          <tbody>
            {attempts?.map((attempt) => (
              <tr key={attempt.attempt_id}>
                <td>
                  <Button
                    variant="light"
                    component={Link}
                    to={`/question/${attempt.question_id}`}
                  >
                    {attempt.question_id}
                  </Button>
                </td>
                {/* TODO: change */}
                <td>Question Name</td>
                <td>{attempt.language}</td>
                <td>{attempt.attempted_on}</td>
                <td>
                  {attempt.passed ? (
                    <FaCircle style={{ color: "green" }} />
                  ) : (
                    <FaCircle style={{ color: "red" }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default UserProfilePage;
