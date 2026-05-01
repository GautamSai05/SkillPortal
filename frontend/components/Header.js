'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiHome, HiChartBar, HiCog, HiLogout, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const navItems = isAdmin
    ? [
        { href: '/admin', label: 'Dashboard', icon: HiHome },
        { href: '/admin/categories', label: 'Categories', icon: HiCog },
        { href: '/admin/tests', label: 'Tests', icon: HiCog },
        { href: '/admin/questions', label: 'Questions', icon: HiCog },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: HiHome },
        { href: '/analytics', label: 'Analytics', icon: HiChartBar },
      ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
        boxShadow: '0 1px 3px rgba(99, 102, 241, 0.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              SP
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <span className="gradient-text">SkillPortal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-indigo-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50/60'
                  }`}
                  style={isActive ? { background: 'rgba(99, 102, 241, 0.1)', color: '#4338ca' } : {}}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs capitalize text-slate-400">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Logout"
            >
              <HiLogout className="w-5 h-5" />
            </button>
            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-indigo-50"
            >
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t px-4 py-3"
          style={{ borderColor: 'rgba(99, 102, 241, 0.08)', background: 'rgba(255, 255, 255, 0.95)' }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-indigo-700 hover:bg-indigo-50/60 transition-all"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
