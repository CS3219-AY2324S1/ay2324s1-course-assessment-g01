import {
  Button,
  Center,
  Loader,
  Table,
  Flex,
  Pagination,
  Input,
  MultiSelect,
} from "@mantine/core";
import { deleteQuestion, getQuestions } from "../services/QuestionsAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import WelcomeComponent from "../components/WelcomeComponent";
import { isAdmin } from "../utils/userUtils";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import MatchingComponent from "../components/MatchingComponent";
import { useUserQuery } from "../hooks/queries";

import styles from "./LandingPage.module.css";
import { Complexity } from "../types/Question";

const QUESTIONS_PER_PAGE = 12;

const LandingPage = () => {
  const { jwt } = useContext(UserContext);
  const queryClient = useQueryClient();
  const {
    data: questions,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteQuestion(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });

  const { data: user } = useUserQuery();

  const [questionsPage, setQuestionsPage] = useState(1);

  const [search, setSearch] = useSearchParams("search");

  const [complexityFilter, setComplexityFilter] = useState<string[]>([]);

  // TODO: change to backend search?
  const filtered = questions
    ?.filter((question) =>
      question.title
        .toLowerCase()
        .includes(search.get("search")?.toLowerCase() || ""),
    )
    .filter(
      (question) =>
        complexityFilter.length == 0 ||
        complexityFilter.includes(question.complexity),
    );

  return (
    <section>
      <WelcomeComponent />
      <Flex justify="space-between" wrap={"wrap"}>
        {user && isAdmin(user) && (
          <Button component={Link} to="/create">
            Create new question
          </Button>
        )}
        <MatchingComponent user={user} jwt={jwt} />
        <Input
          placeholder="Search"
          value={search.get("search") || ""}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, search: e.currentTarget.value }))
          }
        />
      </Flex>
      <Table striped withBorder my={10}>
        <thead>
          <tr>
            <th>Question Id</th>
            <th>Title</th>
            <th>Category</th>
            <th>
              <MultiSelect
              placeholder="Complexity"
              w={300}
                data={Object.values(Complexity).map((complexity) => ({
                  label: complexity,
                  value: complexity,
                }))}
                onChange={setComplexityFilter}
              />
            </th>
            {user && isAdmin(user) && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {filtered
            ?.slice(
              (questionsPage - 1) * QUESTIONS_PER_PAGE,
              (questionsPage - 1) * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE,
            )
            .map((question) => (
              <tr key={question._id}>
                <td>{question._id}</td>
                <td>
                  <Button
                    className={styles.wrap}
                    maw={"100%"}
                    variant="light"
                    to={`/question/${question._id}`}
                    component={Link}
                  >
                    {question.title}
                  </Button>
                </td>
                <td style={{ wordWrap: "break-word" }}>
                  {question.categories.join(",")}
                </td>
                <td>{question.complexity}</td>
                {user && isAdmin(user) && (
                  <td>
                    <Button
                      onClick={() =>
                        deleteQuestionMutation.mutate(question._id)
                      }
                      loading={deleteQuestionMutation.isLoading}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </Table>
      <Pagination
        onChange={setQuestionsPage}
        value={questionsPage}
        total={filtered ? Math.ceil(filtered.length / QUESTIONS_PER_PAGE) : 0}
      />
      {(isLoading || isRefetching) && (
        <Center>
          <Loader />
        </Center>
      )}
    </section>
  );
};

export default LandingPage;
