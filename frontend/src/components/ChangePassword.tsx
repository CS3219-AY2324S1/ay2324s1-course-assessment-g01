import { Button, PasswordInput, Stack, Title } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../services/UserAPI";
import { useState } from "react";

const ChangePassword = () => {
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

  const [success, setSuccess] = useState<boolean | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: ({
      new_password,
      curr_password,
    }: {
      new_password: string;
      curr_password: string;
    }) => changePassword(new_password, curr_password),
    onError() {
      setSuccess(false);
    },
    onSuccess() {
      setSuccess(true);
    },
  });

  return (
    <Form
      onSubmit={({ curr_password, new_password }) =>
        mutation.mutate({ new_password, curr_password })
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
        <Button type="submit" loading={mutation.isLoading}>
          Submit
        </Button>
      </Stack>
    </Form>
  );
};

export default ChangePassword;
