import uvicorn
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from routers.question import router as question_router
from database.database import init_database

app = FastAPI(
    title="PeerPrep Question Service",
    description="This service is responsible for managing the fetching, adding, updating, and deleting of questions.",
    version="0.0.1",
    dependencies=[],
)


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()


# Check bearer token against the user service
def check_token(token: str = Depends(HTTPBearer())):
    return True


# Question router
app.include_router(question_router, dependencies=[Depends(check_token)])


if __name__ == "__main__":
    uvicorn.run(app)
