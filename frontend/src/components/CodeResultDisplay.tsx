import { Card, Code, Flex, SimpleGrid, Space, Text } from "@mantine/core";
import { CodeResult } from "../types/Judge";

interface Props {
  result : CodeResult | null,
  expected : string | undefined
}

const CodeResultDisplay = ({result, expected} : Props) => {
  return (
     <>
      {result && <Card>
        <SimpleGrid cols={expected ? 3 : 2}>
          <Flex direction={"column"}>
            <Text fw={700} fz={"xl"}> {`Result: ${result.status.description}`} </Text>
            <Space h="md" />
            <Text fw={700}> {"Stats"} </Text>
            <Text> {"Time taken: " + (result.time ? `${result.time} sec` : "NaN")} </Text>
            <Text> {"Memory used: " + (result.memory ? `${result.memory} kb` : "NaN")} </Text>
            <Text> {"Error message: "}</Text>
            <Code block> {result.stderr ? result.stderr + "\n" : ""
              + (result.compile_output ? result.compile_output : "")} </Code>
          </Flex>
          <Flex direction={"column"}>
            <Text> Your output: </Text>
            {/* <Textarea value={result.stdout!} disabled/> */}
            <Code block> {result.stdout} </Code>
          </Flex>
          {expected && <Flex direction={"column"}>
            <Text> Expected output: </Text>
            <Code block> {expected} </Code>
          </Flex>}
        </SimpleGrid>
        
      </Card>}
    </>
  );
};

export default CodeResultDisplay;