import { useQuery } from "@tanstack/react-query";
import { User } from "../types/User";
import { getUserData } from "../services/UserAPI";
import { Link, useLocation, useParams } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore -- need to patch
import { WebsocketProvider } from "y-websocket";
import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { editor } from "monaco-editor";
import "./CollabRoomPage.css";
import {
  Button,
  Center,
  Overlay,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Question } from "../types/Question";
import ChatComponent, { ChatMessage } from "../components/ChatComponent";
import SubmissionComponent from "../components/SubmissionComponent";
import { supportedLanguages } from "../services/JudgeAPI";

// import { useMemo } from "react";

const CollabRoomPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
  });
  const ydoc = useMemo(() => new Y.Doc(), []);
  const { id } = useParams();
  const [editorInstance, seteditorInstance] =
    useState<editor.IStandaloneCodeEditor>();
  const [otherName, setotherName] = useState<string | undefined>("");
  
  // TODO: replace with getting from the backend
  const {
    state: { question },
  }: { state: { question: Question } } = useLocation();

  const [language, setLanguage] = useState("JavaScript (Node.js 12.14.0)");
  const [languageId, setLanguageId] = useState(63);
  const [editorLanguage, setEditorLanguage] = useState("javascript");

  useEffect(() => {
    if (!editorInstance) return;
    const provider = new WebsocketProvider(
      "ws://" + location.host + "/collab/ws",
      id!,
      ydoc,
    );

    if (!user) return;

    //Set own name
    provider.awareness.setLocalStateField("user", user?.name);

    //If awareness changes, set other party's name
    provider.awareness.on("change", () => {
      // If other party not here, set to undefined for loading
      if (Array.from(provider.awareness.getStates().keys()).length < 2) {
        setotherName(undefined);
        return;
      }

      provider.awareness.getStates().forEach((state: { user: string }) => {
        if (state.user !== user?.name) {
          setotherName(state.user);
        }
      });
    });

    new MonacoBinding(
      ydoc.getText("monaco"),
      editorInstance.getModel()!,
      new Set([editorInstance]),
      provider.awareness,
    );
    return () => provider.destroy();
  }, [editorInstance, id, ydoc, user]);

  //Set language when other side changes
  const settingsMap = ydoc.getMap("settings");
  useEffect(() => {
    const set = () => {
      setLanguage(ydoc.getMap<string>("settings").get("language") || "JavaScript (Node.js 12.14.0)");
    };
    settingsMap.observe(set);
    return () => settingsMap.unobserve(set);
  }, [settingsMap, ydoc]);

  useEffect(() => {
    const lang = supportedLanguages.find(x => x.name == language);
    if (lang) {
      setLanguageId(lang.id);
      setEditorLanguage(lang.editor);
    } else {
      // Debugging purposes
      console.log(language);
    }
  }, [language]);

  const getCode = useCallback<()=>string>(() => {
    return editorInstance ? editorInstance.getValue() : "";
  }, [editorInstance]);

  const chatArray = ydoc.getArray<ChatMessage>("chat");

  // const { search: password } = useLocation();
  // const params = useMemo(() => new URLSearchParams(search), [search]);

  return (
    <>
      {otherName === undefined && (
        <Overlay blur={10} fixed>
          <Center h="100%">
            <Stack>
              <p>Other user has left</p>
              <Button variant="light" component={Link} to="/">
                Return Home
              </Button>
            </Stack>
          </Center>
        </Overlay>
      )}
      <SubmissionComponent 
        getCode={getCode} 
        languageId={languageId}
        questionId={question._id}
        userId={user?.user_id}
        />
      <SimpleGrid
        cols={2}
        h={"calc(100vh - var(--mantine-header-height, 0px) - 2rem)"}
      >
        <Stack style={{ minHeight: 0, height: "100%" }}>
          <Stack
            style={{
              flex: 1,
              minHeight: 0,
            }}
          >
            <Title>{question.title}</Title>
            <ScrollArea type="always" scrollbarSize={4}>
              <div
                style={{
                  // whiteSpace: "pre-line",
                  overflow: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: question.description }}
              />
            </ScrollArea>
          </Stack>
          <ChatComponent chatlog={chatArray} id={ydoc.clientID} />
        </Stack>
        <Stack>
          <Text
            variant="gradient"
            gradient={{ from: "blue", to: "red", deg: 90 }}
          >
            You are working with
            {" " + otherName}
          </Text>
          <div>
            <Select
              autoComplete="false"
              searchable
              label="Language"
              data={supportedLanguages.map((x) => x.name)}
              defaultValue={"JavaScript (Node.js 12.14.0)"}
              value={settingsMap.get("language") as string}
              onChange={(e) => {
                settingsMap.set("language", e);
              }}
            ></Select>
          </div>
          <Editor
            language={editorLanguage}
            height="70vh"
            defaultLanguage="javascript"
            onMount={seteditorInstance}
            theme="vs-dark"
          ></Editor>
        </Stack>
      </SimpleGrid>
    </>
  );
};

export default CollabRoomPage;
