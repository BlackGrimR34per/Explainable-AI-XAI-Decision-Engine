// Mock data matching FastAPI response format
// Adapted for Malaysian lending context (CTOS, RM currency)

export const mockApplications = [
  {
    id: 'LA-2026-000001',
    applicant: {
      name: 'Ahmad Rizal bin Hassan',
      email: 'ahmad.rizal@email.com',
      phone: '+60 12-345 6789',
      icNumber: '880515-14-XXXX',
    },
    loanDetails: {
      type: 'Personal Loan',
      amount: 50000, // RM
      term: 60, // months
      purpose: 'Home Renovation',
      currency: 'MYR',
    },
    inputs: {
      ctosScore: 752,
      monthlyIncome: 8500,
      employmentTenureMonths: 72,
      existingDebtServiceRatio: 25,
      newDebtServiceRatio: 38,
      loanAmount: 50000,
      loanTenure: 60,
      existingLoans: 2,
      bankruptcyHistory: false,
      latePayments: 0,
    },
    decision: {
      status: 'approved',
      confidence: 0.87,
      riskLevel: 'LOW',
      interestRate: 5.5,
      monthlyPayment: 955,
      timestamp: '2026-01-13T14:35:00Z',
    },
    // From API topReasons
    topReasons: [
      {
        feature: 'ctosScore',
        direction: 'positive',
        impact: 2.107,
        explanation: 'Strong credit history',
      },
      {
        feature: 'employmentTenureMonths',
        direction: 'positive',
        impact: 0.389,
        explanation: 'Long and stable employment history',
      },
      {
        feature: 'newDebtServiceRatio',
        direction: 'positive',
        impact: 0.317,
        explanation: 'Post-loan debt remains manageable',
      },
      {
        feature: 'monthlyIncome',
        direction: 'positive',
        impact: 0.245,
        explanation: 'Sufficient income level',
      },
      {
        feature: 'latePayments',
        direction: 'positive',
        impact: 0.156,
        explanation: 'No late payment history',
      },
    ],
    // Convert to shapValues for charts
    shapValues: {
      ctosScore: 2.107,
      employmentTenureMonths: 0.389,
      newDebtServiceRatio: 0.317,
      monthlyIncome: 0.245,
      latePayments: 0.156,
      existingLoans: -0.05,
    },
    whatIfSuggestions: [
      {
        change: 'Reduce loan amount by RM10,000',
        expectedOutcome: 'Approval confidence increases to 92%',
      },
      {
        change: 'Extend loan tenure to 72 months',
        expectedOutcome: 'Monthly payment reduces to RM820',
      },
    ],
    rules: [
      { id: 'R1', description: 'CTOS score above 700 threshold', impact: 'positive', weight: 'high' },
      { id: 'R2', description: 'DSR below 40% guideline', impact: 'positive', weight: 'high' },
      { id: 'R3', description: 'Employment tenure above 2 years', impact: 'positive', weight: 'medium' },
      { id: 'R4', description: 'No bankruptcy record', impact: 'positive', weight: 'critical' },
    ],
    ragContext: {
      policies: [
        { source: 'Internal Policy 3.2.1', text: 'Applicants with CTOS score ≥720 qualify for preferred rate tier.' },
        { source: 'BNM Guidelines 2024', text: 'Total DSR including new loan should not exceed 60% for unsecured loans.' },
      ],
      regulations: [
        { source: 'BNM/RH/PD 032-9', text: 'Responsible lending guidelines require income verification.' },
        { source: 'PDPA 2010', text: 'Personal data must be processed with consent and for lawful purposes.' },
      ],
      precedents: [
        { caseId: 'LA-2025-008234', similarity: 0.91, outcome: 'approved', note: 'Similar profile, approved at 5.75%' },
        { caseId: 'LA-2025-007891', similarity: 0.85, outcome: 'approved', note: 'Lower income but longer tenure' },
      ],
    },
    audit: {
      model: 'XGBoost v1.7',
      explainability: 'SHAP',
      timestamp: '2026-01-13T14:35:00Z',
    },
    auditTrail: [
      { timestamp: '2026-01-13T14:30:00Z', action: 'Application Submitted', actor: 'system' },
      { timestamp: '2026-01-13T14:30:02Z', action: 'CTOS Check Initiated', actor: 'system' },
      { timestamp: '2026-01-13T14:32:00Z', action: 'Income Verification Complete', actor: 'system' },
      { timestamp: '2026-01-13T14:35:00Z', action: 'Model Inference Complete', actor: 'XGBoost v1.7' },
      { timestamp: '2026-01-13T14:35:01Z', action: 'Decision: APPROVED', actor: 'XGBoost v1.7' },
    ],
  },
  {
    id: 'LA-2026-000002',
    applicant: {
      name: 'Siti Nurhaliza binti Abdullah',
      email: 'siti.nur@email.com',
      phone: '+60 16-789 0123',
      icNumber: '920803-08-XXXX',
    },
    loanDetails: {
      type: 'Car Loan',
      amount: 85000,
      term: 84,
      purpose: 'Vehicle Purchase',
      currency: 'MYR',
    },
    inputs: {
      ctosScore: 668,
      monthlyIncome: 5500,
      employmentTenureMonths: 18,
      existingDebtServiceRatio: 35,
      newDebtServiceRatio: 52,
      loanAmount: 85000,
      loanTenure: 84,
      existingLoans: 3,
      bankruptcyHistory: false,
      latePayments: 2,
    },
    decision: {
      status: 'review',
      confidence: 0.58,
      riskLevel: 'MEDIUM',
      interestRate: 7.2,
      monthlyPayment: 1320,
      timestamp: '2026-01-13T11:20:00Z',
    },
    topReasons: [
      {
        feature: 'newDebtServiceRatio',
        direction: 'negative',
        impact: 0.892,
        explanation: 'High post-loan debt burden',
      },
      {
        feature: 'ctosScore',
        direction: 'negative',
        impact: 0.456,
        explanation: 'Below preferred credit threshold',
      },
      {
        feature: 'employmentTenureMonths',
        direction: 'negative',
        impact: 0.234,
        explanation: 'Relatively short employment history',
      },
      {
        feature: 'latePayments',
        direction: 'negative',
        impact: 0.178,
        explanation: 'Previous late payment record',
      },
      {
        feature: 'monthlyIncome',
        direction: 'positive',
        impact: 0.125,
        explanation: 'Adequate income level',
      },
    ],
    shapValues: {
      newDebtServiceRatio: -0.892,
      ctosScore: -0.456,
      employmentTenureMonths: -0.234,
      latePayments: -0.178,
      monthlyIncome: 0.125,
      existingLoans: -0.089,
    },
    whatIfSuggestions: [
      {
        change: 'Reduce loan amount to RM70,000',
        expectedOutcome: 'DSR reduces to 45%, confidence increases to 68%',
      },
      {
        change: 'Add a guarantor with CTOS >750',
        expectedOutcome: 'Risk level changes to LOW, approval likely',
      },
      {
        change: 'Wait 6 months for employment tenure',
        expectedOutcome: 'Employment factor becomes positive',
      },
    ],
    rules: [
      { id: 'R1', description: 'CTOS score below 680 threshold', impact: 'negative', weight: 'high' },
      { id: 'R2', description: 'DSR above 50% guideline', impact: 'negative', weight: 'critical' },
      { id: 'R3', description: 'Employment under 24 months', impact: 'negative', weight: 'medium' },
      { id: 'R4', description: 'Late payment history detected', impact: 'negative', weight: 'medium' },
    ],
    ragContext: {
      policies: [
        { source: 'Car Loan Policy 2.1', text: 'DSR exceeding 50% requires additional collateral or guarantor.' },
        { source: 'Risk Guidelines 2024', text: 'Applicants with 2+ late payments need manual review.' },
      ],
      regulations: [
        { source: 'BNM/RH/PD 032-9', text: 'Hire purchase loans must comply with responsible lending standards.' },
        { source: 'Consumer Credit Act', text: 'Full disclosure of APR and total repayment required.' },
      ],
      precedents: [
        { caseId: 'LA-2025-006789', similarity: 0.88, outcome: 'approved', note: 'Approved with guarantor' },
        { caseId: 'LA-2025-006234', similarity: 0.82, outcome: 'denied', note: 'Similar DSR, denied without guarantor' },
      ],
    },
    audit: {
      model: 'XGBoost v1.7',
      explainability: 'SHAP',
      timestamp: '2026-01-13T11:20:00Z',
    },
    auditTrail: [
      { timestamp: '2026-01-13T11:15:00Z', action: 'Application Submitted', actor: 'system' },
      { timestamp: '2026-01-13T11:15:03Z', action: 'CTOS Check Initiated', actor: 'system' },
      { timestamp: '2026-01-13T11:18:00Z', action: 'Income Verification Complete', actor: 'system' },
      { timestamp: '2026-01-13T11:20:00Z', action: 'Model Inference Complete', actor: 'XGBoost v1.7' },
      { timestamp: '2026-01-13T11:20:01Z', action: 'Decision: MANUAL REVIEW', actor: 'XGBoost v1.7' },
      { timestamp: '2026-01-13T11:20:02Z', action: 'Routed to Credit Committee', actor: 'system' },
    ],
  },
  {
    id: 'LA-2026-000003',
    applicant: {
      name: 'Raj Kumar a/l Subramaniam',
      email: 'raj.kumar@email.com',
      phone: '+60 17-456 7890',
      icNumber: '780220-10-XXXX',
    },
    loanDetails: {
      type: 'Personal Loan',
      amount: 30000,
      term: 36,
      purpose: 'Debt Consolidation',
      currency: 'MYR',
    },
    inputs: {
      ctosScore: 542,
      monthlyIncome: 4200,
      employmentTenureMonths: 8,
      existingDebtServiceRatio: 58,
      newDebtServiceRatio: 72,
      loanAmount: 30000,
      loanTenure: 36,
      existingLoans: 5,
      bankruptcyHistory: true,
      latePayments: 6,
    },
    decision: {
      status: 'denied',
      confidence: 0.15,
      riskLevel: 'HIGH',
      interestRate: null,
      monthlyPayment: null,
      timestamp: '2026-01-12T16:45:00Z',
    },
    topReasons: [
      {
        feature: 'bankruptcyHistory',
        direction: 'negative',
        impact: 1.567,
        explanation: 'Previous bankruptcy on record',
      },
      {
        feature: 'newDebtServiceRatio',
        direction: 'negative',
        impact: 1.234,
        explanation: 'Post-loan DSR exceeds maximum threshold',
      },
      {
        feature: 'ctosScore',
        direction: 'negative',
        impact: 0.987,
        explanation: 'Credit score below minimum requirement',
      },
      {
        feature: 'latePayments',
        direction: 'negative',
        impact: 0.654,
        explanation: 'Multiple late payment instances',
      },
      {
        feature: 'existingLoans',
        direction: 'negative',
        impact: 0.321,
        explanation: 'High number of existing obligations',
      },
    ],
    shapValues: {
      bankruptcyHistory: -1.567,
      newDebtServiceRatio: -1.234,
      ctosScore: -0.987,
      latePayments: -0.654,
      existingLoans: -0.321,
      employmentTenureMonths: -0.189,
    },
    whatIfSuggestions: [
      {
        change: 'Clear bankruptcy record (typically 5 years)',
        expectedOutcome: 'Major disqualifying factor removed',
      },
      {
        change: 'Consolidate existing debts first to reduce DSR',
        expectedOutcome: 'May qualify after reducing DSR below 60%',
      },
    ],
    rules: [
      { id: 'R1', description: 'CTOS score below 580 minimum', impact: 'negative', weight: 'critical' },
      { id: 'R2', description: 'DSR exceeds 60% absolute maximum', impact: 'negative', weight: 'critical' },
      { id: 'R3', description: 'Bankruptcy record within 5 years', impact: 'negative', weight: 'critical' },
      { id: 'R4', description: 'Excessive late payments (6+)', impact: 'negative', weight: 'high' },
      { id: 'R5', description: 'Multiple existing loan obligations', impact: 'negative', weight: 'medium' },
    ],
    ragContext: {
      policies: [
        { source: 'Credit Policy 1.1', text: 'CTOS score below 580 results in automatic decline.' },
        { source: 'Bankruptcy Guidelines', text: 'Applicants with undischarged bankruptcy are ineligible.' },
      ],
      regulations: [
        { source: 'BNM/RH/PD 032-9', text: 'Lenders must not extend credit that causes undue hardship.' },
        { source: 'Insolvency Act 1967', text: 'Bankrupts have restrictions on obtaining credit.' },
      ],
      precedents: [
        { caseId: 'LA-2025-003456', similarity: 0.93, outcome: 'denied', note: 'Similar bankruptcy + DSR profile' },
        { caseId: 'LA-2025-002890', similarity: 0.89, outcome: 'denied', note: 'Denied, referred to AKPK' },
      ],
    },
    audit: {
      model: 'XGBoost v1.7',
      explainability: 'SHAP',
      timestamp: '2026-01-12T16:45:00Z',
    },
    auditTrail: [
      { timestamp: '2026-01-12T16:40:00Z', action: 'Application Submitted', actor: 'system' },
      { timestamp: '2026-01-12T16:40:02Z', action: 'CTOS Check Initiated', actor: 'system' },
      { timestamp: '2026-01-12T16:42:00Z', action: 'Bankruptcy Flag Detected', actor: 'system' },
      { timestamp: '2026-01-12T16:45:00Z', action: 'Model Inference Complete', actor: 'XGBoost v1.7' },
      { timestamp: '2026-01-12T16:45:01Z', action: 'Decision: DENIED', actor: 'XGBoost v1.7' },
      { timestamp: '2026-01-12T16:45:02Z', action: 'Adverse Action Notice Generated', actor: 'system' },
      { timestamp: '2026-01-12T16:45:03Z', action: 'AKPK Referral Sent', actor: 'system' },
    ],
  },
];

