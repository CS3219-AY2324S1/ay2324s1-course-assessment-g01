import { mockQuestions } from "../mock/mockQuestions";
import { Question } from "../types/Question";

export const getQuestions: () => Question[] = () => {
  let savedQuestions = localStorage.getItem("questions");
  if (savedQuestions == null) {
    savedQuestions = JSON.stringify(mockQuestions);
    localStorage.setItem("questions", savedQuestions);
    return mockQuestions;
  }
  return JSON.parse(savedQuestions);
};
