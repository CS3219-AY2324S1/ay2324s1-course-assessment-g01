export enum Complexity {
    easy= "Easy",
    medium = "Medium",
    hard = "Hard"
}

export type Question = {
    id: number,
    title: string,
    description: string,
    categories: string[],
    complexity: Complexity
}