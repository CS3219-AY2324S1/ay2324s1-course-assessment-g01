import { Question } from "./Question";

export type Collab = {
  room_id: number;
  question_id: string;
  user_a_id: number;
  user_b_id: number;
  created_on: string;
};

export type CollabResponse = {
  collaboration: Collab;
  question: Question;
}