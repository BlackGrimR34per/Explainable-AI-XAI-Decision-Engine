from fastapi import FastAPI

from api.decision import router as decision_router

app = FastAPI(
    title="Explainable AI Loan Decision Engine",
    version="0.1.0"
)

app.include_router(decision_router, prefix="/decision", tags=["Decision"])
