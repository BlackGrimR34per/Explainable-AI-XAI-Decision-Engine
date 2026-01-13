# 🔍 LoanLens

**AI Decision Transparency Dashboard** — Turn black-box AI into crystal-clear decisions.

![LoanLens](https://img.shields.io/badge/React-18.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3-cyan) ![Chart.js](https://img.shields.io/badge/Chart.js-4.4-orange)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to see the dashboard.

---

## 📖 Project Overview

LoanLens transforms opaque AI lending decisions into transparent, actionable insights for three key stakeholders:

| Persona | Goal | Key Features |
|---------|------|--------------|
| **Customer** | Understand why | Plain-English explanations, improvement tips, what-if simulator |
| **Loan Officer** | Make decisions | Factor analysis, SHAP charts, policy context, approve/deny actions |
| **Regulator** | Ensure compliance | Audit trail, regulation mapping, fairness metrics |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOANLENS FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Loan App] → [Black-Box Model] → [Explainability Layer]        │
│                                          ↓                      │
│                              ┌───────────┴───────────┐          │
│                              │                       │          │
│                         [SHAP Values]         [Decision Rules]  │
│                              │                       │          │
│                              └───────────┬───────────┘          │
│                                          ↓                      │
│                                   [RAG Layer]                   │
│                                   (Policies, Cases,             │
│                                    Regulations)                 │
│                                          ↓                      │
│                                [What-If Engine]                 │
│                                          ↓                      │
│                            ┌─────────────┼─────────────┐        │
│                            ↓             ↓             ↓        │
│                      [Customer]    [Officer]    [Regulator]     │
│                         View          View          View        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
src/
├── App.jsx                    # Main app with persona tabs
├── index.css                  # Tailwind + custom styles
├── data/
│   └── mockData.js            # Mock applications & decisions
├── components/
│   ├── layout/
│   │   ├── Header.jsx         # App header with persona tabs
│   │   └── Sidebar.jsx        # Application selector
│   ├── shared/
│   │   ├── Card.jsx           # Reusable card component
│   │   └── WhatIfSlider.jsx   # Interactive slider
│   ├── visualizations/
│   │   ├── FactorChart.jsx    # SHAP bar chart (Chart.js)
│   │   ├── DecisionFlow.jsx   # Decision tree visualization
│   │   └── GaugeChart.jsx     # Confidence gauge
│   └── views/
│       ├── CustomerView.jsx   # Simplified explanation
│       ├── OfficerView.jsx    # Detailed analysis
│       └── RegulatorView.jsx  # Compliance focus
```

---

## 🎭 Demo Narrative

### The Story: "Three Perspectives, One Truth"

**Setup (30 seconds)**
> "Every year, millions of people are rejected for loans by AI systems they don't understand. 
> Today we're changing that with LoanLens — a transparency layer that explains AI decisions 
> to everyone who needs to know."

**Act 1: The Customer (60 seconds)**
> "Meet Sarah. She just applied for a mortgage and got approved at 6.25%. But why that rate?
> 
> [Show Customer View]
> 
> Sarah sees her decision broken down into factors she understands: her strong credit score 
> helped, but her single late payment last year nudged her rate slightly higher.
> 
> [Demo What-If Simulator]
> 
> She can even explore: 'If I had paid down more debt, what rate could I have gotten?' 
> The answer: 5.875%. Now she knows exactly what to do before refinancing."

**Act 2: The Loan Officer (60 seconds)**
> "Now let's see what Marcus at the bank sees.
> 
> [Switch to Officer View]
> 
> He gets the full picture: SHAP values showing exactly how each factor weighted the decision,
> the rules that fired, and most importantly — similar past cases from the RAG system.
> 
> [Show Policy Context]
> 
> The AI cites the exact internal policy and regulation that applies. No more guessing, 
> no more inconsistency between officers."

**Act 3: The Regulator (60 seconds)**
> "Finally, the auditor's view.
> 
> [Switch to Regulator View]
> 
> Complete compliance checklist against ECOA, FCRA, and TILA. A timestamped audit trail 
> of every system action. Fairness metrics showing the model performs consistently across 
> demographics.
> 
> [Highlight Audit Trail]
> 
> Every decision is traceable. Every factor is documented. Every regulation is mapped."

**Closing (30 seconds)**
> "LoanLens doesn't change what the AI decides — it illuminates HOW it decides.
> 
> In a world demanding AI accountability, we don't just open the black box. 
> We turn it into a glass box.
> 
> Questions?"

---

## 💡 Key Features to Highlight

### 1. **SHAP Factor Analysis**
- Horizontal bar chart showing positive/negative impact
- Sorted by importance
- Color-coded (teal = positive, rose = negative)

### 2. **Decision Flow Visualization**
- Interactive flowchart showing the decision path
- Highlights which branches were taken
- Shows thresholds at each decision point

### 3. **What-If Simulator**
- Real-time sliders for key factors
- Instant confidence recalculation
- Pre-built counterfactual scenarios

### 4. **RAG Context**
- Internal policies surfaced automatically
- Regulatory citations (ECOA, FCRA, TILA)
- Similar past cases with similarity scores

### 5. **Complete Audit Trail**
- Timestamped events
- Actor tracking (system vs human)
- Exportable for compliance

---

## 🎨 Design Decisions

| Choice | Rationale |
|--------|-----------|
| **Dark theme** | Conveys sophistication, reduces eye strain for officers |
| **Teal accent** | Stands out from typical fintech blue, suggests transparency |
| **Monospace for data** | JetBrains Mono ensures clarity for numbers |
| **Animated gauges** | Draws attention, feels premium |
| **Minimal UI** | Focus on the data, not decoration |

---

## 🛠️ Extending the Project

### Add Real Backend
Replace `mockData.js` with API calls:

```javascript
// Example: Fetch application
const response = await fetch(`/api/applications/${id}`);
const application = await response.json();
```

### Add More Visualizations
- Partial dependence plots
- Feature interaction heatmaps
- Fairness comparison charts

### Integrate Real Explainability
- Connect to SHAP library output
- Pull from Alibi Explain
- Integrate LIME explanations

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS 3.3 |
| **Charts** | Chart.js 4.4 |
| **Animations** | Framer Motion |
| **Fonts** | DM Sans + JetBrains Mono |

---

## 🏆 Hackathon Tips

1. **Lead with the problem** — "AI decisions affect millions but explain nothing"
2. **Show, don't tell** — Demo each persona view live
3. **Make it personal** — "Imagine YOU got denied and didn't know why"
4. **End with impact** — "Every decision documented. Every regulation mapped."

---

## 📄 License

MIT — Build on this freely for your hackathon!

---

**Built with 🔍 by your team**
