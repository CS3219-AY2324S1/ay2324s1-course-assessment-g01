import { Affix, Button, Drawer, Flex, Text, Textarea, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useRef } from "react";
//import { CodeResult } from "../types/Judge";
import { submitCode } from "../services/JudgeAPI";

interface Props {
  code : () => string,
  languageId : number
}

const SubmissionComponent = ({code, languageId} : Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  //const [results, setResults] = useState<CodeResult | null>(null);
  // I think this is the only way to definitively get the submission details
  //const interval = useInterval(() => console.log("bruh"), 1000);
  const input = useRef<HTMLTextAreaElement>(null);
  const expectedOutput = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(() => {
    submitCode({
      "source_code" : code(),
      "language_id" : languageId,
      "stdin": input.current?.value,
      "expected_output" : expectedOutput.current?.value
    });
  }, [code, languageId]);

  return (
    <>
      <Drawer opened={opened} onClose={close} position={"bottom"} padding={0} size={200} withCloseButton={false} style={{minHeight: 50}}>
        <Flex direction={"row"} gap={10} style={{padding: 10}}>
          <Flex direction={"column"}>
            <Text> Input: </Text>
            <Textarea ref={input} minRows={5}/>
          </Flex>
          <Flex direction={"column"}>
            <Text> Expected Output: </Text>
            <Textarea ref={expectedOutput} minRows={5}/>  
          </Flex>
        </Flex>
        <Button
        onClick={() => {
          languageId = languageId + 0;
          submit();
        }}
        >
        </Button>
      </Drawer>
      {!opened && <Affix position={{ bottom: rem(20), right: "50vw" }}>
        <Button
        onClick={opened ? close : open}
        radius={90}
        >
        Tests
        </Button>
      </Affix>}
    </>
  );
};

export default SubmissionComponent;