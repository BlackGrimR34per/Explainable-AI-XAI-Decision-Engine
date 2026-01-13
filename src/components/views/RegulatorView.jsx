import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import FactorChart from '../visualizations/FactorChart';
import DecisionFlow from '../visualizations/DecisionFlow';
import { factorMetadata, riskLevelConfig, decisionStatusConfig } from '../../data/mockData';

export default function RegulatorView({ application }) {
  const { decision, inputs, topReasons, shapValues, ragContext, auditTrail, audit } = application;
  const riskConfig = riskLevelConfig[decision.riskLevel] || riskLevelConfig.MEDIUM;

  // Compliance checks for Malaysian context
  const complianceChecks = [
    {
      id: 'BNM-RL',
      name: 'BNM Responsible Lending',
      status: 'pass',
      detail: 'Income verification completed as per BNM/RH/PD 032-9 guidelines'
    },
    {
      id: 'PDPA',
      name: 'Personal Data Protection Act 2010',
      status: 'pass',
      detail: 'Applicant consent obtained for credit check and data processing'
    },
    {
      id: 'CTOS',
      name: 'CTOS Data Access',
      status: 'pass',
      detail: 'Credit report accessed with valid purpose and consent'
    },
    {
      id: 'DSR',
      name: 'Debt Service Ratio Limit',
      status: inputs?.newDebtServiceRatio > 60 ? 'warning' : 'pass',
      detail: `Post-loan DSR ${inputs?.newDebtServiceRatio || 'N/A'}% ${
        inputs?.newDebtServiceRatio > 60 ? 'exceeds' : 'within'
      } 60% threshold`
    },
    {
      id: 'ADVERSE',
      name: 'Adverse Action Disclosure',
      status: decision.status === 'denied' ? 'attention' : 'pass',
      detail: decision.status === 'denied'
        ? 'Adverse action notice required - verify disclosure sent'
        : 'Not applicable - application not denied'
    },
    {
      id: 'AKPK',
      name: 'AKPK Referral (if applicable)',
      status: decision.status === 'denied' && inputs?.newDebtServiceRatio > 60 ? 'attention' : 'pass',
      detail: decision.status === 'denied' && inputs?.newDebtServiceRatio > 60
        ? 'High DSR applicant denied - consider AKPK referral'
        : 'No referral required'
    },
  ];

  const passCount = complianceChecks.filter(c => c.status === 'pass').length;
  const warnCount = complianceChecks.filter(c => c.status === 'warning').length;
  const attentionCount = complianceChecks.filter(c => c.status === 'attention').length;

  return (
    <div className="space-y-6">
      {/* Compliance Summary Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100 mb-1">
              Regulatory Compliance Review
            </h2>
            <p className="text-slate-500">
              Application {application.id} • Decision: {decision.status.toUpperCase()} • Risk: {riskConfig.label}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <ComplianceStat value={passCount} label="Passed" color="emerald" />
            <ComplianceStat value={warnCount} label="Warnings" color="amber" />
            <ComplianceStat value={attentionCount} label="Attention" color="rose" />
          </div>
        </div>

        {/* Compliance Progress */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-slate-400">Overall Compliance</span>
            <span className="text-sm font-mono text-slate-200">
              {passCount}/{complianceChecks.length}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(passCount / complianceChecks.length) * 100}%` }}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${(warnCount / complianceChecks.length) * 100}%` }}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-500"
              style={{ width: `${(attentionCount / complianceChecks.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Compliance Checks */}
        <div className="col-span-2">
          <Card title="Compliance Checklist" icon="✓" delay={0.1}>
            <div className="space-y-3">
              {complianceChecks.map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    check.status === 'pass'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : check.status === 'warning'
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        check.status === 'pass'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : check.status === 'warning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {check.status === 'pass' ? '✓' : check.status === 'warning' ? '!' : '⚠'}
                      </span>
                      <span className="font-mono text-xs text-slate-500">{check.id}</span>
                      <span className="text-sm text-slate-200">{check.name}</span>
                    </div>
                    <span className={`text-xs font-semibold uppercase ${
                      check.status === 'pass'
                        ? 'text-emerald-400'
                        : check.status === 'warning'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}>
                      {check.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 ml-9">{check.detail}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Audit Trail */}
      <Card
        title="Complete Audit Trail"
        subtitle="Chronological record of all system actions"
        icon="📋"
        delay={0.3}
      >
        {auditTrail && auditTrail.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800" />

            <div className="space-y-4">
              {auditTrail.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="relative pl-10"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full ${
                    event.action.includes('APPROVED') ? 'bg-emerald-500' :
                    event.action.includes('DENIED') ? 'bg-rose-500' :
                    event.action.includes('REVIEW') ? 'bg-amber-500' :
                    'bg-slate-600'
                  }`} />

                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-200">{event.action}</span>
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(event.timestamp).toLocaleString('en-MY')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Actor:</span>
                      <span className="text-xs font-mono text-teal-400">{event.actor}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">No audit trail available</p>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Decision Factors for Audit */}
        <Card title="Decision Factor Analysis" subtitle="SHAP values for model interpretability" icon="📊" delay={0.4}>
          <FactorChart shapValues={shapValues} topReasons={topReasons} compact />
          <p className="mt-4 text-xs text-slate-500">
            Positive values indicate factors pushing toward approval; negative values indicate factors pushing toward denial.
          </p>
        </Card>
      </div>

      {/* Regulatory References */}
      <Card
        title="Applicable Regulatory Framework"
        icon="⚖️"
        delay={0.6}
      >
        <div className="grid grid-cols-2 gap-4">
          {ragContext?.regulations?.map((reg, i) => (
            <div key={`reg-${i}`} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-mono text-amber-400">{reg.source}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{reg.text}</p>
            </div>
          ))}
          {ragContext?.policies?.map((policy, i) => (
            <div key={`policy-${i}`} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs font-mono text-teal-400">{policy.source}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{policy.text}</p>
            </div>
          ))}
          {(!ragContext?.regulations?.length && !ragContext?.policies?.length) && (
            <p className="col-span-2 text-slate-500 text-center py-4">No regulatory context available</p>
          )}
        </div>
      </Card>

      {/* Export Actions */}
      <div className="flex items-center justify-end gap-4">
        <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          Export JSON
        </button>
        <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          Generate PDF Report
        </button>
        <button className="px-4 py-2 text-sm bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition-colors">
          Flag for BNM Review
        </button>
      </div>
    </div>
  );
}

// Helper components
function ComplianceStat({ value, label, color }) {
  const colorClasses = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  };

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-mono text-slate-200">{value}</p>
    </div>
  );
}
