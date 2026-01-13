import hashlib
import json
import time
from config import MODEL_VERSION

LOG_FILE = "logs/audit.log"

class AuditLogger:
    @staticmethod
    def hash_input(input_data: dict) -> str:
        data_bytes = json.dumps(input_data, sort_keys=True).encode("utf-8")
        return hashlib.sha256(data_bytes).hexdigest()

    @staticmethod
    def log_decision(input_data: dict, decision_output: dict, explanation: dict = None, policy_refs: list = None):
        record = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "input_hash": AuditLogger.hash_input(input_data),
            "decision": decision_output,
            "explanation": explanation,
            "policy_references": policy_refs or [],
            "model_version": MODEL_VERSION
        }

        with open(LOG_FILE, "a") as f:
            f.write(json.dumps(record) + "\n")
