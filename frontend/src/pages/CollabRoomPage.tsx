import { useQuery } from "@tanstack/react-query";
import { User } from "../types/User";
import { getUserData } from "../services/UserAPI";
import { useParams } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore -- need to patch
import { WebrtcProvider } from "y-webrtc";
import Editor from "@monaco-editor/react";
import { useMemo } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { editor } from "monaco-editor";
import "./CollabRoomPage.css";

// import { useMemo } from "react";

const CollabRoomPage = () => {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
  });
  const ydoc = useMemo(() => new Y.Doc(), []);
  const { id } = useParams();

  const connect = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editorInstance: editor.IStandaloneCodeEditor,
  ) => {
    const provider = new WebrtcProvider(id!, ydoc, {
      signaling: ["ws://localhost:4444"],
    });
    new MonacoBinding(
      ydoc.getText("monaco"),
      editorInstance.getModel()!,
      new Set([editorInstance]),
      provider.awareness,
    );
  };

  // const { search: password } = useLocation();
  // const params = useMemo(() => new URLSearchParams(search), [search]);

  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        onMount={connect}
        theme="vs-dark"
      ></Editor>
    </div>
  );
};

export default CollabRoomPage;
