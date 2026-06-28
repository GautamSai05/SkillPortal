'use client';

import { motion } from 'framer-motion';
export function SkeletonCard() {
  return (
    <div className="glass-card p-6">
      <div className="skeleton h-4 w-3/4 mb-3" />
      <div className="skeleton h-3 w-1/2 mb-4" />
      <div className="skeleton h-10 w-full" />
    </div>
  );
}

export function StatsCard({ icon, label, value, color = '#6366f1', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card glass-card-hover p-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `${color}14`, border: `1px solid ${color}20` }}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl stat-number" style={{ color }}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function EmptyState({ icon = '📭', title = 'Nothing here yet', message = 'Data will appear here once available.' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 text-center"
    >
      <div className="text-6xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h3>
      <p className="text-slate-500">{message}</p>
    </motion.div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-3 border-indigo-100" />
        <div className="absolute inset-0 rounded-full border-3 border-t-indigo-500 animate-spin" />
      </div>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-12 text-center"
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Error</h3>
      <p className="text-slate-500 mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary px-8 py-2.5">
          Try Again
        </button>
      )}
    </motion.div>
  );
}
