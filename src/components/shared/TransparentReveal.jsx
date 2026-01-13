import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * TransparentReveal Component
 * Adds a solid overlay that becomes transparent when element enters viewport
 * Perfect metaphor for "AI Transparency" - literally making things transparent!
 */
export default function TransparentReveal({
  children,
  delay = 0,
  className = '',
  overlayColor = 'from-slate-950 to-slate-900', // gradient colors
  animationDuration = 1.2,
  threshold = 0.2, // how much of element needs to be visible to trigger
  once = true, // only animate once
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: "0px 0px -100px 0px" // trigger slightly before element is fully visible
  });
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [isInView, hasBeenInView]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* The actual content */}
      {children}

      {/* The "opacity" overlay that becomes transparent */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: hasBeenInView ? 0 : 1,
        }}
        transition={{
          duration: animationDuration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0] // smooth easing
        }}
        className={`absolute inset-0 bg-gradient-to-br ${overlayColor} pointer-events-none z-10`}
        style={{
          backdropFilter: hasBeenInView ? 'none' : 'blur(0px)',
        }}
      >
        {/* Optional: Add a subtle pattern or texture */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

        {/* Optional: Add "revealing" animation effect */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: hasBeenInView ? 1 : 0,
          }}
          transition={{
            duration: animationDuration * 0.6,
            delay: delay + animationDuration * 0.3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent origin-left"
        />
      </motion.div>

      {/* Animated border glow when revealing */}
      {hasBeenInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{
            duration: animationDuration,
            delay,
            times: [0, 0.5, 1]
          }}
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
          style={{
            boxShadow: '0 0 20px rgba(45, 212, 191, 0.3), inset 0 0 20px rgba(45, 212, 191, 0.1)'
          }}
        />
      )}
    </div>
  );
}

/**
 * Preset variants for different contexts
 */
export const TransparentRevealPresets = {
  // For success/approved items
  success: {
    overlayColor: 'from-emerald-950 to-emerald-900',
    animationDuration: 1.0,
  },
  // For warning/review items
  warning: {
    overlayColor: 'from-amber-950 to-amber-900',
    animationDuration: 1.0,
  },
  // For error/denied items
  error: {
    overlayColor: 'from-rose-950 to-rose-900',
    animationDuration: 1.0,
  },
  // For info/neutral items
  info: {
    overlayColor: 'from-slate-950 to-slate-900',
    animationDuration: 1.2,
  },
  // Fast reveal
  fast: {
    animationDuration: 0.6,
  },
  // Slow, dramatic reveal
  dramatic: {
    animationDuration: 2.0,
  },
};

/**
 * Simple wrapper that automatically applies preset based on status
 */
export function StatusBasedReveal({ status, children, ...props }) {
  const presets = {
    approved: TransparentRevealPresets.success,
    review: TransparentRevealPresets.warning,
    denied: TransparentRevealPresets.error,
  };

  return (
    <TransparentReveal {...presets[status]} {...props}>
      {children}
    </TransparentReveal>
  );
}
