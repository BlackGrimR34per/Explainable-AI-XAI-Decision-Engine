from fastapi import FastAPI
from api.decision import router as decision_router
from api.explanation import router as explanation_router
from api.what_if import router as what_if_router
from api.audit import router as audit_router

app = FastAPI(
    title="Explainable AI Decision Engine",
    version="0.2.0"
)

# Include all routers
app.include_router(decision_router, prefix="/decision", tags=["Decision"])
app.include_router(explanation_router, prefix="/explanation", tags=["Explanation"])
app.include_router(what_if_router, prefix="/what-if", tags=["What-If"])
app.include_router(audit_router, prefix="/audit", tags=["Audit"])

