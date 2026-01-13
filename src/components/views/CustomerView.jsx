import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../shared/Card';
import GaugeChart from '../visualizations/GaugeChart';
import WhatIfSlider from '../shared/WhatIfSlider';
import { factorMetadata, riskLevelConfig, decisionStatusConfig } from '../../data/mockData';

export default function CustomerView({ application, whatIfValues, onWhatIfChange }) {
  const { decision, inputs, topReasons, whatIfSuggestions } = application;
  const statusConfig = decisionStatusConfig[decision.status];
  const riskConfig = riskLevelConfig[decision.riskLevel] || riskLevelConfig.MEDIUM;

  // Separate positive and negative factors from topReasons
  const positiveFactors = topReasons?.filter(r => r.direction === 'positive') || [];
  const negativeFactors = topReasons?.filter(r => r.direction === 'negative') || [];

  // Calculate what-if result (simplified simulation)
  const calculateWhatIfConfidence = () => {
    if (!whatIfValues || !inputs) return decision.confidence;

    let delta = 0;
    Object.entries(whatIfValues).forEach(([key, value]) => {
      const original = inputs[key];
      if (original === undefined) return;
      const change = value - original;

      // Simple linear approximation based on feature type
      if (key === 'ctosScore') delta += (change / 100) * 0.12;
      if (key === 'newDebtServiceRatio') delta -= (change / 10) * 0.08;
      if (key === 'monthlyIncome') delta += (change / 5000) * 0.06;
      if (key === 'latePayments') delta -= change * 0.03;
      if (key === 'loanAmount') delta -= (change / 20000) * 0.05;
      if (key === 'employmentTenureMonths') delta += (change / 24) * 0.04;
    });

    return Math.max(0, Math.min(1, decision.confidence + delta));
  };

  const whatIfConfidence = calculateWhatIfConfidence();
  const confidenceDelta = whatIfConfidence - decision.confidence;

  // Status banner content
  const statusContent = {
    approved: {
      title: 'Good News! Your Application is Approved',
      icon: '🎉',
      description: 'Congratulations! Your loan application has been approved.',
    },
    review: {
      title: 'Your Application is Being Reviewed',
      icon: '🔍',
      description: 'Our team is reviewing your application. We will notify you soon.',
    },
    denied: {
      title: 'We Couldn\'t Approve Your Application',
      icon: '📋',
      description: 'Unfortunately, we cannot approve your application at this time.',
    },
  };

  const content = statusContent[decision.status];

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${statusConfig.bgClass} ${statusConfig.borderClass}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{content.icon}</span>
            <div>
              <h2 className={`text-xl font-semibold ${statusConfig.textClass}`}>
                {content.title}
              </h2>
              <p className="text-slate-400 mt-1">
                Application {application.id} • {application.loanDetails?.type || 'Loan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <GaugeChart value={decision.confidence} label="Confidence" />
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${riskConfig.bgClass} ${riskConfig.textClass} ${riskConfig.borderClass} border`}>
              {riskConfig.label}
            </div>
          </div>
        </div>

        {decision.status === 'approved' && decision.interestRate && (
          <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500">Loan Amount</p>
              <p className="text-2xl font-semibold text-slate-200">
                RM {application.loanDetails?.amount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Interest Rate</p>
              <p className="text-2xl font-semibold text-emerald-400">
                {decision.interestRate}% p.a.
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Monthly Payment</p>
              <p className="text-2xl font-semibold text-slate-200">
                RM {decision.monthlyPayment?.toLocaleString()}/mo
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Why This Decision - Using topReasons from API */}
        <Card
          title="Why This Decision?"
          subtitle="Main factors that influenced your result"
          icon="💡"
          delay={0.1}
        >
          <div className="space-y-4">
            {positiveFactors.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                  Working in Your Favor
                </h4>
                <div className="space-y-2">
                  {positiveFactors.map((factor, index) => (
                    <motion.div
                      key={factor.feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                    >
                      <span className="text-lg">{factorMetadata[factor.feature]?.icon || '📊'}</span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">
                          {factorMetadata[factor.feature]?.label || factor.feature}
                        </p>
                        <p className="text-xs text-slate-500">
                          {factor.explanation}
                        </p>
                      </div>
                      <div className="text-emerald-400 text-sm font-mono">
                        +{factor.impact.toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {negativeFactors.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {negativeFactors.map((factor, index) => (
                    <motion.div
                      key={factor.feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10"
                    >
                      <span className="text-lg">{factorMetadata[factor.feature]?.icon || '📊'}</span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">
                          {factorMetadata[factor.feature]?.label || factor.feature}
                        </p>
                        <p className="text-xs text-slate-500">
                          {factor.explanation}
                        </p>
                      </div>
                      <div className="text-rose-400 text-sm font-mono">
                        -{factor.impact.toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* What Could Help - Using whatIfSuggestions from API */}
        <Card
          title="What Could Help?"
          subtitle="Suggestions to improve your outcome"
          icon="🎯"
          delay={0.2}
        >
          <div className="space-y-3">
            {whatIfSuggestions?.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30"
              >
                <div className="flex items-start gap-3">
                  <span className="text-teal-400 mt-0.5">💡</span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{suggestion.change}</p>
                    <p className="text-xs text-teal-400 mt-1">{suggestion.expectedOutcome}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!whatIfSuggestions || whatIfSuggestions.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-4">
                No specific suggestions available for this application.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Interactive What-If Simulator */}
      {inputs && (
        <Card
          title="Try It Yourself"
          subtitle="Adjust factors to see how they might affect your application"
          icon="🎮"
          accent="teal"
          delay={0.3}
        >
          <div className="flex items-start gap-6">
            <div className="flex-1 grid grid-cols-2 gap-6">
              {['ctosScore', 'newDebtServiceRatio', 'monthlyIncome', 'loanAmount'].map((key) => (
                inputs[key] !== undefined && (
                  <WhatIfSlider
                    key={key}
                    factorKey={key}
                    currentValue={whatIfValues?.[key] ?? inputs[key]}
                    onChange={(k, v) => onWhatIfChange({ ...whatIfValues, [k]: v })}
                  />
                )
              ))}
            </div>

            <div className="w-48 flex flex-col items-center p-4 rounded-xl bg-slate-800/30">
              <GaugeChart value={whatIfConfidence} label="Projected" />
              <AnimatePresence mode="wait">
                {confidenceDelta !== 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-2 text-sm font-mono ${
                      confidenceDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {confidenceDelta > 0 ? '+' : ''}{Math.round(confidenceDelta * 100)}%
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => onWhatIfChange(null)}
                className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Reset to Original
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Model Transparency */}
      <Card
        title="How Was This Decided?"
        subtitle="Transparency about the decision-making process"
        icon="🤖"
        delay={0.4}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-slate-800/30">
            <p className="text-xs text-slate-500 mb-1">Model Used</p>
            <p className="text-sm font-mono text-slate-200">{application.audit?.model || 'ML Model'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/30">
            <p className="text-xs text-slate-500 mb-1">Explainability</p>
            <p className="text-sm font-mono text-slate-200">{application.audit?.explainability || 'SHAP'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/30">
            <p className="text-xs text-slate-500 mb-1">Decision Time</p>
            <p className="text-sm font-mono text-slate-200">
              {application.audit?.timestamp
                ? new Date(application.audit.timestamp).toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          This decision was made using machine learning with SHAP (SHapley Additive exPlanations)
          to ensure transparency. You have the right to understand why this decision was made.
        </p>
      </Card>

      {/* Your Rights */}
      <Card
        title="Your Rights"
        subtitle="Important information about this decision"
        icon="⚖️"
        delay={0.5}
      >
        <div className="prose prose-sm prose-invert max-w-none">
          <p className="text-slate-400 text-sm leading-relaxed">
            Under Bank Negara Malaysia's responsible lending guidelines, you have the right to understand
            why your application was approved, denied, or sent for review. If you believe this decision
            was made unfairly, you can contact our customer service or file a complaint with BNM.
          </p>
          {decision.status === 'denied' && (
            <p className="text-slate-400 text-sm leading-relaxed mt-2">
              You may also seek assistance from AKPK (Agensi Kaunseling dan Pengurusan Kredit) for
              free financial counselling and debt management advice.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
