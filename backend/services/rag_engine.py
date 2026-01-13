POLICY_STORE = {
    "HIGH_DTI_RATIO": {
        "document": "Retail Credit Policy v3.2",
        "section": "4.1.2",
        "summary": "Debt-to-income ratio for unsecured loans should not exceed 40%"
    },
    "LOW_CASH_BUFFER": {
        "document": "Retail Credit Policy v3.2",
        "section": "4.2.1",
        "summary": "Applicants should maintain at least 3 months of cash reserves"
    }
}

class RAGEngine:
    @staticmethod
    def retrieve(reason_codes: list) -> list:
        references = []
        for code in reason_codes:
            if code in POLICY_STORE:
                references.append(POLICY_STORE[code])
        return references
