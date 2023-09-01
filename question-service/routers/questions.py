from fastapi import APIRouter
import database.database as db
from models.models import Question
from typing import List

router = APIRouter(
    prefix="/api/questions",
    tags=["Questions"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal Server Error"},
    },
)


@router.get("/", description="Get all questions")
async def get_questions() -> List[Question]:
    questions: List[Question] = await db.get_questions()
    return questions


@router.get("/easy", description="Get random easy question")
async def get_easy_question() -> Question:
    question: Question = await db.get_easy_question()
    return question


@router.get("/medium", description="Get random medium question")
async def get_medium_question() -> Question:
    question: Question = await db.get_medium_question()
    return question


@router.get("/hard", description="Get random hard question")
async def get_hard_question() -> Question:
    question: Question = await db.get_hard_question()
    return question


@router.post("/", description="Add a question")
async def add_question(question: Question) -> str:
    id: str = await db.add_question(question)
    return id


@router.put("/{question_id}", description="Update a question")
async def update_question(question: Question):
    id = await db.update_question(question)
    return id


@router.delete("/{question_id}", description="Delete a question")
async def delete_question(question_id: str):
    count = await db.delete_question(question_id)
    return count
