import {
  Avatar,
  Group,
  Header,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
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
        <Menu transitionProps={{ duration: 50 }}>
          <Menu.Target>
            <Avatar bg={"blue"} component={UnstyledButton}></Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item component={Link} to={`/user/${user?.user_id}`}>
              User Profile
            </Menu.Item>
            <Menu.Item
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
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                logout();
                logoutFromContext();
              }}
            >
              Log Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Header>
  );
};

export default AppHeader;
