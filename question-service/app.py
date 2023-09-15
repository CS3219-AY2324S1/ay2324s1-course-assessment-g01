import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from routers.questions import router as question_router, admin_router
from database.database import init_database
import requests
from typing_extensions import Annotated


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
def check_token(token: HTTPAuthorizationCredentials = Depends(HTTPBearer())) -> int:
    res = requests.post(
        url="http://user-service:3000/api/v1/user",
        headers={"Authorization": "Bearer {}".format(token.credentials)},
    )

    if not res.ok:
        raise HTTPException(status_code=401)
    return res.json()


def is_admin(access_type: Annotated[int, Depends(check_token)]):
    if access_type != 2:
        raise HTTPException(status_code=403, detail="Not an admin")


# Routers
app.include_router(question_router, dependencies=[Depends(check_token)])
app.include_router(admin_router, dependencies=[Depends(is_admin)])


if __name__ == "__main__":
    uvicorn.run(app)
