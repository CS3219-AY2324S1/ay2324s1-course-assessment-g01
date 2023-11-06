import { Affix, Button, Card, Drawer, Flex, Loader, Tabs, Text, Textarea, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { CodeResult, JudgeToken } from "../types/Judge";
import { getLanguage, getResult, submitCode } from "../services/JudgeAPI";
import CodeResultDisplay from "./CodeResultDisplay";
import { postAttempt } from "../services/HistoryAPI";

interface Props {
  getCode : () => string,
  languageId : number,
  questionId : string | undefined,
  userId : number | undefined
}

const SubmissionComponent = ({getCode, languageId, questionId, userId} : Props) => {
  const LOADING_MESSAGE = "Loading...";
  const NO_CODE_ERROR = "You have no code to submit :(";
  const RESULTS_LOADED = "Your code has finished executing";
  
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  const [expected, setExpected] = useState<string | undefined>("");
  const [token, setToken] = useState<JudgeToken | null>(null);
  const [results, setResults] = useState<CodeResult | null>(null);

  const timer = useRef<number | undefined>(undefined);
  const input = useRef<HTMLTextAreaElement>(null);
  const expectedOutput = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(async () => {
    setStatusMessage("");
    const code = getCode();
    if (!code) return handleNoCode();
    setIsLoading(true);
    setToken(await submitCode({
      "source_code" : code,
      "language_id" : languageId,
      "stdin": input.current?.value,
      "expected_output" : (expectedOutput.current?.value == "" ? undefined : expectedOutput.current?.value)
    }));
    setExpected(expectedOutput.current?.value);
    setStatusMessage(LOADING_MESSAGE);
  }, [getCode, languageId]);

  const handleNoCode = () => {
    setStatusMessage(NO_CODE_ERROR);
  };

  const fetchResult = useCallback((token : JudgeToken) => {
    getResult(token!).then(
      (result) => {
        if (result["time"]) {
          setResults(result);
          setIsLoading(false);
          postAttempt({
            "question_id": questionId!,
            "user_id": userId!,
            "code": getCode(),
            "language": getLanguage(languageId)!,
            "passed" : result.status.description == "Accepted"
          });
          return result;
        }
      }
    );
  }, [questionId, userId, languageId, getCode]);

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
  }, [token, fetchResult]);

  useEffect(() => {
    if (!results) return;
    setStatusMessage(RESULTS_LOADED);
    stopInterval();
  }, [results]);

  return (
    <>
      <Drawer opened={opened} onClose={close} position={"bottom"} padding={0} size={"xs"} withCloseButton={false} style={{minHeight: 50}}>
        <Tabs defaultValue="parameters">
          <Tabs.List>
            <Tabs.Tab value="parameters"> Test Case</Tabs.Tab>
            <Tabs.Tab value="details" disabled={!results}> Details </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="parameters">
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
              disabled={isLoading}
              >
                Run Code
              </Button>
              <Card style={{width: "40%"}}>
                <Text> Status</Text>
                <Flex direction={"column"} align={"center"}>
                  {
                  isLoading && <Loader/>
                  }
                  <Text> {statusMessage} </Text>
                </Flex>
              </Card>
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="details">
            <CodeResultDisplay result={results} expected={expected}/>
          </Tabs.Panel>
        </Tabs>
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