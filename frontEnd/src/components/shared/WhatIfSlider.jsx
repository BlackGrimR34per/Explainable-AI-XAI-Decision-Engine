import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { factorMetadata } from '../../data/mockData';

export default function WhatIfSlider({
  factorKey,
  currentValue,
  onChange,
  showDelta = true
}) {
  const meta = factorMetadata[factorKey];
  const [localValue, setLocalValue] = useState(currentValue);

  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  if (!meta) return null;

// Handle boolean factors specially
  if (meta.unit === 'boolean') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-300 flex items-center gap-2">
            <span>{meta.icon}</span>
            {meta.label}
          </label>
          <button
            onClick={() => {
              const newVal = localValue ? 0 : 1;
              setLocalValue(newVal);
              onChange(factorKey, newVal === 1);
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              localValue ? 'bg-rose-500/30' : 'bg-emerald-500/30'
            }`}
          >
            <motion.div
              className={`absolute top-1 w-4 h-4 rounded-full ${
                localValue ? 'bg-rose-400' : 'bg-emerald-400'
              }`}
              animate={{ left: localValue ? 28 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        <p className="text-xs text-slate-500">{meta.description}</p>
      </div>
    );
  }

  const formatValue = (val) => {
    if (meta.unit === 'RM') return `RM ${val.toLocaleString()}`;
    if (meta.unit === 'USD') return `$${val.toLocaleString()}`;
    if (meta.unit === '%') return `${val}%`;
    if (meta.unit === 'years') return `${val} yrs`;
    if (meta.unit === 'months') return `${val} mo`;
    if (meta.unit === 'count') return val;
    if (meta.unit === 'points') return val;
    return val;
  };

  // Determine if higher is better for this factor
  const higherIsBetter = ['ctosScore', 'monthlyIncome', 'employmentTenureMonths', 'annualIncome', 'downPaymentPercent'].includes(factorKey);

  const delta = localValue - currentValue;
  const deltaColor = delta > 0
    ? higherIsBetter ? 'text-emerald-400' : 'text-rose-400'
    : delta < 0
      ? higherIsBetter ? 'text-rose-400' : 'text-emerald-400'
      : 'text-slate-500';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-300 flex items-center gap-2">
          <span>{meta.icon}</span>
          {meta.label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-slate-200">
            {formatValue(localValue)}
          </span>
          {showDelta && delta !== 0 && (
            <span className={`text-xs font-mono ${deltaColor}`}>
              ({delta > 0 ? '+' : ''}{meta.unit === 'RM' ? `RM ${delta.toLocaleString()}` : meta.unit === 'USD' ? `$${delta.toLocaleString()}` : delta})
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={meta.min}
          max={meta.max}
          value={localValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            setLocalValue(val);
          }}
          onMouseUp={() => onChange(factorKey, localValue)}
          onTouchEnd={() => onChange(factorKey, localValue)}
          className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-teal-400
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-teal-500/30
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-teal-400
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-grab
          "
        />

        {/* Track fill */}
        <div
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full pointer-events-none"
          style={{ width: `${((localValue - meta.min) / (meta.max - meta.min)) * 100}%` }}
        />

        {/* Original value marker */}
        {localValue !== currentValue && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-500 pointer-events-none"
            style={{ left: `${((currentValue - meta.min) / (meta.max - meta.min)) * 100}%` }}
          />
        )}
      </div>

      <div className="flex justify-between text-[10px] text-slate-600">
        <span>{formatValue(meta.min)}</span>
        <span>{formatValue(meta.max)}</span>
      </div>
    </div>
  );
}
