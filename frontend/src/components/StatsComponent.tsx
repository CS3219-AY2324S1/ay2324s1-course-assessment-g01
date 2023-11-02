import { Flex, Progress, RingProgress, Stack, Text } from "@mantine/core";

// TODO!
const StatsComponent = () => {
  return (
    <Flex align={"center"}>
      <RingProgress
        label={
          <Text align="center">
            <Text size={"xl"}>50%</Text> solved
          </Text>
        }
        sections={[{ value: 50, color: "cyan" }]}
      />
      <Stack style={{ flex: 1 }}>
        <Stack spacing={"xs"}>
          <label>Easy</label>
          <Progress size="xl" label="40%" color="grape" value={40} w={"100%"} />
        </Stack>
        <Stack spacing={"xs"}>
          <label>Medium</label>
          <Progress
            size="xl"
            label="20%"
            color="indigo"
            value={20}
            w={"100%"}
          />
        </Stack>
        <Stack spacing={"xs"}>
          <label>Hard</label>
          <Progress size="xl" label="10%" color="lime" value={10} w={"100%"} />
        </Stack>
      </Stack>
    </Flex>
  );
};

export default StatsComponent;
