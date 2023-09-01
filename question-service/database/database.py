from typing import List
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from motor import motor_asyncio
from motor.core import AgnosticClient, AgnosticDatabase
from models.models import Question
from config.config import Settings
from bson import ObjectId

client: AgnosticClient = None
db: AgnosticDatabase = None


# Initialize Database
def init_database():
    global db
    client: AgnosticClient = motor_asyncio.AsyncIOMotorClient(Settings().mongodb_url)
    db = client.questions


# Get all questions
async def get_questions() -> List[Question]:
    questions: List[Question] = await db["questions"].find().to_list(length=100)
    return questions


# Get random easy question
async def get_easy_question():
    data: List[Question] = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"complexity": "easy"}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )

    # Check if data is empty
    if len(data) == 0:
        raise HTTPException(status_code=404, detail="Question not found")

    # Return the first element
    return data[0]


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

    # Check if data is empty
    if len(data) == 0:
        raise HTTPException(status_code=404, detail="Question not found")

    # Return the first element
    return data[0]


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

    # Check if data is empty
    if len(data) == 0:
        raise HTTPException(status_code=404, detail="Question not found")

    # Return the first element
    return data[0]


# Add a question
async def add_question(question: Question) -> str:
    res = await db["questions"].insert_one(question.model_dump())
    if not res.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to add question")
    return JSONResponse(status_code=201, content=str(res.inserted_id))


# Update a question
async def update_question(question: Question):
    res = await db["questions"].update_one(
        {"_id": ObjectId(question.id)}, {"$set": question.model_dump()}
    )
    if not res.acknowledged or res.modified_count != 1:
        raise HTTPException(status_code=500, detail="Failed to update question")
    return JSONResponse(status_code=200, content=str(res.upserted_id))


# Delete a question
async def delete_question(question_id: str):
    res = await db["questions"].delete_one({"_id": ObjectId(question_id)})
    if not res.acknowledged or res.deleted_count != 1:
        raise HTTPException(status_code=500, detail="Failed to delete question")
    return JSONResponse(status_code=200, content=str(res.deleted_count))
