import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from routers.questions import router as question_router, admin_router
from database.database import init_database
from typing_extensions import Annotated
import jwt


app = FastAPI(
    title="PeerPrep Question Service",
    description="This service is responsible for managing the fetching, adding, updating, and deleting of questions.",
    version="0.0.1",
    dependencies=[],
)


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await init_database()


# Check bearer token against the user service
def check_token(token: HTTPAuthorizationCredentials = Depends(HTTPBearer())) -> str:
    try:
        decoded = jwt.decode(token.credentials, options={"verify_signature": False})
        return decoded["roles"]
    except jwt.DecodeError:
        raise HTTPException(status_code=401, detail="Not authenticated")


def is_admin(access_type: Annotated[int, Depends(check_token)]):
    if access_type != 1:
        raise HTTPException(status_code=403, detail="Not an admin")


# Routers
app.include_router(question_router)
app.include_router(admin_router, dependencies=[Depends(is_admin)])


if __name__ == "__main__":
    uvicorn.run(app)
