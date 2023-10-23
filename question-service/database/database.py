from typing import List
from motor import motor_asyncio
from motor.core import AgnosticClient
from models.models import Question, QuestionWithId, Complexity, convert
from config.config import Settings
from bson import ObjectId
import requests
import logging
import asyncio


# Initialize database
async def init_database():
    global db
    client: AgnosticClient = motor_asyncio.AsyncIOMotorClient(Settings().mongodb_url)
    db = client.questions
    asyncio.create_task(update_db())


# Run cloud function once a day to update DB with latest questions
async def update_db() -> None:
    while True:
        try:
            print("Running cloud function")
            # Fetch data from cloud function and update each question if necessary
            res = requests.get(Settings().questions_url).json()
            questions = [
                Question(
                    title=ques["title"],
                    description=ques["description"],
                    categories=ques["categories"],
                    complexity=Complexity(ques["complexity"]),
                )
                for ques in res
            ]
            for question in questions:
                _ = await sync_question(question)
            # create index for quickly checking question titles
            db["questions"].create_index(keys=["title"])
            # wait for an hour
            await asyncio.sleep(60)
        except Exception as e:
            logging.error(f"{e}")


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
    # Do not add questions manually with the same title
    check_presence = await db["questions"].find_one({"title": question.title})
    if not check_presence:
        res = await db["questions"].insert_one(question.model_dump())

        # Check if inserted
        if not res.acknowledged:
            raise Exception("Failed to insert question")

        return str(res.inserted_id)
    else:
        return "Question exists with id: " + str(check_presence["_id"])


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


# Sync question with Leetcode
async def sync_question(question: Question) -> str:
    check_presence = await db["questions"].find_one({"title": question.title})
    # replace question if it exists
    if check_presence:
        db["questions"].delete_one({"title": question.title})
    res = await db["questions"].insert_one(question.model_dump())

    # Check if inserted
    if not res.acknowledged:
        raise Exception("Failed to insert question")

    return str(res.inserted_id)
