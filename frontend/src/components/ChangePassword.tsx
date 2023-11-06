import { Button, PasswordInput, Stack, Title } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../services/UserAPI";
import { useUserQuery } from "../hooks/queries";
import { useState } from "react";
import { useToggle } from "@mantine/hooks";

const ChangePassword = () => {
  const { data: user } = useUserQuery();

  const form = useForm({
    initialValues: {
      curr_password: "",
      new_password: "",
      confirm_password: "",
    },
    validate: {
      confirm_password: (value, values) =>
        value !== values.new_password ? "Passwords did not match" : null,
      new_password: (value, values) =>
        value !== values.confirm_password ? "Passwords did not match" : null,
    },
  });

  const [updating, toggleUpdating] = useToggle();
  const [success, setSuccess] = useState<boolean | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: ({
      email,
      new_password,
    }: {
      email: string;
      new_password: string;
    }) => changePassword(email, new_password),
    onMutate() {
      toggleUpdating();
    },
    onError() {
      setSuccess(false);
    },
    onSuccess() {
      setSuccess(true);
    },
    onSettled() {
      toggleUpdating();
    },
  });

  return (
    <Form
      onSubmit={({ new_password }) =>
        mutation.mutate({ email: user!.email, new_password })
      }
      form={form}
    >
      <Title order={3}>Change Password</Title>
      <Stack>
        <PasswordInput
          label="Current Password"
          placeholder="Current Password"
          {...form.getInputProps("curr_password")}
        />
        <PasswordInput
          label="New Password"
          placeholder="New Password"
          {...form.getInputProps("new_password")}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm Password"
          {...form.getInputProps("confirm_password")}
        />
        {success != undefined &&
          (success ? (
            <span style={{ color: "var(--mantine-color-green-6)" }}>
              Success
            </span>
          ) : (
            <span style={{ color: "var(--mantine-color-red-6)" }}>
              Updating password failed
            </span>
          ))}
        <Button type="submit" loading={updating}>
          Submit
        </Button>
      </Stack>
    </Form>
  );
};

export default ChangePassword;
