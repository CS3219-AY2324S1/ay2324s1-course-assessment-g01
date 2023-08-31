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

export const getQuestion = (id: string) => {
  const savedQuestions = localStorage.getItem("questions");
  const question = JSON.parse(savedQuestions!).find(
    (question: Question) => question.id === id,
  ) as Question;

  if (!question) throw new Error();
  return question;
};

export const deleteQuestion = (id: string) => {
  const savedQuestions = localStorage.getItem("questions");
  const newQuestions = JSON.parse(savedQuestions!).filter(
    (question: Question) => question.id !== id,
  );

  localStorage.setItem("questions", JSON.stringify(newQuestions));
  return Promise.resolve(newQuestions as Question[]);
};

export const addQuestion = (question: Question) => {
  const savedQuestions: Question[] = JSON.parse(
    localStorage.getItem("questions")!,
  );
  for (const q of savedQuestions) {
    if (q.title === question.title)
      return Promise.reject("Question with this title exists");
  }

  const newQuestions = [...savedQuestions, question];

  localStorage.setItem("questions", JSON.stringify(newQuestions));
  return Promise.resolve(newQuestions as Question[]);
};