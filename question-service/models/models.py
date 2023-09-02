from pydantic import BaseModel, Field
from typing import List
from enum import Enum


class Complexity(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"


class Question(BaseModel):
    title: str
    description: str
    categories: List[str]
    complexity: Complexity

    class Config:
        schema_extra = {
            "example": {
                "title": "Programming question",
                "description": "Answer this easy question",
                "categories": ["Array", "String"],
                "complexity": "Easy",
            }
        }


class QuestionWithId(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    description: str
    categories: List[str]
    complexity: Complexity

    class Config:
        schema_extra = {
            "example": {
                "_id": "5f8f1a9b9d9b4b3d9c1d9c7a",
                "title": "Programming question",
                "description": "Answer this easy question",
                "categories": ["Array", "String"],
                "complexity": "Easy",
            }
        }


def convert(question: dict) -> QuestionWithId:
    return QuestionWithId(
        _id=str(question["_id"]),
        title=question["title"],
        description=question["description"],
        categories=question["categories"],
        complexity=str(question["complexity"]),
    )
