export enum Complexity {
    easy= "Easy",
    medium = "Medium",
    hard = "Hard"
}

// change id to number when database is up
export type Question = {
    id: string, 
    title: string,
    description: string,
    categories: string[],
    complexity: Complexity
}