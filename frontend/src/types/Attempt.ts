import { Question } from "./Question";

export type Attempt = {
  attempt_id: number;
  question_id: string;
  user_id: number;
  code: string;
  language: string;
  passed: boolean;
  attempted_on: string;
};

export type PostAttempt = {
  question_id: string;
  user_id: number;
  code: string;
  language: string;
  passed: boolean;
};

export type AttemptResponse = {
  attempt: Attempt
  question: Question;
}