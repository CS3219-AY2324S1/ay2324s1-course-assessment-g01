from pydantic import BaseModel, Field
from typing import List


class Question(BaseModel):
    # MongoDB _id fields urecognised by Pydantic without an alias
    id: int = Field(..., alias="_id")
    title: str
    description: str
    categories: List[str]
    complexity: str

    class Config:
        schema_extra = {
            "example": {
                "title": "Programming question",
                "description": "Answer this easy question",
                "category": ["array", "string"],
                "complexity": "easy",
            }
        }
