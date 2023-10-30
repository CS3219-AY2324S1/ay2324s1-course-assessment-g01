import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../services/QuestionsAPI";
import { useParams } from "react-router-dom";
import { Text, Title, LoadingOverlay, Paper, Select, SimpleGrid, Transition, Affix, Button, rem } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useCallback, useEffect, useState } from "react";
import SubmissionComponent from "../components/SubmissionComponent";
import { supportedLanguages } from "../services/JudgeAPI";

const QuestionPage = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(id!),
  });
  const [language, setLanguage] = useState("JavaScript (Node.js 12.14.0)");
  const [languageId, setLanguageId] = useState(63);
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editorInstance, seteditorInstance] =
    useState<editor.IStandaloneCodeEditor>();
  const updateLangage = (languageOption : string) => {
    const lang = supportedLanguages.find(x => x.name == languageOption);
    if (lang) {
      setLanguage(lang.name);
      setLanguageId(lang.id);
      setEditorLanguage(lang.editor);
    } else {
      // Debugging purposes
      console.log(languageOption);
    }
  };

  const getCode = useCallback<()=>string>(() => {
    return editorInstance.getValue();
  }, [editorInstance]);
  
  return (
    <section style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <SubmissionComponent code={getCode} languageId={languageId}/>
      <Button onClick={()=>console.log(editorInstance)}/>
      <SimpleGrid cols={2}>
        <div>
          {isError && <Text>{"Error: Not found"}</Text>}
          {data && (
            <>
              <Title mb="md">
                {data.title}
              </Title>
              <Paper withBorder p="md">
                <Title order={2}>Description</Title>
                <Text
                  // component="pre"
                  // style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: data.description }}
                ></Text>
              </Paper>
            </>
          )}
        </div>
        <div>
          <Select
            autoComplete="false"
            searchable
            label="Language"
            data={supportedLanguages.map((x) => x.name)}
            defaultValue={"JavaScript (Node.js 12.14.0)"}
            value={language}
            onChange={(e) => {
              if (e) updateLangage(e);
            }}
          ></Select>
          
          <Editor
            language={editorLanguage}
            height="70vh"
            defaultLanguage="javascript"
            onMount={seteditorInstance}
            theme="vs-dark"
          ></Editor>
        </div>
      </SimpleGrid>
    </section>
  );
};

export default QuestionPage;
