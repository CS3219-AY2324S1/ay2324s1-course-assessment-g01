// import { mockQuestions } from "../mock/mockQuestions";
import { Question } from "../types/Question";
import { baseInstance } from "./apiInstance";

// const setDefaultQuestions = () => {
//   localStorage.setItem("questions", JSON.stringify(mockQuestions));
//   return mockQuestions;
// };

// if (localStorage.getItem("questions") == null) {
//   setDefaultQuestions();
// }

export const getQuestions = async () => {
  const data = await baseInstance.get<Question[]>("/questions");
  return data.data;
};

export const getQuestion = async (id: string) => {
  const data = await baseInstance.get<Question>(`/questions/${id}`);
  return data.data;
};

export const deleteQuestion = async (id: string) => {
  const data = await baseInstance.delete(`/questions/${id}`);
  return data.data;
};

export const addQuestion = async (question: Omit<Question, "_id">) => {
  const data = await baseInstance.post("/questions", question);
  return data.data;
};
