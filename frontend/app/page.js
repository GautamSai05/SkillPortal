'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiArrowRight, HiAcademicCap, HiChartBar, HiShieldCheck, HiLightningBolt } from 'react-icons/hi';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, loading, router]);

  const features = [
    { icon: <HiAcademicCap className="w-7 h-7" />, title: 'SHL-Style Tests', desc: 'Practice aptitude, reasoning, verbal & coding assessments', color: '#6366f1' },
    { icon: <HiShieldCheck className="w-7 h-7" />, title: 'Proctored Exams', desc: 'Real-time monitoring with tab switch & window blur detection', color: '#10b981' },
    { icon: <HiChartBar className="w-7 h-7" />, title: 'Smart Analytics', desc: 'Track performance trends, strengths, and weak areas', color: '#3b82f6' },
    { icon: <HiLightningBolt className="w-7 h-7" />, title: 'Instant Results', desc: 'Get immediate score breakdowns and detailed feedback', color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen page-gradient">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-[600px] h-[600px] top-[-100px] left-[20%]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)' }} />
        <div className="orb w-[500px] h-[500px] bottom-[-50px] right-[10%]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', animationDelay: '3s' }} />
      </div>

      <nav className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>SP</div>
          <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>SkillPortal</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all hover:bg-indigo-50/60">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary px-5 py-2.5 text-sm inline-block">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5', border: '1px solid rgba(99,102,241,0.15)' }}>
            SHL Practice Platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-slate-900"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            Master Your <span className="gradient-text">Assessment</span> Skills
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Prepare for SHL assessments with realistic practice tests, real-time proctoring, and AI-powered analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2">
              Start Practicing <HiArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-secondary px-8 py-3.5 text-sm inline-block font-medium">
              Sign In to your Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-24">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="glass-card glass-card-hover p-6 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${f.color}12`, color: f.color, border: `1px solid ${f.color}18` }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
