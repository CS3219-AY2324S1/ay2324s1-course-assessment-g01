enum Complexity {
    easy= "Easy",
    medium = "Medium",
    hard = "Hard"
}

export type Question = {
    id: number,
    title: number,
    description: string,
    category: string,
    complexity: Complexity
}