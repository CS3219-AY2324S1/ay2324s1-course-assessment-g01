import { Button, Group, Header, Text } from "@mantine/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { logout } from "../services/UserAPI";

const AppHeader = () => {
  const { logout: logoutFromContext } = useContext(UserContext);

  return (
    <Header p="xs" height={60}>
      <Group position="apart">
        <Text size={24} component={Link} to="/">
          Home
        </Text>
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
    </Header>
  );
};

export default AppHeader;
