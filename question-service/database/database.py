from typing import List
from motor import motor_asyncio
from motor.core import AgnosticClient
from models.models import Question, QuestionWithId, Complexity, convert
from config.config import Settings
from bson import ObjectId


# Initialize database
def init_database():
    global db
    client: AgnosticClient = motor_asyncio.AsyncIOMotorClient(Settings().mongodb_url)
    db = client.questions


# Get all questions
async def get_questions() -> List[QuestionWithId]:
    data: List = await db["questions"].find().to_list(length=None)
    questions: List[QuestionWithId] = [convert(question) for question in data]
    return questions


async def get_specific_question(question_id: str) -> QuestionWithId:
    # find one with id
    data = await db["questions"].find_one({"_id": ObjectId(question_id)})
    if data is None:
        raise Exception("Question not found")
    return convert(data)


# Get random question of specified difficulty
async def get_random_question(complexity: Complexity) -> QuestionWithId:
    data: List = (
        await db["questions"]
        .aggregate(
            [
                {"$match": {"complexity": complexity.value}},
                {"$sample": {"size": 1}},
            ]
        )
        .to_list(length=1)
    )

    # Check if data is empty
    if len(data) == 0:
        raise Exception("Question not found")

    # Return the first element
    questions: List[QuestionWithId] = [convert(question) for question in data]
    return questions[0]


# Add a question
async def add_question(question: Question) -> str:
    res = await db["questions"].insert_one(question.model_dump())

    # Check if inserted
    if not res.acknowledged:
        raise Exception("Failed to insert question")

    return str(res.inserted_id)


# Update a question
async def update_question(question: QuestionWithId) -> str:
    res = await db["questions"].update_one(
        {"_id": ObjectId(question.id)}, {"$set": question.model_dump()}
    )

    # Check if updated
    if not res.acknowledged or res.modified_count != 1:
        raise Exception("Failed to update question")

    return str(res.upserted_id)


# Delete a question
async def delete_question(question_id: str) -> int:
    res = await db["questions"].delete_one({"_id": ObjectId(question_id)})

    # Check if deleted
    if not res.acknowledged or res.deleted_count != 1:
        raise Exception("Failed to delete question", res.acknowledged)

    return res.deleted_count
