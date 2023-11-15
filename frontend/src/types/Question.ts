export enum Complexity {
  easy = "Easy",
  medium = "Medium",
  hard = "Hard",
}

export type Question = {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  complexity: Complexity;
};
