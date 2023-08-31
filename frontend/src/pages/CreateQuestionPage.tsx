import { isNotEmpty, useForm } from "@mantine/form";
import { Complexity } from "../types/Question";
import {
  Button,
  NativeSelect,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addQuestion } from "../services/QuestionsAPI";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface FormValues {
  title: string;
  categories: string[];
  complexity: Complexity;
  description: string;
}

const CreateQuestionPage = () => {
  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      categories: ["String"],
      complexity: Complexity.easy,
      description: "",
    },

    initialErrors: {
      title: null,
    },

    validate: {
      title: isNotEmpty("Title cannot be empty"),
      description: isNotEmpty("Enter description"),
    },
  });

  const nav = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
      nav("/");
    },
    onError: (error) => {
      form.setErrors({ title: error as string });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.validate().hasErrors) {
          mutation.mutate({ id: uuidv4(), ...form.values });
        }
      }}
    >
      <Paper shadow="xs" p="md" mb="xs">
        <Title>Add a new question</Title>

        <Stack>
          <TextInput
            label="Title"
            placeholder="title"
            {...form.getInputProps("title")}
          />
          <Stack>
            {form.values.categories.map((_, index) => (
              <TextInput
                label={`Category ${index + 1}`}
                key={index}
                {...form.getInputProps(`categories.${index}`)}
              />
            ))}
            <Button onClick={() => form.insertListItem("categories", "")}>
              Add category
            </Button>
          </Stack>
          <Textarea
            label="Description"
            {...form.getInputProps("description")}
          />
          <NativeSelect
            value={form.values.complexity}
            onChange={(e) =>
              form.setValues({
                complexity: e.currentTarget.value as Complexity,
              })
            }
            data={[Complexity.easy, Complexity.medium, Complexity.hard]}
          ></NativeSelect>
          <Button type="submit">Save</Button>
        </Stack>
      </Paper>
    </form>
  );
};

export default CreateQuestionPage;
