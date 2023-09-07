import { isNotEmpty, useForm } from "@mantine/form";
import { Complexity } from "../types/Question";
import {
  Button,
  NativeSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addQuestion } from "../services/QuestionsAPI";
import { useNavigate } from "react-router-dom";

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
      categories: (categories) =>
        categories.includes("")
          ? "Empty category"
          : new Set(categories).size !== categories.length
          ? "Duplicate categories"
          : null,
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
          mutation.mutate({ ...form.values });
        }
      }}
    >
      <Paper mx="auto" maw={"50%"} shadow="xs" p="xl" mb="xs">
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
            {form.errors.categories && (
              <Text color="red">{form.errors.categories}</Text>
            )}
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
          <Button loading={mutation.isLoading} type="submit">Save</Button>
        </Stack>
      </Paper>
    </form>
  );
};

export default CreateQuestionPage;
