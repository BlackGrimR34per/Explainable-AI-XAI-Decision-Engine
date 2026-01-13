import { motion } from 'framer-motion';

export default function GaugeChart({ value, label = 'Confidence', size = 'default' }) {
  const percentage = Math.round(value * 100);

  // Color based on value
  const getColor = () => {
    if (value >= 0.7) return { stroke: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.3)' };
    if (value >= 0.4) return { stroke: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' };
    return { stroke: '#fb7185', glow: 'rgba(251, 113, 133, 0.3)' };
  };

  const color = getColor();

  return (
    <div className={`relative ${size === 'small' ? 'w-24 h-20' : 'w-36 h-28'}`}>
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <motion.span
          className={`font-mono font-bold ${size === 'small' ? 'text-xl' : 'text-3xl'}`}
          style={{ color: color.stroke }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percentage}%
        </motion.span>
        <span className={`text-slate-500 ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
