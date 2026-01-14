import chromadb
from sentence_transformers import SentenceTransformer
import ollama

client = chromadb.Client()
collection = client.get_or_create_collection("banking_policies")

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def retrieve_context(query_text):
    results = collection.query(query_texts=[query_text], n_results=2)
    return " ".join(results["documents"][0])

def generate_narrative(decision, confidence, reasons):
    query_text = f"""
    Decision: {decision}
    Confidence: {confidence}
    Reasons: {', '.join([r['explanation'] for r in reasons])}
    """

    context = retrieve_context(query_text)

    prompt = f"""
    You are a banking assistant.

    Policies:
    {context}

    Explain the loan decision clearly to a customer.
    """

    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "system", "content": "Explain decisions clearly and accurately."},
            {"role": "user", "content": prompt}
        ]
    )

    return response["message"]["content"]
