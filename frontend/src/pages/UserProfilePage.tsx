import { Button, Grid, Paper, Stack, Table, Title } from "@mantine/core";
import {
  useAttemptsQuery,
  useCollabsQuery,
  useUserQuery,
} from "../hooks/queries";
import UsernameComponent from "../components/UsernameComponent";
import { FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import ChangePassword from "../components/ChangePassword";
import StatsComponent from "../components/StatsComponent";
const UserProfilePage = () => {
  const { data: user } = useUserQuery();
  const { data: attempts } = useAttemptsQuery(user?.user_id);
  const { data: collabs } = useCollabsQuery(user?.user_id);

  return (
    <Grid>
      <Grid.Col span={6}>
        <Stack p={"sm"} bg={"dark"} h={"100%"}>
          <UsernameComponent />
          <StatsComponent />
        </Stack>
      </Grid.Col>

      <Grid.Col span={6}>
        <Paper p={"sm"} bg={"dark"}>
          <ChangePassword />
        </Paper>
      </Grid.Col>
      <Grid.Col span={12} lg={6}>
        <Paper p={"sm"} bg={"dark"} mah={"33vh"} style={{ overflowY: "auto" }}>
          <Title order={2}>Problems Solved</Title>
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
      </Grid.Col>
      <Grid.Col span={12} lg={6}>
        <Paper p={"sm"} bg={"dark"} mah={"33vh"} style={{ overflowY: "auto" }}>
          <Title order={2}>Collaborations</Title>
          <Table striped>
            <thead>
              <tr>
                <th>User Id</th>
                <th>Question Id</th>
                <th>Attemped On</th>
              </tr>
            </thead>
            <tbody>
              {collabs?.map((collab) => (
                <tr key={collab.room_id + collab.user_a_id + collab.user_b_id}>
                  <td>
                    {collab.user_a_id == user?.user_id
                      ? collab.user_b_id
                      : collab.user_a_id}
                  </td>
                  <td>
                    <Button
                      variant="light"
                      component={Link}
                      to={`/question/${collab.question_id}`}
                    >
                      {collab.question_id}
                    </Button>
                  </td>
                  <td>{collab.created_on}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default UserProfilePage;
