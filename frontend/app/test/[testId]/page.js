'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '@/lib/api';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { HiClock, HiExclamation, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function TestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [violations, setViolations] = useState(0);
  const [violationLog, setViolationLog] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [started, setStarted] = useState(false);
  const [codeLang, setCodeLang] = useState('python');

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user?.role === 'admin') { router.push('/admin'); return; }
    if (user && params.testId) fetchTest();
  }, [user, authLoading, params.testId]);

  const fetchTest = async () => {
    try {
      const { data } = await API.get(`/test/${params.testId}`);
      setTest(data.test);
      setQuestions(data.questions);
      setTimeLeft(data.test.duration * 60);
    } catch (err) {
      toast.error('Failed to load test');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const handleVisibility = () => {
      if (document.hidden) addViolation('Tab switching detected');
    };
    const handleBlur = () => addViolation('Window lost focus');
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && started) {
        setIsFullscreen(false);
        addViolation('Exited fullscreen mode');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [started, violations]);

  // When test is started, lock down navigation and outside interactions
  useEffect(() => {
    if (!started) {
      // restore
      document.body.style.pointerEvents = '';
      window.onbeforeunload = null;
      return;
    }

    // Disable pointer events outside the test container by setting body to none
    document.body.style.pointerEvents = 'none';
    if (containerRef.current) containerRef.current.style.pointerEvents = 'auto';

    const preventNav = (e) => {
      // Prevent default navigation keys
      const key = e.key?.toLowerCase();
      if (e.key === 'F5' || (e.ctrlKey && (key === 'r' || key === 'w' || key === 't'))) {
        e.preventDefault();
        toast.error('Navigation is disabled during the test');
      }
    };

    const preventContext = (e) => {
      e.preventDefault();
      toast('Right click disabled during test', { duration: 1500 });
    };

    const beforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    const captureClicks = (e) => {
      // If click is outside the test container, prevent it
      if (!containerRef.current) return;
      const inside = e.target && containerRef.current.contains(e.target);
      if (!inside) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Cannot interact outside the test until submission');
      }
    };

    document.addEventListener('keydown', preventNav, { capture: true });
    document.addEventListener('contextmenu', preventContext, { capture: true });
    document.addEventListener('click', captureClicks, true);
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      document.body.style.pointerEvents = '';
      if (containerRef.current) containerRef.current.style.pointerEvents = '';
      document.removeEventListener('keydown', preventNav, { capture: true });
      document.removeEventListener('contextmenu', preventContext, { capture: true });
      document.removeEventListener('click', captureClicks, true);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [started]);

  const addViolation = useCallback((reason) => {
    setViolations(prev => {
      const newCount = prev + 1;
      setViolationLog(logs => [...logs, `${reason} at ${new Date().toLocaleTimeString()}`]);
      if (newCount >= 3) {
        toast.error('⛔ Maximum violations reached! Auto-submitting test...', { duration: 5000 });
        setTimeout(() => handleSubmit(), 1000);
      } else {
        toast(`⚠️ Warning ${newCount}/3: ${reason}`, {
          icon: '🚨', duration: 4000,
          style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
        });
      }
      return newCount;
    });
  }, []);

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (e) {}
    setStarted(true);
    startTimeRef.current = Date.now();
  };

  const saveAnswer = (questionId, value, type) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: type === 'mcq'
        ? { questionId, selectedAnswer: value }
        : { questionId, code: value },
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch (e) {}

    const timeTaken = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : test.duration * 60 - timeLeft;

    const answerArray = questions.map(q => {
      const a = answers[q._id];
      return a || { questionId: q._id, selectedAnswer: '', code: '' };
    });

    try {
      const { data } = await API.post('/test/submit', {
        userId: user._id,
        testId: params.testId, answers: answerArray,
        timeTaken, violations, violationLog,
      });
      toast.success('Test submitted successfully!');
      router.push(`/result/${data._id}`);
    } catch (err) {
      toast.error('Submission failed');
      setSubmitting(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-3 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-3 border-t-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const q = questions[currentQ];
  const isUrgent = timeLeft < 60;
  const answeredCount = Object.keys(answers).length;

  // Pre-test instructions screen — LIGHT MODE
  if (!started) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{test.title}</h1>
          <p className="text-slate-500 mb-6">{test.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-3 text-center">
              <p className="text-lg font-bold text-slate-800">{questions.length}</p>
              <p className="text-xs text-slate-500">Questions</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-lg font-bold text-slate-800">{test.duration} min</p>
              <p className="text-xs text-slate-500">Duration</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-lg font-bold capitalize text-slate-800">{test.type}</p>
              <p className="text-xs text-slate-500">Type</p>
            </div>
          </div>

          <div className="text-left p-4 rounded-xl mb-6" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <p className="text-sm font-semibold text-amber-700 mb-2">⚠️ Important Rules:</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• The test will enter fullscreen mode</li>
              <li>• Tab switching and window blur are monitored</li>
              <li>• You have 3 warnings before auto-submit</li>
              <li>• Timer starts immediately after clicking begin</li>
            </ul>
          </div>

          <button onClick={startTest} className="btn-primary w-full py-3.5 text-sm">
            Begin Test 🚀
          </button>
        </motion.div>
      </div>
    );
  }

  // ACTIVE TEST — LIGHT MODE
  return (
    <div ref={containerRef} className="min-h-screen flex flex-col page-gradient">
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(99,102,241,0.1)', backdropFilter: 'blur(20px) saturate(180%)' }}>
        <div>
          <h2 className="text-sm font-semibold text-slate-800">{test.title}</h2>
          <p className="text-xs text-slate-500">Q {currentQ + 1} of {questions.length} · {answeredCount} answered</p>
        </div>

        <div className="flex items-center gap-3">
          {violations > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.15)' }}>
              <HiExclamation className="w-4 h-4" /> {violations}/3
            </div>
          )}

          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold ${isUrgent ? 'animate-pulse' : ''}`}
            style={{
              background: isUrgent ? 'rgba(239,68,68,0.08)' : 'rgba(99,102,241,0.08)',
              color: isUrgent ? '#dc2626' : '#4f46e5',
              border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)'}`,
            }}>
            <HiClock className="w-4 h-4" /> {formatTime(timeLeft)}
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question nav sidebar */}
        <div className="w-20 border-r p-3 overflow-y-auto hidden sm:block"
          style={{ borderColor: 'rgba(99,102,241,0.08)', background: 'rgba(255,255,255,0.5)' }}>
          <div className="grid grid-cols-2 gap-2">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)}
                className="w-full aspect-square rounded-xl text-xs font-semibold flex items-center justify-center transition-all"
                style={{
                  background: i === currentQ ? 'rgba(99,102,241,0.15)' : answers[questions[i]._id] ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.8)',
                  border: `1.5px solid ${i === currentQ ? 'rgba(99,102,241,0.3)' : answers[questions[i]._id] ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.06)'}`,
                  color: i === currentQ ? '#4f46e5' : answers[questions[i]._id] ? '#059669' : '#64748b',
                }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main question area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-3 capitalize"
                  style={{ background: 'rgba(99,102,241,0.08)', color: '#4f46e5' }}>
                  {q.type} · {q.difficulty}
                </span>
                <h3 className="text-xl font-semibold text-slate-800 leading-relaxed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {q.questionText}
                </h3>
              </div>

              {q.type === 'mcq' && (
                <div className="space-y-3 max-w-2xl">
                  {q.options.map((opt, idx) => {
                    const isSelected = answers[q._id]?.selectedAnswer === opt;
                    return (
                      <motion.button key={idx} whileTap={{ scale: 0.98 }}
                        onClick={() => saveAnswer(q._id, opt, 'mcq')}
                        className="w-full text-left p-4 rounded-xl transition-all flex items-center gap-3"
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.7)',
                          border: `1.5px solid ${isSelected ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.06)'}`,
                          boxShadow: isSelected ? '0 2px 8px rgba(99,102,241,0.08)' : 'none',
                        }}>
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: isSelected ? '#6366f1' : 'rgba(99,102,241,0.08)',
                            color: isSelected ? '#fff' : '#6366f1',
                          }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`text-sm ${isSelected ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {q.type === 'coding' && (
                <div className="space-y-4">
                  {q.constraints && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(99,102,241,0.08)' }}>
                      <p className="text-slate-600"><strong className="text-slate-700">Constraints:</strong> {q.constraints}</p>
                    </div>
                  )}
                  {q.sampleInput && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(99,102,241,0.08)' }}>
                        <p className="text-xs text-slate-500 mb-1">Sample Input</p>
                        <code className="text-sm text-indigo-600 font-mono">{q.sampleInput}</code>
                      </div>
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(99,102,241,0.08)' }}>
                        <p className="text-xs text-slate-500 mb-1">Expected Output</p>
                        <code className="text-sm text-indigo-600 font-mono">{q.sampleOutput}</code>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mb-2">
                    {['python', 'java', 'c'].map(lang => (
                      <button key={lang} onClick={() => setCodeLang(lang)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                        style={{
                          background: codeLang === lang ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.7)',
                          color: codeLang === lang ? '#4f46e5' : '#64748b',
                          border: `1.5px solid ${codeLang === lang ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.06)'}`,
                        }}>
                        {lang}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.12)' }}>
                    <Editor
                      height="350px"
                      language={codeLang === 'c' ? 'c' : codeLang}
                      theme="vs-dark"
                      value={answers[q._id]?.code || ''}
                      onChange={(value) => saveAnswer(q._id, value, 'coding')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-4" style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-800 transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.6)' }}>
              <HiChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-sm text-slate-500 sm:hidden">{currentQ + 1} / {questions.length}</span>

            <button onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
              disabled={currentQ === questions.length - 1}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5', border: '1px solid rgba(99,102,241,0.15)' }}>
              Next <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
