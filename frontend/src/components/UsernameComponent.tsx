import { useState } from "react";
import { ActionIcon, Group, Text, TextInput, Title } from "@mantine/core";
import { FaEdit } from "react-icons/fa";
import { useToggle } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeName } from "../services/UserAPI";
import { User } from "../types/User";
import { useUserQuery } from "../hooks/queries";

const UsernameComponent = () => {
  const client = useQueryClient();
  const [editing, toggle] = useToggle();

  const { data: user } = useUserQuery({
    onSuccess(data) {
      setNewName(data.name);
    },
  });

  const [newName, setNewName] = useState("");

  const mutation = useMutation({
    mutationFn: () => changeName(newName),
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
    <Title>
      <Group spacing={"xs"} position={"center"}>
        {editing ? (
          <TextInput
            disabled={mutation.isLoading}
            onChange={(e) => setNewName(e.currentTarget.value)}
            onBlur={() => {
              mutation.mutate();
            }}
          />
        ) : (
          <Text variant="gradient" gradient={{ from: "blue", to: "red" }} span>
            {user?.name}
          </Text>
        )}
        <ActionIcon onClick={() => toggle()} h={"100%"} variant="subtle">
          <FaEdit />
        </ActionIcon>
      </Group>
    </Title>
  );
};

export default UsernameComponent;
