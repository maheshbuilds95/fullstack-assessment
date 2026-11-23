from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import claims, dashboard

Base.metadata.create_all(bind=engine)  # creates tables if they don't exist

app = FastAPI(title="Claims Management API")

# Allow the React app (port 5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(claims.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "Claims API is running"}