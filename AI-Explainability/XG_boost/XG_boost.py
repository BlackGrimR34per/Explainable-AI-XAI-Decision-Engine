import pandas as pd
import numpy as np
import shap
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

REASON_MAP = {
    "ctosScore": {
        "positive": "Strong credit history",
        "negative": "Weak credit history"
    },
    "newDebtServiceRatio": {
        "positive": "Post-loan debt remains manageable",
        "negative": "High debt burden after loan"
    },
    "employmentTenureMonths": {
        "positive": "Long and stable employment history",
        "negative": "Short employment history"
    },
    "instalmentToIncomeRatio": {
        "positive": "Loan instalment is affordable",
        "negative": "Loan instalment is too high relative to income"
    }
}

def get_reason(feature, impact):
    if feature not in REASON_MAP:
        return feature

    return (
        REASON_MAP[feature]["positive"]
        if impact > 0
        else REASON_MAP[feature]["negative"]
    )

df = pd.read_csv("/Users/ysheraun/Documents/Codying/Proproprojects/Explainable-AI-XAI-Decision-Engine/AI_dir/input/output_file.csv")

X = df.drop(columns=['applicationId', 'approvalDecision'], axis=1)
y = df['approvalDecision']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=123)
model = XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, eval_metric="logloss", random_state=123)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
# print(f"Test Accuracy: {accuracy:.2f}")

y_prob = model.predict_proba(X_test)
# print("Sample approval probability:", y_prob[0])

model.save_model("xgboost_model.json")

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

index = 0
x = X_test.iloc[index : index + 1]
shap_vals = explainer.shap_values(x)

features = x.columns
impacts = shap_vals[0]

top_idx = np.argsort(np.abs(impacts))[::-1][:3]

reasons = [
    {
        "feature": features[i],
        "impact": float(impacts[i]),
        "reason": get_reason(features[i], impacts[i])
    }
    for i in top_idx
]

for r in reasons:
    print(f"{r['reason']} (impact: {r['impact']:.3f})")

pred_class = model.predict(x)[0]
pred_prob = model.predict_proba(x)[0]

print("Predicted class:", "APPROVED" if pred_class == 1 else "REJECTED")
print(f"Approval probability: {pred_prob[1]:.3f}")