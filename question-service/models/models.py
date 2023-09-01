from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoQuestion(BaseModel):
    # MongoDB _id fields urecognised by Pydantic without an alias
    id: int = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    categories: List[str]
    complexity: str

    class Config:
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "Programming question",
                "description": "Answer this easy question",
                "category": ["array", "string"],
                "complexity": "easy",
            }
        }


class Question(BaseModel):
    id: str
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
