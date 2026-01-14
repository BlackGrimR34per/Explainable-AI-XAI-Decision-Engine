import { motion } from 'framer-motion';

// Decision flow visualization for Malaysian lending context
export default function DecisionFlow({ application }) {
  const { decision, inputs } = application;

  // Handle case where inputs might not be available
  if (!inputs) {
    return (
      <div className="flex items-center justify-center h-56 text-slate-500">
        <p>Decision flow data not available</p>
      </div>
    );
  }

  // Determine which path was taken based on inputs
  const ctosScore = inputs.ctosScore || inputs.creditScore || 0;
  const dsr = inputs.newDebtServiceRatio || inputs.debtToIncomeRatio || 0;
  const hasBankruptcy = inputs.bankruptcyHistory || false;

  const ctosPassed = ctosScore >= 620;
  const dsrPassed = dsr <= 60;
  const noBankruptcy = !hasBankruptcy;

  const nodes = [
    {
      id: 'start',
      label: 'Application',
      sublabel: application.id,
      type: 'start',
      active: true,
      x: 50,
      y: 50,
    },
    {
      id: 'ctos',
      label: 'CTOS Score',
      sublabel: `${ctosScore} ${ctosPassed ? '≥' : '<'} 620`,
      type: 'decision',
      active: true,
      passed: ctosPassed,
      x: 200,
      y: 50,
    },
    {
      id: 'dsr',
      label: 'DSR Check',
      sublabel: `${dsr}% ${dsrPassed ? '≤' : '>'} 60%`,
      type: 'decision',
      active: ctosPassed,
      passed: dsrPassed,
      x: 350,
      y: 50,
    },
    {
      id: 'bankruptcy',
      label: 'Bankruptcy',
      sublabel: noBankruptcy ? 'Clear' : 'Found',
      type: 'decision',
      active: ctosPassed && dsrPassed,
      passed: noBankruptcy,
      x: 500,
      y: 500,
    },
    {
      id: 'review',
      label: 'Manual Review',
      sublabel: 'Credit Committee',
      type: 'process',
      active: ctosPassed && (!dsrPassed || !noBankruptcy) && decision.status === 'review',
      x: 425,
      y: 150,
    },
    {
      id: 'approved',
      label: 'Approved',
      sublabel: decision.interestRate ? `${decision.interestRate}% p.a.` : '',
      type: 'end_positive',
      active: decision.status === 'approved',
      x: 620,
      y: 50,
    },
    {
      id: 'denied',
      label: 'Denied',
      sublabel: 'Adverse Action',
      type: 'end_negative',
      active: decision.status === 'denied',
      x: 200,
      y: 150,
    },
  ];

  const getNodeStyle = (node) => {
    const baseStyle = 'absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center transition-all duration-500';

    if (!node.active) {
      return `${baseStyle} opacity-20`;
    }

    switch (node.type) {
      case 'start':
        return `${baseStyle} w-24 h-24 rounded-full bg-slate-800 border-2 border-teal-500/50`;
      case 'decision':
        return `${baseStyle} w-28 h-28 rotate-45 ${
          node.passed
            ? 'bg-emerald-500/10 border-2 border-emerald-500/50'
            : 'bg-rose-500/10 border-2 border-rose-500/50'
        }`;
      case 'process':
        return `${baseStyle} w-32 h-20 rounded-lg bg-amber-500/10 border-2 border-amber-500/50`;
      case 'end_positive':
        return `${baseStyle} w-28 h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-500`;
      case 'end_negative':
        return `${baseStyle} w-28 h-28 rounded-full bg-rose-500/20 border-2 border-rose-500`;
      default:
        return baseStyle;
    }
  };

  const renderConnections = () => {
    const connections = [];

    // Start to CTOS
    connections.push(
      <motion.line
        key="start-ctos"
        x1="85" y1="50" x2="165" y2="50"
        stroke={ctosPassed ? '#2dd4bf' : '#64748b'}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
    );

    // CTOS to DSR (if passed)
    if (ctosPassed) {
      connections.push(
        <motion.line
          key="ctos-dsr"
          x1="235" y1="50" x2="315" y2="50"
          stroke={dsrPassed ? '#2dd4bf' : '#64748b'}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      );
    }

    // CTOS to Denied (if failed)
    if (!ctosPassed) {
      connections.push(
        <motion.line
          key="ctos-denied"
          x1="200" y1="85" x2="200" y2="115"
          stroke="#fb7185"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      );
    }

    // DSR to Bankruptcy (if passed)
    if (ctosPassed && dsrPassed) {
      connections.push(
        <motion.line
          key="dsr-bankruptcy"
          x1="385" y1="50" x2="465" y2="50"
          stroke={noBankruptcy ? '#2dd4bf' : '#64748b'}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      );
    }

    // DSR to Review (if failed but not denied)
    if (ctosPassed && !dsrPassed && decision.status !== 'denied') {
      connections.push(
        <motion.line
          key="dsr-review"
          x1="350" y1="85" x2="400" y2="140"
          stroke="#fbbf24"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      );
    }

    // Bankruptcy to Approved (if all passed)
    if (ctosPassed && dsrPassed && noBankruptcy) {
      connections.push(
        <motion.line
          key="bankruptcy-approved"
          x1="535" y1="50" x2="585" y2="50"
          stroke="#2dd4bf"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
      );
    }

    // Review to Approved (if review passed)
    if (decision.status === 'approved' && !(ctosPassed && dsrPassed && noBankruptcy)) {
      connections.push(
        <motion.line
          key="review-approved"
          x1="460" y1="150" x2="590" y2="80"
          stroke="#2dd4bf"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
      );
    }

    return connections;
  };

  return (
    <div className="relative w-full h-56 overflow-hidden">
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>
        {renderConnections()}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: node.active ? 1 : 0.2, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={getNodeStyle(node)}
          style={{ left: node.x, top: node.y }}
        >
          <div className={node.type === 'decision' ? '-rotate-45' : ''}>
            <span className={`text-xs font-semibold ${
              node.type === 'end_positive' ? 'text-emerald-400' :
              node.type === 'end_negative' ? 'text-rose-400' :
              'text-slate-200'
            }`}>
              {node.label}
            </span>
            {node.sublabel && (
              <span className="block text-[10px] text-slate-500 mt-0.5">
                {node.sublabel}
              </span>
            )}
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Passed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-rose-500 rounded-full" /> Failed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-amber-500 rounded-full" /> Review
        </span>
      </div>

      {/* Model info */}
      {application.audit && (
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-600">
          {application.audit.model} • {application.audit.explainability}
        </div>
      )}
    </div>
  );
}
