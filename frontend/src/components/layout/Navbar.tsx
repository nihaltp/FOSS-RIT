import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Compass, 
  Layers, 
  Palette,
  Trophy, 
  ShieldAlert,
  Star
} from 'lucide-react';
import { GitHubIcon } from '../ui/GitHubIcon';
import { useVibe, VIBES, VibeId } from '../../context/VibeContext';
import { MascotIcon } from '../ui/MascotIcon';

export const Navbar: React.FC = () => {
  const { activeVibe, setVibe } = useVibe();
  const location = useLocation();
  const [vibeMenuOpen, setVibeMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setVibeMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Left: Brand Logo */}
        <Link to="/" className="brand-logo" title="FOSS Club RIT - Free & Open Source Software">
          <div className="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" fill="var(--ink-black)" />
              <rect x="2" y="2" width="28" height="28" fill="var(--paper-base)" />
              <rect x="6" y="8" width="5" height="5" fill="var(--ink-black)" />
              <rect x="21" y="8" width="5" height="5" fill="var(--ink-black)" />
              <path d="M7 19 H25 V23 H7 Z" fill="var(--vibe-accent)" />
            </svg>
          </div>
          <div className="brand-logo-text">
            <span className="brand-logo-title">FOSS CLUB RIT</span>
            <span className="brand-logo-sub">[RIT KOTTAYAM • TINKERHUB]</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links with Technical Index */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `nav-link ${isActive && !location.hash ? 'active-nav-link' : ''}`}
              >
                <span className="nav-index">01</span>Overview
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/projects" 
                className={({ isActive }) => `nav-link ${isActive ? 'active-nav-link' : ''}`}
              >
                <span className="nav-index">02</span>Projects
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/studio" 
                className={({ isActive }) => `nav-link ${isActive ? 'active-nav-link' : ''}`}
              >
                <span className="nav-index">03</span>Studio
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/leaderboard" 
                className={({ isActive }) => `nav-link ${isActive ? 'active-nav-link' : ''}`}
              >
                <span className="nav-index">04</span>Leaderboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/manifesto" 
                className={({ isActive }) => `nav-link ${isActive ? 'active-nav-link' : ''}`}
              >
                <span className="nav-index">05</span>Manifesto
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right: Actions & Theme Controls */}
        <div className="nav-actions">
          {/* Builder Persona Switcher (Styled as DIP Switch / System Mode) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setVibeMenuOpen(!vibeMenuOpen)}
              className="vibe-switch-btn"
              title={`System Mode: ${activeVibe.name} (Click to toggle)`}
              aria-label="Switch builder persona theme"
            >
              <MascotIcon vibe={activeVibe.id} size={15} color={activeVibe.color} />
              <span className="vibe-switch-label">
                SYS: {activeVibe.id.toUpperCase()}
              </span>
              <span className="vibe-switch-emoticon" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: activeVibe.color, fontWeight: 700 }}>
                {activeVibe.emoticon}
              </span>
            </button>

            {vibeMenuOpen && (
              <div
                className="user-dropdown-menu"
                style={{ minWidth: '240px', right: 0 }}
                onClick={() => setVibeMenuOpen(false)}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-tech)', background: 'var(--paper-warm)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--ink-black)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                    // SELECT SYSTEM PERSONA
                  </div>
                </div>
                <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(Object.keys(VIBES) as VibeId[]).map(id => {
                    const v = VIBES[id];
                    const isCur = activeVibe.id === id;
                    return (
                      <button
                        key={id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setVibe(id);
                          setVibeMenuOpen(false);
                        }}
                        className="dropdown-item"
                        style={{
                          background: isCur ? 'var(--ink-black)' : 'transparent',
                          color: isCur ? 'var(--paper-base)' : 'var(--ink-black)',
                          border: `1px solid ${isCur ? 'var(--ink-black)' : 'transparent'}`,
                          borderRadius: 0,
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MascotIcon vibe={id} size={18} color={isCur ? 'var(--paper-base)' : v.color} />
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                              {v.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: isCur ? '#D4CDC0' : 'var(--ink-muted)' }}>
                              {v.role}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {v.emoticon}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* GitHub Repository Link Button */}
          <a 
            href="https://github.com/vertigotalks7/FOSS-RIT" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary btn-sm nav-signin-btn"
            title="Star and contribute on GitHub"
          >
            <GitHubIcon size={14} />
            <span className="signin-text">GITHUB</span>
            <Star size={12} color="var(--amber-crt)" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `mobile-nav-link ${isActive && !location.hash ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={16} /> [01] OVERVIEW
            </NavLink>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Layers size={16} /> [02] PROJECTS RADAR
            </NavLink>
            <NavLink 
              to="/studio" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Palette size={16} /> [03] CREATIVE STUDIO
            </NavLink>
            <NavLink 
              to="/leaderboard" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Trophy size={16} /> [04] LEADERBOARD
            </NavLink>
            <NavLink 
              to="/manifesto" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShieldAlert size={16} /> [05] MANIFESTO
            </NavLink>

            {/* Mobile GitHub Link */}
            <a
              href="https://github.com/vertigotalks7/FOSS-RIT"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-link"
              style={{ color: 'var(--vibe-accent)', fontWeight: 700 }}
            >
              <GitHubIcon size={16} /> [REPO] STAR ON GITHUB ★
            </a>

            {/* Mobile Builder Persona Selector */}
            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '2px solid var(--border-tech)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--ink-black)', fontFamily: 'var(--font-mono)', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.06em' }}>
                // BUILDER PERSONA
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {(Object.keys(VIBES) as VibeId[]).map(id => {
                  const v = VIBES[id];
                  const isCur = activeVibe.id === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setVibe(id);
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        background: isCur ? 'var(--ink-black)' : 'var(--paper-lift)',
                        color: isCur ? 'var(--paper-base)' : 'var(--ink-black)',
                        borderColor: 'var(--border-tech)',
                        border: '1px solid var(--border-tech)',
                        borderRadius: 0,
                        padding: '8px 4px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: isCur ? 'none' : '1px 1px 0 var(--border-tech)'
                      }}
                    >
                      <MascotIcon vibe={id} size={18} color={isCur ? 'var(--paper-base)' : v.color} />
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {id.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
