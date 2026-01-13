import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  title, 
  subtitle,
  icon,
  className = '',
  accent,
  delay = 0 
}) {
  const accentStyles = {
    teal: 'border-t-teal-500',
    emerald: 'border-t-emerald-500',
    amber: 'border-t-amber-500',
    rose: 'border-t-rose-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`
        rounded-2xl bg-slate-900/50 border border-slate-800/50 
        backdrop-blur-sm overflow-hidden
        ${accent ? `border-t-2 ${accentStyles[accent]}` : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="text-xl">{icon}</span>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
}
