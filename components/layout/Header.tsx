'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaFutbol, FaHome, FaTrophy, FaNewspaper, FaCalendarAlt } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/matches', label: 'Matches', icon: FaCalendarAlt },
    { href: '/leagues', label: 'Leagues', icon: FaTrophy },
    { href: '/news', label: 'News', icon: FaNewspaper },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(10, 14, 26, 0.97)'
          : 'rgba(10, 14, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-green-500 opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <FaFutbol className="text-lg relative z-10" style={{ color: 'var(--accent-green)' }} />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-base font-bold tracking-tight"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '0.5px' }}
              >
                FOOTBALL<span style={{ color: 'var(--accent-green)' }}>LIVE</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest" style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>
                SCORES
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  style={isActive ? { color: 'var(--text-primary)', background: 'rgba(255,255,255,0.08)' } : {}}
                >
                  <Icon size={13} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live indicator + mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)' }}>
              <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--accent-green)', letterSpacing: '1px' }}>LIVE</span>
            </div>

            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: isMenuOpen ? '300px' : '0', opacity: isMenuOpen ? 1 : 0 }}
        >
          <div className="py-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link"
                    style={isActive ? { color: 'var(--text-primary)', background: 'rgba(255,255,255,0.08)' } : {}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
