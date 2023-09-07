import { useState } from "react";
import { ActionIcon, Group, Text, TextInput, Title } from "@mantine/core";
import { FaEdit } from "react-icons/fa";
import { useToggle } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeName, getUserData } from "../services/UserAPI";
import { User } from "../types/User";

const WelcomeComponent = () => {
  const client = useQueryClient();
  const [editing, toggle] = useToggle();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUserData,
    onSuccess(data) {
      setNewName(data.name);
    },
  });

  const [newName, setNewName] = useState("");

  const mutation = useMutation({
    mutationFn: () => changeName(user!.email, newName),
    async onMutate() {
      // Optimistic updates
      client.setQueryData(["user"], (old: User | undefined) => {
        return { ...old, name: newName } as User;
      });

      toggle();
    },
    onSuccess: () => {
      client.invalidateQueries(["user"]);
    },
  });

  return (
    <section>
      <Title order={1}>
        <Group spacing={"xs"}>
          Welcome,
          {editing ? (
            <TextInput
              disabled={mutation.isLoading}
              onChange={(e) => setNewName(e.currentTarget.value)}
              onBlur={() => {
                mutation.mutate();
              }}
            />
          ) : (
            <Text
              variant="gradient"
              gradient={{ from: "blue", to: "red" }}
              span
            >
              {user?.name}
            </Text>
          )}
          <ActionIcon onClick={() => toggle()} h={"100%"} variant="subtle">
            <FaEdit />
          </ActionIcon>
        </Group>
      </Title>
    </section>
  );
};

export default WelcomeComponent;
