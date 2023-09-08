import { Button, Group, Header, Text } from "@mantine/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { deregister, getUserData, logout } from "../services/UserAPI";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types/User";

const AppHeader = () => {
  const { logout: logoutFromContext } = useContext(UserContext);
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
  });

  return (
    <Header p="xs" height={60}>
      <Group position="apart">
        <Text size={24} component={Link} to="/">
          Home
        </Text>
        <Group>
          <Button
            variant="light"
            color="red"
            onClick={async () => {
              try {
                await deregister(user!.user_id);
                logout();
                logoutFromContext();
              } catch (e) {
                console.log(e);
              }
            }}
          >
            Deregister
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              logout();
              logoutFromContext();
            }}
          >
            Log Out
          </Button>
        </Group>
      </Group>
    </Header>
  );
};

export default AppHeader;
