from fastapi import APIRouter, HTTPException
import json

router = APIRouter()
LOG_FILE = "logs/audit.log"

@router.get("/audit/{decision_id}")
def get_audit(decision_id: str):
    try:
        with open(LOG_FILE, "r") as f:
            for line in f:
                record = json.loads(line)
                if record["decision"]["decision_id"] == decision_id:
                    return record
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Audit log not found")

    raise HTTPException(status_code=404, detail="Decision ID not found")
