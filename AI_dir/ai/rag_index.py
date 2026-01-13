import chromadb
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from fastapi import FastAPI
import os
import ollama
import pandas as pd

client = chromadb.Client()
collection = client.get_or_create_collection(name="banking_policies")

# AI_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

model = SentenceTransformer("all-MiniLM-L6-v2")

def load_docs(folder):
    docs = []
    for file in os.listdir(folder):
        with open(os.path.join(folder, file), "r") as f:
            docs.append(f.read())
    return docs

docs = load_docs("rag_docs")
embeddings = model.encode(docs)

collection.add(
    documents=docs,
    embeddings=embeddings.tolist(),
    ids=[f"doc_{i}" for i in range(len(docs))]
)

def generate_narrative(decision, confidence, reasons):
    query_text = f"""
    Decision: {decision}
    Confidence: {confidence}
    Reasons:
    {', '.join([r['explanation'] for r in reasons])}
    """

    results = collection.query(query_texts=[query_text], n_results=2)
    context = " ".join(results["documents"][0])

    prompt = f"""
    Using the following banking policies:
    {context}

    Explain this loan decision clearly to a customer in simple language.
    """

    return call_llm(prompt)

def call_llm(prompt):
    response = ollama.chat(
        model="llama3",
        messages=[
            {
                "role": "system",
                "content": "You are a banking compliance assistant. Explain decisions clearly and accurately."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    return response["message"]["content"]

app = FastAPI()

@app.post("/predict")
def predict(application: dict):

    # Convert input to model format
    X = pd.DataFrame([application]).drop(columns=["applicationId"])

    # Model prediction
    prob = model.predict_proba(X)[0][1]
    decision = "APPROVED" if prob >= 0.5 else "REJECTED"

    # SHAP reasons
    reasons = extract_shap_reasons(X)

    # RAG explanation
    explanation = generate_narrative(decision, prob, reasons)

    # ✅ THIS RETURN IS WHAT GOES TO THE FRONTEND
    return {
        "applicationId": application["applicationId"],
        "decision": decision,
        "confidence": round(prob, 3),
        "reasons": reasons,
        "explanation": explanation
    }


if __name__ == "__main__":
    decision = "APPROVED"
    confidence = 0.87

    reasons = [
        {"explanation": "Strong credit history"},
        {"explanation": "Stable employment"},
        {"explanation": "Manageable debt level"}
    ]

    explanation = generate_narrative(decision, confidence, reasons)
    print("\n=== MODEL EXPLANATION ===\n")
    print(explanation)

