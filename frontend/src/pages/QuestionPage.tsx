import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../services/QuestionsAPI";
import { useParams } from "react-router-dom";
import { Text, Title, LoadingOverlay, Paper, Select, SimpleGrid } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { editor, languages } from "monaco-editor";
import { useState } from "react";

const QuestionPage = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(id!),
  });
  const [language, setLanguage] = useState("javascript");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editorInstance, seteditorInstance] =
    useState<editor.IStandaloneCodeEditor>();

  return (
    <section style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
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
            data={languages.getLanguages().map((x) => x.id)}
            defaultValue={"javascript"}
            value={language}
            onChange={(e) => {
              if (e) setLanguage(e);
            }}
          ></Select>
          <Editor
            language={language}
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
