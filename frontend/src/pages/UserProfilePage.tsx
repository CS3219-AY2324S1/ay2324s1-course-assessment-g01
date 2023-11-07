import {
  Button,
  Grid,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  useAttemptsQuery,
  useCollabsQuery,
  useOtherUserQuery,
  useUserQuery,
} from "../hooks/queries";
import UsernameComponent from "../components/UsernameComponent";
import { FaCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChangePassword from "../components/ChangePassword";
import StatsComponent from "../components/StatsComponent";
import { useEffect } from "react";
const UserProfilePage = () => {
  const { id } = useParams();
  const { data: currUser } = useUserQuery();
  const { data: user, error, isLoading } = useOtherUserQuery(parseInt(id!));
  const { data: attempts } = useAttemptsQuery(parseInt(id!));
  const { data: collabs } = useCollabsQuery(parseInt(id!));
  const nav = useNavigate();

  useEffect(() => {
    if (error) nav("/");
  }, [id, error, nav]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Grid>
        <Grid.Col span={currUser?.user_id == id ? 6 : 12}>
          <Stack p={"sm"} bg={"dark"} h={"100%"}>
            {id == currUser?.user_id ? (
              <UsernameComponent />
            ) : (
              <Title>
                <Text
                  variant="gradient"
                  gradient={{ from: "blue", to: "red" }}
                  align="center"
                >
                  {user?.name}
                </Text>
              </Title>
            )}
            <StatsComponent />
          </Stack>
        </Grid.Col>

        {currUser?.user_id == id && (
          <Grid.Col span={6}>
            <Paper p={"sm"} bg={"dark"}>
              <ChangePassword />
            </Paper>
          </Grid.Col>
        )}
        <Grid.Col span={12} lg={6}>
          <Paper
            p={"sm"}
            bg={"dark"}
            mah={"33vh"}
            style={{ overflowY: "auto" }}
          >
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
          <Paper
            p={"sm"}
            bg={"dark"}
            mah={"33vh"}
            style={{ overflowY: "auto" }}
          >
            <Title order={2}>Collaborations</Title>
            <Table striped>
              <thead>
                <tr>
                  <th>User 1</th>
                  <th>User 2</th>
                  <th>Question Id</th>
                  <th>Attemped On</th>
                </tr>
              </thead>
              <tbody>
                {collabs?.map((collab) => (
                  <tr
                    key={collab.room_id + collab.user_a_id + collab.user_b_id}
                  >
                    <td>
                      <Button
                        variant="light"
                        component={Link}
                        to={`/user/${collab.user_a_id}`}
                      >
                        {collab.user_a_id}
                        {collab.user_a_id == parseInt(id!) && " (this user)"}
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="light"
                        component={Link}
                        to={`/user/${collab.user_b_id}`}
                      >
                        {collab.user_b_id}
                        {collab.user_b_id == parseInt(id!) && " (this user)"}
                      </Button>
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
    </>
  );
};

export default UserProfilePage;
