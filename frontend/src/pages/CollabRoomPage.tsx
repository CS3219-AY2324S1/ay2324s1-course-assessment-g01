import { useQuery } from "@tanstack/react-query";
import { User } from "../types/User";
import { getUserData } from "../services/UserAPI";
import { useParams } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore -- need to patch
import { WebrtcProvider } from "y-webrtc";
import Editor from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { editor, languages } from "monaco-editor";
import "./CollabRoomPage.css";
import { Select } from "@mantine/core";

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
  const [otherName, setotherName] = useState("");

  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    if (!editorInstance) return;
    const provider = new WebrtcProvider(id!, ydoc, {
      signaling: ["ws://localhost:4444"],
    });

    //Set own name
    provider.awareness.setLocalStateField("user", user?.name);

    //If awareness changes, set other party's name
    provider.awareness.on("change", () => {
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
    settingsMap.observe(() =>
      setLanguage(ydoc.getMap("settings").get("language") as string),
    );
  }, [settingsMap, ydoc]);

  // const { search: password } = useLocation();
  // const params = useMemo(() => new URLSearchParams(search), [search]);

  return (
    <div>
      <div>You are working with {otherName}</div>
      <div>
        <Select
          searchable
          label="Language"
          data={languages.getLanguages().map((x) => x.id)}
          defaultValue={"javascript"}
          value={settingsMap.get("language") as string}
          onChange={(e) => {
            settingsMap.set("language", e);
          }}
        ></Select>
      </div>
      <Editor
        language={language}
        height="90vh"
        defaultLanguage="javascript"
        onMount={seteditorInstance}
        theme="vs-dark"
      ></Editor>
    </div>
  );
};

export default CollabRoomPage;
