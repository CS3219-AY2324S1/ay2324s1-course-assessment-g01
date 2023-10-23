from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
import database.database as db
from models.models import Question, QuestionWithId, Complexity
from typing import List
import logging

router = APIRouter(
    prefix="/api/v1/questions",
    tags=["General"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal Server Error"},
    },
)

admin_router = APIRouter(
    prefix="/api/v1/questions",
    tags=["Admin"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal Server Error"},
    },
)


@router.get("/", description="Get all questions")
async def get_questions() -> List[QuestionWithId]:
    try:
        questions: List[QuestionWithId] = await db.get_questions()
        return questions
    except Exception as e:
        logging.error(f"get_questions | {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/easy", description="Get random easy question")
async def get_easy_question() -> QuestionWithId:
    try:
        question: QuestionWithId = await db.get_random_question(Complexity.EASY)
        return question
    except Exception as e:
        logging.error(f"get_easy_question | {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/medium", description="Get random medium question")
async def get_medium_question() -> QuestionWithId:
    try:
        question: QuestionWithId = await db.get_random_question(Complexity.MEDIUM)
        return question
    except Exception as e:
        logging.error(f"get_medium_question | {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/hard", description="Get random hard question")
async def get_hard_question() -> QuestionWithId:
    try:
        question: QuestionWithId = await db.get_random_question(Complexity.HARD)
        return question
    except Exception as e:
        logging.error(f"get_hard_question | {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/{question_id}", description="Get a specific question")
async def get_specific_question(question_id: str) -> QuestionWithId:
    try:
        question: QuestionWithId = await db.get_specific_question(question_id)
        return question
    except Exception as e:
        logging.error(f"get_specific_question | {str(e)}")
        raise HTTPException(
            status_code=404, detail=f"No question with id={question_id} exists"
        )


@admin_router.post(
    "/", description="Add a question if a question with the same title does not exist"
)
async def add_question(question: Question) -> JSONResponse:
    try:
        id: str = await db.add_question(question)
        logging.info(f"Added question with id: {id}")
        return JSONResponse(status_code=201, content=id)
    except Exception as e:
        logging.error(f"add_question | {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@admin_router.put("/", description="Update a question")
async def update_question(question: QuestionWithId):
    try:
        id: str = await db.update_question(question)
        logging.info(f"Updated question with id: {id}")
        return JSONResponse(status_code=202, content=id)
    except Exception as e:
        logging.error(f"update_question | {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@admin_router.delete("/{question_id}", description="Delete a question")
async def delete_question(question_id: str):
    try:
        count: int = await db.delete_question(question_id)
        logging.info(f"Deleted question with id: {question_id}")
        return JSONResponse(status_code=200, content=count)
    except Exception as e:
        logging.error(f"delete_question | {str(e)}")
        raise HTTPException(status_code=400, detail="Question not found")
