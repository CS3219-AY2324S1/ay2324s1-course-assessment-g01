import { useToggle, upperFirst } from "@mantine/hooks";
import { isEmail, useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
  Center,
} from "@mantine/core";
import { FormEvent, useContext, useState } from "react";
import { register } from "../services/UserAPI";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export function LoginPage(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const nav = useNavigate();
  if (user) nav("/");

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: isEmail("Invalid Email"),
      name: (value) =>
        type == "login" || value.length > 0 ? null : "Must have name!",
    },
    initialErrors: {
      error: "",
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.validate().hasErrors) return;
    if (type == "register") {
      try {
        await register({ ...form.values, access_type: "1" });
        setMessage("Registration successful");
      } catch {
        form.setErrors({
          error: "Registration failed: user already exists",
        });
      }
    } else {
      console.log("login");
    }
  };

  return (
    <Center h={"100vh"}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Welcome to PeerPrep, {type} with
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack>
            {type === "register" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
                error={form.errors.name}
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="Your email"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              radius="md"
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
          <Text color="green">{message}</Text>
          <Text color="red">{form.errors.error}</Text>
        </form>
      </Paper>
    </Center>
  );
}

export default LoginPage;
