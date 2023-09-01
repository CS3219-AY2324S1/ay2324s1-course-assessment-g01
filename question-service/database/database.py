from typing import List
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from motor import motor_asyncio
from motor.core import AgnosticClient, AgnosticDatabase
from models.models import Question
from config.config import Settings

client: AgnosticClient = None
db: AgnosticDatabase = None


# Initialize Database
def init_database():
    global db
    client: AgnosticClient = motor_asyncio.AsyncIOMotorClient(Settings().mongodb_url)
    db = client.questions


# Get random easy question
async def get_easy_question() -> Question:
    question: List[Question] = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"difficulty": "easy"}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )
    return JSONResponse(status_code=200, content=question)


# Get random medium question
async def get_medium_question() -> Question:
    question: List[Question] = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"difficulty": "medium"}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )
    return JSONResponse(status_code=200, content=question)


# Get random hard question
async def get_hard_question() -> Question:
    question: List[Question] = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"difficulty": "hard"}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )
    return JSONResponse(status_code=200, content=question)


# Add a question
async def add_question(question: Question) -> Question:
    question: Question = await db["questions"].insert_one(question)
    return JSONResponse(status_code=201, content=question)
