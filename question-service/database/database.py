from typing import List
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from motor import motor_asyncio
from motor.core import AgnosticClient, AgnosticDatabase
from models.models import Question, MongoQuestion
from config.config import Settings

client: AgnosticClient = None
db: AgnosticDatabase = None


# Initialize Database
def init_database():
    global db
    client: AgnosticClient = motor_asyncio.AsyncIOMotorClient(Settings().mongodb_url)
    db = client.questions


# Get random easy question
async def get_easy_question():
    data: List[MongoQuestion] = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"complexity": "easy"}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )
    if len(data) == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    question: Question = {
        "id": str(data[0]["_id"]),
        "title": data[0]["title"],
        "description": data[0]["description"],
        "categories": data[0]["categories"],
        "complexity": data[0]["complexity"],
    }
    return question


# Get random medium question
async def get_medium_question():
    data = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"complexity": "medium"}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )
    if len(data) == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    question = {
        "id": str(data[0]["_id"]),
        "title": data[0]["title"],
        "description": data[0]["description"],
        "categories": data[0]["categories"],
        "complexity": data[0]["complexity"],
    }
    return question


# Get random hard question
async def get_hard_question() -> Question:
    data: List[Question] = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"complexity": "hard"}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )
    if len(data) == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    question: Question = {
        "id": str(data[0]["_id"]),
        "title": data[0]["title"],
        "description": data[0]["description"],
        "categories": data[0]["categories"],
        "complexity": data[0]["complexity"],
    }
    return question


# Add a question
async def add_question(question: Question) -> str:
    res = await db["questions"].insert_one(question.model_dump())
    if not res.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to add question")
    return JSONResponse(status_code=201, content=str(res.inserted_id))
