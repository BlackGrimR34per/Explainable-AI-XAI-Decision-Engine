import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { factorMetadata } from '../../data/mockData';

export default function FactorChart({ shapValues, topReasons, compact = false }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Handle both shapValues object and topReasons array
    let entries = [];
    
    if (topReasons && Array.isArray(topReasons)) {
      // Convert topReasons to chart format
      entries = topReasons.map(reason => ({
        key: reason.feature,
        value: reason.direction === 'positive' ? reason.impact : -reason.impact,
        label: factorMetadata[reason.feature]?.label || reason.feature,
        absValue: reason.impact,
      }));
    } else if (shapValues) {
      // Use shapValues object directly
      entries = Object.entries(shapValues)
        .map(([key, value]) => ({
          key,
          value,
          label: factorMetadata[key]?.label || key,
          absValue: Math.abs(value),
        }));
    }
    
    if (entries.length === 0) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Sort by absolute impact
    entries.sort((a, b) => b.absValue - a.absValue);

    const labels = entries.map(e => e.label);
    const values = entries.map(e => e.value);
    const colors = values.map(v => 
      v > 0 
        ? 'rgba(45, 212, 191, 0.8)' // teal for positive
        : 'rgba(251, 113, 133, 0.8)' // rose for negative
    );
    const borderColors = values.map(v => 
      v > 0 
        ? 'rgba(45, 212, 191, 1)'
        : 'rgba(251, 113, 133, 1)'
    );

    // Find max absolute value for scale
    const maxAbs = Math.max(...values.map(v => Math.abs(v)), 0.5);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 4,
          barThickness: compact ? 16 : 24,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(51, 65, 85, 0.5)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const direction = value > 0 ? 'toward approval' : 'toward denial';
                return `Impact: ${value > 0 ? '+' : ''}${value.toFixed(3)} ${direction}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.3)',
              drawBorder: false,
            },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}`,
            },
            min: -maxAbs,
            max: maxAbs,
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#94a3b8',
              font: { size: compact ? 11 : 12 },
              padding: 8,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [shapValues, topReasons, compact]);

  // Show placeholder if no data
  if ((!shapValues || Object.keys(shapValues).length === 0) && 
      (!topReasons || topReasons.length === 0)) {
    return (
      <div className={`relative ${compact ? 'h-48' : 'h-72'} flex items-center justify-center`}>
        <p className="text-slate-500 text-sm">No factor data available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${compact ? 'h-48' : 'h-72'}`}>
      <canvas ref={chartRef} />
    </div>
  );
}
