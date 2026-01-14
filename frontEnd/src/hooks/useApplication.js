import { useState, useEffect, useCallback } from 'react';
import { fetchApplicationDecision, runWhatIfSimulation } from '../services/api';
import { mockApplications } from '../data/mockData';

/**
 * Custom hook for managing application data
 * Supports both API fetching and mock data fallback
 */
export function useApplication(applicationId, useMockData = true) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApplication() {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          // Use mock data for development/demo
          const mockApp = mockApplications.find(app => app.id === applicationId);
          if (mockApp) {
            setApplication(mockApp);
          } else {
            setApplication(mockApplications[0]);
          }
        } else {
          // Fetch from API
          const data = await fetchApplicationDecision(applicationId);
          setApplication(data);
        }
      } catch (err) {
        setError(err.message);
        // Fallback to mock data on error
        setApplication(mockApplications[0]);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId, useMockData]);

  return { application, loading, error };
}

/**
 * Custom hook for what-if simulations
 */
export function useWhatIf(applicationId, originalInputs) {
  const [whatIfValues, setWhatIfValues] = useState(null);
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const runSimulation = useCallback(async (modifiedInputs) => {
    setSimulating(true);
    try {
      const result = await runWhatIfSimulation(applicationId, modifiedInputs);
      setWhatIfResult(result);
    } catch (err) {
      console.error('Simulation failed:', err);
      // Calculate locally as fallback
      setWhatIfResult(calculateLocalWhatIf(originalInputs, modifiedInputs));
    } finally {
      setSimulating(false);
    }
  }, [applicationId, originalInputs]);

  const updateWhatIfValue = useCallback((key, value) => {
    setWhatIfValues(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetWhatIf = useCallback(() => {
    setWhatIfValues(null);
    setWhatIfResult(null);
  }, []);

  return {
    whatIfValues,
    whatIfResult,
    simulating,
    updateWhatIfValue,
    setWhatIfValues,
    runSimulation,
    resetWhatIf,
  };
}

/**
 * Local what-if calculation fallback
 * Simple linear approximation when API is unavailable
 */
function calculateLocalWhatIf(original, modified) {
  let confidenceDelta = 0;
  
  Object.entries(modified).forEach(([key, value]) => {
    const originalValue = original[key];
    if (originalValue === undefined) return;
    
    const change = value - originalValue;
    
    // Approximate impact based on feature
    switch (key) {
      case 'ctosScore':
      case 'creditScore':
        confidenceDelta += (change / 100) * 0.15;
        break;
      case 'monthlyIncome':
      case 'annualIncome':
        confidenceDelta += (change / 5000) * 0.08;
        break;
      case 'newDebtServiceRatio':
      case 'debtToIncomeRatio':
        confidenceDelta -= (change / 10) * 0.10;
        break;
      case 'employmentTenureMonths':
      case 'employmentYears':
        confidenceDelta += (change / 24) * 0.05;
        break;
      case 'loanAmount':
        confidenceDelta -= (change / 50000) * 0.08;
        break;
      default:
        break;
    }
  });
  
  return {
    confidenceDelta,
    newConfidence: Math.max(0, Math.min(1, 0.87 + confidenceDelta)), // Base on typical confidence
  };
}
