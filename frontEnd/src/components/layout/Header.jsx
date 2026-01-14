import { motion } from 'framer-motion';

export default function Header({ personas, activePersona, onPersonaChange }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              <span className="text-teal-400">Loan</span>
              <span className="text-slate-100">Lens</span>
            </h1>
            <p className="text-xs text-slate-500">AI Decision Transparency</p>
          </div>
        </div>

        {/* Persona Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/50 border border-slate-800/50">
          {Object.entries(personas).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => onPersonaChange(key)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activePersona === key
                  ? 'text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activePersona === key && (
                <motion.div
                  layoutId="activePersona"
                  className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span>{icon}</span>
                <span>{label}</span>
              </span>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition-colors">
            New Analysis
          </button>
        </div>
      </div>
    </header>
  );
}
