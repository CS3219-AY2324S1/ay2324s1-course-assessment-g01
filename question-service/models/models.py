from pydantic import BaseModel, Field
from typing import List


class Question(BaseModel):
    title: str
    description: str
    categories: List[str]
    complexity: str

    class Config:
        schema_extra = {
            "example": {
                "title": "Programming question",
                "description": "Answer this easy question",
                "categories": ["array", "string"],
                "complexity": "easy",
            }
        }


class QuestionWithId(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    description: str
    categories: List[str]
    complexity: str

    class Config:
        schema_extra = {
            "example": {
                "title": "Programming question",
                "description": "Answer this easy question",
                "categories": ["array", "string"],
                "complexity": "easy",
            }
        }


def convert(question: dict) -> QuestionWithId:
    return QuestionWithId(
        _id=str(question["_id"]),
        title=question["title"],
        description=question["description"],
        categories=question["categories"],
        complexity=question["complexity"],
    )
