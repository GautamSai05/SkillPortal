'use client';

import Header from '@/components/Header';
import { ErrorState, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiArrowLeft, HiCheckCircle, HiClock, HiExclamation, HiXCircle } from 'react-icons/hi';

export default function ResultPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user && params.resultId) fetchResult();
  }, [user, authLoading, params.resultId]);


  const fetchResult = async () => {
    try {
      const { data } = await API.get(`/result/${params.resultId}`);
      setResult(data);
    } catch (err) {
      setError('Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;
  if (loading) return <div className="min-h-screen page-gradient"><Header /><LoadingSpinner /></div>;
  if (error) return <div className="min-h-screen page-gradient"><Header /><div className="max-w-4xl mx-auto px-4 py-8"><ErrorState message={error} /></div></div>;

  
  const r = result;
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const scoreColor = r.score >= 70 ? '#059669' : r.score >= 40 ? '#d97706' : '#dc2626';
  const scoreBg = r.score >= 70 ? 'rgba(16,185,129,0.06)' : r.score >= 40 ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)';
  const scoreEmoji = r.score >= 70 ? '🎉' : r.score >= 40 ? '💪' : '📚';
  const scoreMsg = r.score >= 70 ? 'Excellent Performance!' : r.score >= 40 ? 'Good Effort!' : 'Keep Practicing!';

  return (
    <div className="min-h-screen page-gradient">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <HiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Score Hero */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center mb-6" style={{ borderColor: `${scoreColor}20` }}>
          <div className="text-6xl mb-3" style={{ animation: 'float 3s ease-in-out infinite' }}>{scoreEmoji}</div>
          <h1 className="text-4xl font-bold mb-1 stat-number" style={{ color: scoreColor }}>
            {r.score}%
          </h1>
          <p className="text-lg text-slate-800 font-semibold">{scoreMsg}</p>
          <p className="text-slate-500 mt-1">{r.testId?.title}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-4 text-center">
            <HiCheckCircle className="w-6 h-6 mx-auto mb-1" style={{ color: '#059669' }} />
            <p className="text-xl font-bold text-slate-800">{r.correctAnswers}</p>
            <p className="text-xs text-slate-500">Correct</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-4 text-center">
            <HiXCircle className="w-6 h-6 mx-auto mb-1" style={{ color: '#dc2626' }} />
            <p className="text-xl font-bold text-slate-800">{r.totalQuestions - r.correctAnswers}</p>
            <p className="text-xs text-slate-500">Incorrect</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center">
            <HiClock className="w-6 h-6 mx-auto mb-1" style={{ color: '#6366f1' }} />
            <p className="text-xl font-bold text-slate-800">{formatTime(r.timeTaken)}</p>
            <p className="text-xs text-slate-500">Time</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card p-4 text-center">
            <HiExclamation className="w-6 h-6 mx-auto mb-1" style={{ color: r.violations > 0 ? '#dc2626' : '#059669' }} />
            <p className="text-xl font-bold text-slate-800">{r.violations}</p>
            <p className="text-xs text-slate-500">Violations</p>
          </motion.div>
        </div>

        {/* Accuracy Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Accuracy</span>
            <span className="text-sm font-bold" style={{ color: scoreColor }}>{r.accuracy}%</span>
          </div>
          <div className="progress-bar">
            <motion.div initial={{ width: 0 }} animate={{ width: `${r.accuracy}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="progress-bar-fill"
              style={{ background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}bb)` }} />
          </div>
        </motion.div>

        {/* Answer Breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-semibold text-slate-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Answer Breakdown
          </h2>
          <div className="space-y-3">
            {r.answers?.map((a, i) => (
              <div key={i} className="glass-card p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: a.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: a.isCorrect ? '#059669' : '#dc2626',
                  }}>
                  {a.isCorrect ? '✓' : '✗'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">
                    Q{i + 1}: {a.questionId?.questionText || 'Question'}
                  </p>
                  {a.selectedAnswer && (
                    <p className="text-xs text-slate-500 mt-0.5">Your answer: {a.selectedAnswer}</p>
                  )}
                  {a.totalTestCases !== undefined && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Test cases: {a.passedTestCases}/{a.totalTestCases} passed
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-3 mt-8">
          <Link href="/dashboard" className="btn-primary px-6 py-3 text-sm flex-1 text-center">
            Back to Dashboard
          </Link>
          <Link href="/analytics" className="btn-secondary px-6 py-3 text-sm text-center flex-1">
            View Analytics
          </Link>
        </div>
      </main>
    </div>
  );
}
