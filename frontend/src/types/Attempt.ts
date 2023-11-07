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
  "question_id":  string;
  "user_id": number;
  "code": string;
  "language": string;
  "passed": boolean;
};