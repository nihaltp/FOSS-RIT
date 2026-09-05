import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Layers, Trophy } from 'lucide-react';
import { GitHubIcon } from '../ui/GitHubIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{
                width: '38px',
                height: '38px',
                background: 'var(--ink-black)',
                borderRadius: 0,
                border: '1.5px solid var(--border-tech)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                boxShadow: '2px 2px 0 var(--border-tech)'
              }}>
                <svg width="24" height="24" viewBox="0 0 32 32">
                  <rect width="32" height="32" fill="var(--ink-black)" />
                  <rect x="2" y="2" width="28" height="28" fill="var(--paper-base)" />
                  <rect x="7" y="9" width="4" height="4" fill="var(--ink-black)" />
                  <rect x="21" y="9" width="4" height="4" fill="var(--ink-black)" />
                  <path d="M7 19 H25 V23 H7 Z" fill="var(--vibe-accent)" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>FOSS Club RIT</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>[CHAPTER 2160 // RIT KOTTAYAM]</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Building the open source &amp; hacker culture at Rajiv Gandhi Institute of Technology in active collaboration with TinkerHub Foundation.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', marginBottom: 'var(--space-md)' }}>// QUICK INDEX</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
              <li><Link to="/" className="nav-link">[01] Overview</Link></li>
              <li><Link to="/projects" className="nav-link">[02] Projects Radar</Link></li>
              <li><Link to="/studio" className="nav-link">[03] Creative Studio</Link></li>
              <li><Link to="/leaderboard" className="nav-link">[04] Leaderboard</Link></li>
              <li><Link to="/manifesto" className="nav-link">[05] FOSS Manifesto</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', marginBottom: 'var(--space-md)' }}>// COMMUNITY</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
              <li>
                <a href="https://github.com/vertigotalks7/FOSS-RIT" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <GitHubIcon size={13} /> FOSS-RIT GitHub
                </a>
              </li>
              <li>
                <a href="https://tinkerhub.org/campus/2160/Rajiv%20Gandhi%20Institute%20of%20Technology,%20Velloor" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ExternalLink size={13} /> TinkerHub RIT Chapter ↗
                </a>
              </li>
              <li>
                <Link to="/leaderboard" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={13} /> Contributor Radar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', marginBottom: 'var(--space-md)' }}>// DISPATCH REPO</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', marginBottom: 'var(--space-md)', lineHeight: 1.55 }}>
              Built an open-source tool or student utility at RIT? Feature your repository on the campus radar.
            </p>
            <Link to="/projects" className="btn btn-primary btn-sm">
              <Layers size={13} />
              Feature a Project
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 FOSS CLUB RIT KOTTAYAM x TINKERHUB // ALL CODE LIBRE UNDER MIT.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Built by{' '}
            <a 
              href="https://github.com/vertigotalks7" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--vibe-accent)', textDecoration: 'none', fontWeight: 700 }}
              title="Created by @vertigotalks7"
            >
              @vertigotalks7
            </a>
            {' '}for RIT Kottayam [9.5916° N, 76.5222° E]
          </span>
        </div>
      </div>
    </footer>
  );
};
