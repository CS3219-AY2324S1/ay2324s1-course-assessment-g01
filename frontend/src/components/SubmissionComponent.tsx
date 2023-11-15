import { ActionIcon, Affix, Button, Card, Drawer, Flex, Loader, Tabs, Text, Textarea, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
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
  
  const [input, setInput] = useState<string>("");
  // For displaying the expected output of the submitted code
  const [expected, setExpected] = useState<string | undefined>("");
  // For textbox where user can key in their expected output before submitting code
  const [expectedOutput, setExpectedOutput] = useState<string>("");
  const [token, setToken] = useState<JudgeToken | null>(null);
  const [results, setResults] = useState<CodeResult | null>(null);

  const timer = useRef<number | undefined>(undefined);

  const submit = useCallback(async () => {
    setStatusMessage("");
    const code = getCode();
    if (!code) return handleNoCode();
    setIsLoading(true);
    setExpected(expectedOutput);
    setStatusMessage(LOADING_MESSAGE);
    setToken(await submitCode({
      "source_code" : code,
      "language_id" : languageId,
      "stdin": input,
      "expected_output" : (expectedOutput == "" ? undefined : expectedOutput)
    }));
  }, [expectedOutput, getCode, input, languageId]);

  const handleNoCode = () => {
    setStatusMessage(NO_CODE_ERROR);
  };

  const fetchResult = useCallback((token : JudgeToken) => {
    getResult(token!).then(
      (result) => {
        if (result && result["status"]["id"] > 2) {
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
                <Textarea 
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)} 
                minRows={5}/>
              </Flex>
              <Flex direction={"column"}>
                <Text> Expected Output: </Text>
                <Textarea 
                value={expectedOutput} 
                onChange={(event) => setExpectedOutput(event.currentTarget.value)}
                minRows={5}/>  
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

      {!opened && <Affix position={{ bottom: rem(20), right: "calc(50vw - 14px)" }}>
        <ActionIcon
        onClick={opened ? close : open}
        variant={"filled"}
        color={"blue"}
        radius={90}
        >
          <AiOutlineArrowUp/>
        </ActionIcon>
      </Affix>}
    </>
  );
};

export default SubmissionComponent;