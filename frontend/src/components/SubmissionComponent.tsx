import { Affix, Button, Drawer, Flex, Text, Textarea, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { CodeResult, JudgeToken } from "../types/Judge";
import { getResult, submitCode } from "../services/JudgeAPI";

interface Props {
  getCode : () => string,
  languageId : number
}

const SubmissionComponent = ({getCode, languageId} : Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [token, setToken] = useState<JudgeToken | null>(null);
  const [results, setResults] = useState<CodeResult | null>(null);

  const timer = useRef<number | undefined>(undefined);
  const input = useRef<HTMLTextAreaElement>(null);
  const expectedOutput = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(async () => {
    const code = getCode();
    if (!code) return handleNoCode();
    setToken(await submitCode({
      "source_code" : code,
      "language_id" : languageId,
      "stdin": input.current?.value,
      "expected_output" : expectedOutput.current?.value
    }));
  }, [getCode, languageId]);

  const handleNoCode = () => {
    console.log("no code error");
  };

  const fetchResult = async (token : JudgeToken) => {
    const result = await getResult(token!);
    if (result["time"]) {
      setResults(result);
    }
  };

  // To prevent clearing other interval by accident
  const stopInterval = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = undefined;
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    setResults(null);
    timer.current = window.setInterval(fetchResult, 1000, token);
    return stopInterval;
  }, [token]);

  useEffect(() => {
    if (!results) return;
    console.log(results);
    stopInterval();
  }, [results]);

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
          <Button
          onClick={submit}
          >
        </Button>
        </Flex>
        
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