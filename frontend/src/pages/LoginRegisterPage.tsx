import { useToggle, upperFirst } from "@mantine/hooks";
import { isEmail, useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
  Center,
} from "@mantine/core";
import { FormEvent, useContext, useEffect } from "react";
import { login, register } from "../services/UserAPI";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export function LoginPage() {
  const [type, toggle] = useToggle(["login", "register"]);
  const { jwt, setJwt } = useContext(UserContext);

  // Login mutation
  const { isLoading: loginLoading, mutate: loginMutate } = useMutation({
    mutationFn: () => login(form.values.email, form.values.password),
    async onSuccess({ jwt }) {
      setJwt(jwt);
      localStorage.setItem("jwt", jwt);
    },
    onError() {
      form.setErrors({ error: "Login failed" });
    },
  });

  // Register mutation
  const { isLoading: registerLoading, mutate: registerMutate } = useMutation({
    mutationFn: () => register({ ...form.values }),
    onSuccess() {
      loginMutate();
    },
    onError() {
      form.setErrors({ error: "Error registering: user already registered" });
    },
  });

  // navigate away if already logged in
  const nav = useNavigate();
  useEffect(() => {
    if (jwt) nav("/");
  });

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
      registerMutate();
    } else {
      loginMutate();
    }
  };

  return (
    <Center h={"100vh"}>
      <Paper radius="md" p="xl" withBorder>
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
            <Button
              type="submit"
              radius="xl"
              loading={loginLoading || registerLoading}
            >
              {upperFirst(type)}
            </Button>
          </Group>
          <Text color="red">{form.errors.error}</Text>
        </form>
      </Paper>
    </Center>
  );
}

export default LoginPage;
