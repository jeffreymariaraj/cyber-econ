from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.core.database import db
from app.routers import assets

load_dotenv()

app = FastAPI(title="Cyber-Econ API", description="Cyber-Econ Risk Quantification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, specify the exact origin like "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    db.connect()

@app.on_event("shutdown")
def shutdown_db_client():
    db.close()

app.include_router(assets.router)

@app.get("/")
async def root():
    return {"message": "Cyber-Econ API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
