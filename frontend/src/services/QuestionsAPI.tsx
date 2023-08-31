import { mockQuestions } from "../mock/mockQuestions";
import { Question } from "../types/Question";

const setDefaultQuestions = () => {
  localStorage.setItem("questions", JSON.stringify(mockQuestions));
  return mockQuestions;
};

if (localStorage.getItem("questions") == null) {
  setDefaultQuestions();
}

export const getQuestions = () => {
  const savedQuestions = localStorage.getItem("questions");
  return JSON.parse(savedQuestions!) as Question[];
};

export const getQuestion = (id: number) => {
  const savedQuestions = localStorage.getItem("questions");
  const question = JSON.parse(savedQuestions!).find(
    (question: Question) => question.id === id,
  ) as Question;

  if (!question) throw new Error();
  return question;
};

export const deleteQuestion = (id: number) => {
  const savedQuestions = localStorage.getItem("questions");
  const newQuestions = JSON.parse(savedQuestions!).filter(
    (question: Question) => question.id !== id,
  );

  localStorage.setItem("questions", JSON.stringify(newQuestions));
  return Promise.resolve(newQuestions as Question[]);
};

// export const addQuestion = (question: Question) => {

// };