// Factor metadata for Malaysian context
export const factorMetadata = {
  ctosScore: {
    label: 'CTOS Score',
    unit: 'points',
    min: 300,
    max: 850,
    description: 'Credit score from CTOS Malaysia',
    icon: '📊',
  },
  monthlyIncome: {
    label: 'Monthly Income',
    unit: 'RM',
    min: 0,
    max: 50000,
    description: 'Gross monthly income',
    icon: '💵',
  },
  employmentTenureMonths: {
    label: 'Employment Tenure',
    unit: 'months',
    min: 0,
    max: 360,
    description: 'Months at current employer',
    icon: '💼',
  },
  existingDebtServiceRatio: {
    label: 'Current DSR',
    unit: '%',
    min: 0,
    max: 100,
    description: 'Current debt-to-income ratio',
    icon: '📉',
  },
  newDebtServiceRatio: {
    label: 'New DSR',
    unit: '%',
    min: 0,
    max: 100,
    description: 'DSR after this loan',
    icon: '📈',
  },
  loanAmount: {
    label: 'Loan Amount',
    unit: 'RM',
    min: 1000,
    max: 500000,
    description: 'Requested loan amount',
    icon: '🏦',
  },
  loanTenure: {
    label: 'Loan Tenure',
    unit: 'months',
    min: 12,
    max: 120,
    description: 'Loan repayment period',
    icon: '📅',
  },
  existingLoans: {
    label: 'Existing Loans',
    unit: 'count',
    min: 0,
    max: 10,
    description: 'Number of active loans',
    icon: '📋',
  },
  bankruptcyHistory: {
    label: 'Bankruptcy History',
    unit: 'boolean',
    min: 0,
    max: 1,
    description: 'Previous bankruptcy record',
    icon: '⚠️',
  },
  latePayments: {
    label: 'Late Payments',
    unit: 'count',
    min: 0,
    max: 20,
    description: 'Late payments in past 2 years',
    icon: '🔔',
  },
};

// Risk level configurations
export const riskLevelConfig = {
  LOW: {
    color: 'emerald',
    label: 'Low Risk',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  MEDIUM: {
    color: 'amber',
    label: 'Medium Risk',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  HIGH: {
    color: 'rose',
    label: 'High Risk',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
  },
};

// Decision status configurations  
export const decisionStatusConfig = {
  approved: {
    label: 'Approved',
    icon: '✓',
    color: 'emerald',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  review: {
    label: 'Under Review',
    icon: '◐',
    color: 'amber',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  denied: {
    label: 'Denied',
    icon: '✗',
    color: 'rose',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
  },
};
