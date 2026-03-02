'use client';

import Link from 'next/link';
import { FaFutbol, FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/matches', label: 'Live Scores' },
    { href: '/leagues', label: 'Leagues' },
    { href: '/news', label: 'News' },
  ];

  const socials = [
    { href: '#', icon: FaTwitter, label: 'Twitter' },
    { href: '#', icon: FaFacebook, label: 'Facebook' },
    { href: '#', icon: FaInstagram, label: 'Instagram' },
    { href: '#', icon: FaGithub, label: 'GitHub' },
  ];

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <FaFutbol style={{ color: 'var(--accent-green)', fontSize: '18px' }} />
              <span
                className="text-base font-bold"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '1px' }}
              >
                FOOTBALL<span style={{ color: 'var(--accent-green)' }}>LIVE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Real-time football scores, fixtures, standings, and statistics from all major leagues worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Connect
            </h3>
            <div className="flex gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,230,118,0.12)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent-green)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 text-xs"
          style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <span>© {currentYear} FootballLive. All rights reserved.</span>
          <span>For educational purposes only. Not affiliated with any sports organization.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
