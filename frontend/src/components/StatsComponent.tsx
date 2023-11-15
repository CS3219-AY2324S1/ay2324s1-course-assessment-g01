import { Flex, Progress, RingProgress, Stack, Text } from "@mantine/core";
import { AttemptResponse } from "../types/Attempt";
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "../services/QuestionsAPI";
import { Complexity } from "../types/Question";

const StatsComponent = ({ attempts }: { attempts: AttemptResponse[] }) => {
  const { data: questions } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const attemptedQuestions = attempts.reduce(
    (prev, curr) => {
      if (!curr.attempt.passed) return prev;
      prev[curr.question.complexity].add(curr.question._id);
      return prev;
    },
    { Easy: new Set(), Medium: new Set(), Hard: new Set() } as Record<
      Complexity,
      Set<string>
    >,
  );

  const questionDifficultyCounts = questions?.reduce(
    (prev, curr) => {
      prev[curr.complexity].add(curr._id);
      return prev;
    },
    { Easy: new Set(), Medium: new Set(), Hard: new Set() } as Record<
      Complexity,
      Set<string>
    >,
  );

  return (
    <Flex align={"center"}>
      <RingProgress
        label={
          <Text align="center">
            <Text size={"xl"}>
              {Math.ceil(
                ((attemptedQuestions.Easy.size +
                  attemptedQuestions.Medium.size +
                  attemptedQuestions.Hard.size) /
                  (questions
                    ? questions.length
                    : attemptedQuestions.Easy.size +
                      attemptedQuestions.Medium.size +
                      attemptedQuestions.Hard.size)) *
                  100,
              )}
              %
            </Text>
            solved
          </Text>
        }
        sections={[
          {
            value: Math.ceil(
              ((attemptedQuestions.Easy.size +
                attemptedQuestions.Medium.size +
                attemptedQuestions.Hard.size) /
                (questions
                  ? questions.length
                  : attemptedQuestions.Easy.size +
                    attemptedQuestions.Medium.size +
                    attemptedQuestions.Hard.size)) *
                100,
            ),
            color: "cyan",
          },
        ]}
      />
      <Stack style={{ flex: 1 }}>
        <Stack spacing={"xs"}>
          <label>Easy</label>
          <Progress
            size="xl"
            label={`${Math.round(
              attemptedQuestions.Easy.size /
                (questionDifficultyCounts?.Easy.size ||
                  attemptedQuestions.Easy.size),
            )}%`}
            color="grape"
            value={Math.round(
              attemptedQuestions.Easy.size /
                (questionDifficultyCounts?.Easy.size ||
                  attemptedQuestions.Easy.size),
            )}
            w={"100%"}
          />
        </Stack>
        <Stack spacing={"xs"}>
          <label>Medium</label>
          <Progress
            size="xl"
            label={`${Math.round(
              attemptedQuestions.Medium.size /
                (questionDifficultyCounts?.Medium.size ||
                  attemptedQuestions.Medium.size),
            )}%`}
            color="grape"
            value={Math.round(
              attemptedQuestions.Medium.size /
                (questionDifficultyCounts?.Medium.size ||
                  attemptedQuestions.Medium.size),
            )}
            w={"100%"}
          />
        </Stack>
        <Stack spacing={"xs"}>
          <label>Hard</label>
          <Progress
            size="xl"
            label={`${Math.round(
              attemptedQuestions.Hard.size /
                (questionDifficultyCounts?.Hard.size ||
                  attemptedQuestions.Hard.size),
            )}%`}
            color="grape"
            value={Math.round(
              attemptedQuestions.Hard.size /
                (questionDifficultyCounts?.Hard.size ||
                  attemptedQuestions.Hard.size),
            )}
            w={"100%"}
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

export default StatsComponent;
