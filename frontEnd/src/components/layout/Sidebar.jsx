import { motion } from 'framer-motion';

const statusConfig = {
  approved: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: '✓',
    label: 'Approved'
  },
  review: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: '◐',
    label: 'In Review'
  },
  denied: {
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: '✗',
    label: 'Denied'
  },
};

export default function Sidebar({ applications, selectedApplication, onSelect }) {
  return (
    <aside className="fixed left-0 top-[73px] bottom-0 w-72 border-r border-slate-800/50 bg-slate-950/50 backdrop-blur-xl overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Applications
        </h2>

        <div className="space-y-2">
          {applications.map((app, index) => {
            const status = statusConfig[app.decision.status];
            const isSelected = selectedApplication.id === app.id;

            return (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(app)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-slate-800/50 border-teal-500/30 shadow-lg shadow-teal-500/5'
                    : 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-800/30 hover:border-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500">{app.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color} ${status.border} border`}>
                    {status.icon} {status.label}
                  </span>
                </div>

                <h3 className="font-medium text-slate-200 mb-1">
                  {app.applicant.name}
                </h3>

                <p className="text-sm text-slate-500 mb-3">
                  {app.loanDetails.type} • ${app.loanDetails.amount.toLocaleString()}
                </p>

                {/* Confidence indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${app.decision.confidence * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      className={`h-full rounded-full ${
                        app.decision.confidence > 0.7
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : app.decision.confidence > 0.4
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-rose-500 to-red-400'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {Math.round(app.decision.confidence * 100)}%
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Today's Summary
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-emerald-400">12</div>
              <div className="text-xs text-slate-500">Approved</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-400">5</div>
              <div className="text-xs text-slate-500">Review</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-rose-400">3</div>
              <div className="text-xs text-slate-500">Denied</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
