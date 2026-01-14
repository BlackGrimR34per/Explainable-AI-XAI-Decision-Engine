// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Fetch loan application decision from FastAPI backend
 * @param {string} applicationId - The application ID to fetch
 * @returns {Promise<ApplicationDecision>}
 */
export async function fetchApplicationDecision(applicationId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/decision`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformApiResponse(data);
  } catch (error) {
    console.error('Failed to fetch application decision:', error);
    throw error;
  }
}

/**
 * Fetch raw application data from JSON file (now pre-transformed)
 * @param {string} applicationId - The application ID to fetch
 * @returns {Promise<Object>} Pre-transformed application data
 */
export async function fetchRawApplication(applicationId) {
  try {
    const response = await fetch('/data/raw_applications.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawApplications = await response.json();
    const rawApp = rawApplications.find(app => app.applicationId === applicationId);
    if (!rawApp) {
      throw new Error(`Application ${applicationId} not found in JSON`);
    }
    return rawApp;
  } catch (error) {
    console.error('Failed to fetch raw application:', error);
    throw error;
  }
}

/**
 * Fetch all applications (for sidebar) - updated to support JSON
 * @returns {Promise<ApplicationSummary[]>}
 */
export async function fetchApplicationsList(useJson = false) {
  try {
    if (useJson) {
      const response = await fetch('/data/applications_list.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } else {
      const response = await fetch(`${API_BASE_URL}/api/applications`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
  } catch (error) {
    console.error('Failed to fetch applications list:', error);
    throw error;
  }
}

/**
 * Run what-if simulation
 * @param {string} applicationId
 * @param {object} modifiedInputs
 * @returns {Promise<WhatIfResult>}
 */
export async function runWhatIfSimulation(applicationId, modifiedInputs) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/whatif`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedInputs),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to run what-if simulation:', error);
    throw error;
  }
}

/**
 * Transform API response to match our frontend structure
 * This normalizes the backend format to what our components expect
 */
function transformApiResponse(apiData) {
  return {
    id: apiData.applicationId,
    decision: {
      status: apiData.decision.toLowerCase(), // 'APPROVED' -> 'approved'
      confidence: apiData.confidence,
      riskLevel: apiData.riskLevel,
      timestamp: apiData.audit?.timestamp,
    },
    // Transform topReasons to shapValues format
    shapValues: apiData.topReasons.reduce((acc, reason) => {
      acc[reason.feature] = reason.direction === 'positive' ? reason.impact : -reason.impact;
      return acc;
    }, {}),
    // Keep original reasons for display
    topReasons: apiData.topReasons,
    whatIfSuggestions: apiData.whatIfSuggestions || [],
    audit: apiData.audit,
    // These may come from a separate endpoint or be included in full response
    applicant: apiData.applicant || null,
    loanDetails: apiData.loanDetails || null,
    inputs: apiData.inputs || null,
    rules: apiData.rules || [],
    ragContext: apiData.ragContext || null,
    auditTrail: apiData.auditTrail || [],
  };
}

export default {
  fetchApplicationDecision,
  fetchApplicationsList,
  runWhatIfSimulation,
};
