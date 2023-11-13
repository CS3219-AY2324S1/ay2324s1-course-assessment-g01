import { CodeSubmission, JudgeToken } from "../types/Judge";
import { baseInstance } from "./apiInstance";

const config = {
  headers: {
    "X-RapidAPI-Key": "e3c477ff22msh5ea05cb8ec457c5p10a50ejsn72948429c94d",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  },
};

export const submitCode = async (submission: CodeSubmission) => {
  const data = await baseInstance.post(
    "/judge/submissions",
    submission,
    config,
  );
  return data.data;
};

export const getResult = async (token: JudgeToken) => {
  const data = await baseInstance
    .get(`/judge/submissions/${token.token}`, config)
    .catch(() => {
      return getBase64Result(token);
    });
  return data.data;
};

const getBase64Result = async (token: JudgeToken) => {
  const data = await baseInstance
    .get(`/submissions/${token.token}?base64_encoded=true`, config)
    .then((response) => {
      return {
        status: response.status,
        data: {
          ...response.data,
          base64: true,
        },
      };
    });
  return data;
};

// List of common languages Judge0 can accept, alongside Monaco Editor's language setting
export const supportedLanguages = [
  {
    id: 75,
    name: "C (Clang 7.0.1)",
    editor: "c",
  },
  {
    id: 76,
    name: "C++ (Clang 7.0.1)",
    editor: "cpp",
  },
  {
    id: 48,
    name: "C (GCC 7.4.0)",
    editor: "c",
  },
  {
    id: 52,
    name: "C++ (GCC 7.4.0)",
    editor: "cpp",
  },
  {
    id: 49,
    name: "C (GCC 8.3.0)",
    editor: "c",
  },
  {
    id: 53,
    name: "C++ (GCC 8.3.0)",
    editor: "cpp",
  },
  {
    id: 50,
    name: "C (GCC 9.2.0)",
    editor: "c",
  },
  {
    id: 54,
    name: "C++ (GCC 9.2.0)",
    editor: "cpp",
  },
  {
    id: 51,
    name: "C# (Mono 6.6.0.161)",
    editor: "csharp",
  },
  {
    id: 60,
    name: "Go (1.13.5)",
    editor: "go",
  },
  {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
    editor: "java",
  },
  {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    editor: "javascript",
  },
  {
    id: 70,
    name: "Python (2.7.17)",
    editor: "python",
  },
  {
    id: 71,
    name: "Python (3.8.1)",
    editor: "python",
  },
  {
    id: 80,
    name: "R (4.0.0)",
    editor: "r",
  },
  {
    id: 72,
    name: "Ruby (2.7.0)",
    editor: "ruby",
  },
  {
    id: 73,
    name: "Rust (1.40.0)",
    editor: "rust",
  },
  {
    id: 82,
    name: "SQL (SQLite 3.27.2)",
    editor: "sql",
  },
  {
    id: 74,
    name: "TypeScript (3.7.4)",
    editor: "typescript",
  },
];

export const getLanguage = (langId: number) => {
  const language = supportedLanguages.filter(
    (language) => language.id == langId,
  );
  if (!language) {
    console.error("No such language");
    return;
  }
  return language[0].name;
};
