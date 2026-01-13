import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import GaugeChart from '../visualizations/GaugeChart';
import FactorChart from '../visualizations/FactorChart';
import RiskBreakdown from '../visualizations/RiskBreakdown';
import WhatIfSlider from '../shared/WhatIfSlider';
import { factorMetadata, riskLevelConfig, decisionStatusConfig } from '../../data/mockData';

export default function OfficerView({ application, whatIfValues, onWhatIfChange }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { decision, inputs, topReasons, shapValues, rules, ragContext } = application;

  const statusConfig = decisionStatusConfig[decision.status];
  const riskConfig = riskLevelConfig[decision.riskLevel] || riskLevelConfig.MEDIUM;

  // Calculate what-if (same logic as CustomerView)
  const calculateWhatIfConfidence = () => {
    if (!whatIfValues || !inputs) return decision.confidence;
    let delta = 0;
    Object.entries(whatIfValues).forEach(([key, value]) => {
      const original = inputs[key];
      if (original === undefined) return;
      const change = value - original;
      if (key === 'ctosScore') delta += (change / 100) * 0.12;
      if (key === 'newDebtServiceRatio') delta -= (change / 10) * 0.08;
      if (key === 'monthlyIncome') delta += (change / 5000) * 0.06;
      if (key === 'latePayments') delta -= change * 0.03;
      if (key === 'loanAmount') delta -= (change / 20000) * 0.05;
    });
    return Math.max(0, Math.min(1, decision.confidence + delta));
  };

  return (
    <div className="space-y-6">
      {/* Header with key metrics */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold text-slate-100">
              {application.applicant?.name || 'Applicant'}
            </h2>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}>
              {statusConfig.label.toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${riskConfig.bgClass} ${riskConfig.textClass} ${riskConfig.borderClass}`}>
              {riskConfig.label}
            </span>
          </div>
          <p className="text-slate-500">
            {application.id} • {application.loanDetails?.type || 'Loan'} • RM {application.loanDetails?.amount?.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <GaugeChart value={decision.confidence} label="Model Confidence" />
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 text-sm bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
              Override: Approve
            </button>
            <button className="px-4 py-2 text-sm bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
              Override: Deny
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/50 border border-slate-800/50 w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'factors', label: 'Factor Analysis' },
          { id: 'whatif', label: 'What-If' },
          { id: 'context', label: 'Policy Context' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Applicant Details */}
          <Card title="Applicant Details" icon="👤" delay={0.1}>
            <div className="space-y-3">
              {application.applicant && (
                <>
                  <InfoRow label="Name" value={application.applicant.name} />
                  <InfoRow label="Email" value={application.applicant.email} />
                  <InfoRow label="Phone" value={application.applicant.phone} />
                  {application.applicant.icNumber && (
                    <InfoRow label="IC Number" value={application.applicant.icNumber} />
                  )}
                </>
              )}
              <div className="h-px bg-slate-800 my-3" />
              <InfoRow label="Loan Type" value={application.loanDetails?.type} />
              <InfoRow label="Amount" value={`RM ${application.loanDetails?.amount?.toLocaleString()}`} />
              <InfoRow label="Tenure" value={`${application.loanDetails?.term} months`} />
              <InfoRow label="Purpose" value={application.loanDetails?.purpose} />
            </div>
          </Card>

          <Card title="Risk Assessment Breakdown" icon="🎯" delay={0.4}>
            <RiskBreakdown application={application} />
          </Card>

          {/* Key Inputs */}
          <Card title="Application Inputs" icon="📊" delay={0.2}>
            <div className="space-y-3">
              {inputs && Object.entries(inputs).slice(0, 7).map(([key, value]) => (
                <InfoRow
                  key={key}
                  label={factorMetadata[key]?.label || key}
                  value={formatValue(key, value)}
                />
              ))}
            </div>
          </Card>

          {/* Top Reasons from API */}
          <Card title="Top Decision Factors" icon="⚡" delay={0.3}>
            <div className="space-y-2">
              {topReasons?.map((reason, index) => (
                <motion.div
                  key={reason.feature}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    reason.direction === 'positive'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-slate-500">
                      {factorMetadata[reason.feature]?.icon} {factorMetadata[reason.feature]?.label || reason.feature}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      reason.direction === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {reason.direction === 'positive' ? '+' : '-'}{reason.impact.toFixed(3)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{reason.explanation}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Decision Flow - Full Width
          <div className="col-span-3">
            <Card title="Decision Flow" subtitle="Model decision path visualization" icon="🔀" delay={0.4}>
              <DecisionFlow application={application} />
            </Card>
          </div> */}
        </div>
      )}

      {activeTab === 'factors' && (
        <div className="grid grid-cols-2 gap-6">
          <Card title="SHAP Factor Impact" subtitle="Feature importance for this decision" icon="📈">
            <FactorChart shapValues={shapValues} />
          </Card>

          <Card title="Factor Details" icon="🔍">
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {topReasons?.map((reason) => (
                <div key={reason.feature} className="flex items-center gap-4">
                  <div className="w-8 text-center">
                    <span className="text-lg">{factorMetadata[reason.feature]?.icon || '📊'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">
                        {factorMetadata[reason.feature]?.label || reason.feature}
                      </span>
                      <span className={`text-sm font-mono ${
                        reason.direction === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {reason.direction === 'positive' ? '+' : '-'}{reason.impact.toFixed(3)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{reason.explanation}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            reason.direction === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(reason.impact * 30, 100)}%` }}
                        />
                      </div>
                      {inputs && (
                        <span className="text-xs text-slate-500 w-24 text-right">
                          {formatValue(reason.feature, inputs[reason.feature])}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'whatif' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card title="What-If Simulator" subtitle="Adjust factors to simulate outcomes" icon="🎮">
              {inputs ? (
                <div className="grid grid-cols-2 gap-6">
                  {Object.keys(inputs).filter(k => factorMetadata[k] && factorMetadata[k].unit !== 'boolean').map((key) => (
                    <WhatIfSlider
                      key={key}
                      factorKey={key}
                      currentValue={whatIfValues?.[key] ?? inputs[key]}
                      onChange={(k, v) => onWhatIfChange({ ...whatIfValues, [k]: v })}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">Input data not available for simulation.</p>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onWhatIfChange(null)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Reset All
                </button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Projected Outcome">
              <div className="flex flex-col items-center">
                <GaugeChart value={calculateWhatIfConfidence()} label="Projected" />
                {whatIfValues && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">Change from original</p>
                    <p className={`text-lg font-mono ${
                      calculateWhatIfConfidence() > decision.confidence ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {calculateWhatIfConfidence() > decision.confidence ? '+' : ''}
                      {Math.round((calculateWhatIfConfidence() - decision.confidence) * 100)}%
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card title="API Suggestions" icon="💡">
              {application.whatIfSuggestions?.map((suggestion, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 mb-2 last:mb-0"
                >
                  <p className="text-sm text-teal-400 font-medium">{suggestion.change}</p>
                  <p className="text-xs text-slate-500 mt-1">{suggestion.expectedOutcome}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'context' && (
        <div className="grid grid-cols-2 gap-6">
          <Card title="Relevant Policies" icon="📜" delay={0.1}>
            <div className="space-y-3">
              {ragContext?.policies?.map((policy, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <p className="text-xs font-mono text-teal-400 mb-2">{policy.source}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{policy.text}</p>
                </div>
              )) || <p className="text-slate-500">No policy context available.</p>}
            </div>
          </Card>

          <Card title="Applicable Regulations" icon="⚖️" delay={0.2}>
            <div className="space-y-3">
              {ragContext?.regulations?.map((reg, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <p className="text-xs font-mono text-amber-400 mb-2">{reg.source}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{reg.text}</p>
                </div>
              )) || <p className="text-slate-500">No regulation context available.</p>}
            </div>
          </Card>

          <div className="col-span-2">
            <Card title="Similar Past Cases" icon="📁" delay={0.3}>
              <div className="grid grid-cols-3 gap-4">
                {ragContext?.precedents?.map((prec, i) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-400">{prec.caseId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        prec.outcome === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {prec.outcome}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${prec.similarity * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{Math.round(prec.similarity * 100)}% match</span>
                    </div>
                    <p className="text-xs text-slate-400">{prec.note}</p>
                  </div>
                )) || <p className="text-slate-500 col-span-3">No precedent data available.</p>}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm text-slate-200 font-medium">{value || '-'}</span>
    </div>
  );
}

function formatValue(key, value) {
  if (value === undefined || value === null) return '-';
  const meta = factorMetadata[key];
  if (!meta) return value;
  if (meta.unit === 'RM') return `RM ${value.toLocaleString()}`;
  if (meta.unit === 'USD') return `$${value.toLocaleString()}`;
  if (meta.unit === '%') return `${value}%`;
  if (meta.unit === 'years') return `${value} yrs`;
  if (meta.unit === 'months') return `${value} mo`;
  if (meta.unit === 'boolean') return value ? 'Yes' : 'No';
  return value;
}
