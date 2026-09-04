import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ContributorRank } from '../types';
import { useToast } from '../context/ToastContext';
import { 
  Star, 
  GitFork, 
  Layers, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  HelpCircle,
  ExternalLink,
  ArrowLeft,
  Zap,
  Sparkles,
  Code,
  Palette
} from 'lucide-react';

interface LeaderboardPageProps {
  onOpenSubmitProject?: () => void;
}

type LeaderboardTab = 'code' | 'creative';

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onOpenSubmitProject }) => {
  const { showToast } = useToast();
  const [activeDomain, setActiveDomain] = useState<LeaderboardTab>('code');
  const [contributors, setContributors] = useState<ContributorRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showXpGuide, setShowXpGuide] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaderboard('all_time');
      setContributors(data.contributors || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load leaderboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Filter for Code Contributors
  const codeContributors = contributors
    .filter(c => (c.total_projects || 0) > 0)
    .filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return c.username.toLowerCase().includes(q) || 
             c.display_name.toLowerCase().includes(q) || 
             c.title.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (b.total_forks !== a.total_forks) return b.total_forks - a.total_forks;
      if (b.total_stars !== a.total_stars) return b.total_stars - a.total_stars;
      if (b.total_projects !== a.total_projects) return b.total_projects - a.total_projects;
      return b.xp - a.xp;
    })
    .map((c, idx) => ({
      ...c,
      domainRank: idx + 1,
      domainMedal: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`
    }));

  // Filter for Creative Makers
  const creativeContributors = contributors
    .filter(c => (c.total_creatives || 0) > 0)
    .filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return c.username.toLowerCase().includes(q) || 
             c.display_name.toLowerCase().includes(q) || 
             c.title.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if ((b.total_creatives || 0) !== (a.total_creatives || 0)) {
        return (b.total_creatives || 0) - (a.total_creatives || 0);
      }
      return b.xp - a.xp;
    })
    .map((c, idx) => ({
      ...c,
      domainRank: idx + 1,
      domainMedal: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`
    }));

  const activeList = activeDomain === 'code' ? codeContributors : creativeContributors;

  const getTierColor = (level: number) => {
    switch (level) {
      case 5: return '#E84A36'; // Kernel Overlord
      case 4: return '#A855F7'; // Systems Architect
      case 3: return '#2B7FFF'; // Byte Craftsman
      case 2: return 'var(--foss-mint)'; // Open Source Novice
      default: return 'var(--text-muted)'; // Script Tinkerer
    }
  };

  return (
    <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Link to="/" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={16} /> Back to Overview
          </Link>
        </div>

        {/* Page Banner / Hero Card */}
        <div style={{
          background: 'var(--open-gray)',
          border: '1px solid var(--surface-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-2xl)',
          marginBottom: 'var(--space-2xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-lg)'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <span className="event-badge">Campus Hall of Fame</span>
            <h1 style={{ marginTop: '8px', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
              Contributor Rankings
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Recognizing both open source software builders and creative visual artists at <strong>RIT Kottayam</strong>.
            </p>
          </div>

          {onOpenSubmitProject && (
            <button className="btn btn-primary" onClick={onOpenSubmitProject}>
              <Sparkles size={16} />
              Feature Your Work
            </button>
          )}
        </div>

        {/* Dual Domain Selector Cards (Code vs Creatives) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-2xl)'
        }}>
          {/* Card 1: Code Contributors */}
          <div
            onClick={() => setActiveDomain('code')}
            className="interactive-hover-card"
            style={{
              background: 'var(--open-gray)',
              border: activeDomain === 'code' ? '1.5px solid var(--foss-mint)' : '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              cursor: 'pointer',
              boxShadow: activeDomain === 'code' ? '0 0 20px rgba(8, 183, 79, 0.12)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: activeDomain === 'code' ? 'var(--foss-mint-subtle)' : 'var(--surface-raised)',
                  color: activeDomain === 'code' ? 'var(--foss-mint)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Code size={17} />
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Code Contributors</h3>
              </div>
              <span className="tag-badge-pill" style={{ opacity: activeDomain === 'code' ? 1 : 0.6 }}>
                {contributors.filter(c => (c.total_projects || 0) > 0).length} Devs
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Ranked by peer repository forks, GitHub stars, and open source software shipped.
            </p>
          </div>

          {/* Card 2: Creative Makers */}
          <div
            onClick={() => setActiveDomain('creative')}
            className="interactive-hover-card"
            style={{
              background: 'var(--open-gray)',
              border: activeDomain === 'creative' ? '1.5px solid var(--pixel-blue)' : '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              cursor: 'pointer',
              boxShadow: activeDomain === 'creative' ? '0 0 20px rgba(56, 189, 248, 0.12)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: activeDomain === 'creative' ? 'rgba(56, 189, 248, 0.12)' : 'var(--surface-raised)',
                  color: activeDomain === 'creative' ? 'var(--pixel-blue)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Palette size={17} />
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Creative Makers</h3>
              </div>
              <span 
                className="category-badge-pill"
                style={{ 
                  opacity: activeDomain === 'creative' ? 1 : 0.6,
                  borderColor: activeDomain === 'creative' ? 'var(--pixel-blue)' : 'var(--surface-border)'
                }}
              >
                {contributors.filter(c => (c.total_creatives || 0) > 0).length} Creators
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Ranked by UI/UX design systems, event frames, video aftermovies, and 3D renders.
            </p>
          </div>
        </div>

        {/* Section Header & Controls */}
        <section className="section" style={{ padding: 0 }}>
          <div className="section-header">
            <div>
              <div className="section-tag" style={{ color: activeDomain === 'code' ? 'var(--foss-mint)' : 'var(--pixel-blue)' }}>
                {activeDomain === 'code' ? 'SOFTWARE ENGINEERING RADAR' : 'CREATIVE STUDIO RADAR'}
              </div>
              <h2>
                {activeDomain === 'code' ? 'Code Contributors Hall of Fame' : 'Designers, Photographers & Editors'}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search Box */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder={activeDomain === 'code' ? 'Search developer...' : 'Search creator...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px', width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              {/* How XP Works button */}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowXpGuide(!showXpGuide)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <HelpCircle size={14} />
                <span>How XP Works</span>
              </button>

              {/* Refresh Leaderboard */}
              <button
                className="btn btn-secondary btn-sm"
                onClick={fetchLeaderboard}
                disabled={loading}
                title="Refresh Leaderboard"
                aria-label="Refresh Leaderboard"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
                <span>{loading ? 'Updating...' : 'Sync Radar'}</span>
              </button>
            </div>
          </div>

          {/* XP Guide Banner */}
          {showXpGuide && (
            <div style={{
              background: 'var(--open-gray)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: 'var(--space-xl)',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={15} color="var(--byte-yellow)" /> Balanced Contributor XP Formula
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                XP is awarded equally across code and creative contributions:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ background: 'var(--surface-raised)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                  <strong style={{ color: 'var(--foss-mint)' }}>+50 XP:</strong> Campus Student Verified
                </div>
                <div style={{ background: 'var(--surface-raised)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                  <strong style={{ color: '#2B7FFF' }}>+100 XP:</strong> 1st Project / Creative Showcase
                </div>
                <div style={{ background: 'var(--surface-raised)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                  <strong style={{ color: '#F5C040' }}>+75 XP:</strong> Subsequent Featured Works
                </div>
                <div style={{ background: 'var(--surface-raised)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                  <strong style={{ color: '#A855F7' }}>+20 XP / fork:</strong> Peer Cloned Your Repo
                </div>
                <div style={{ background: 'var(--surface-raised)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                  <strong style={{ color: '#10B981' }}>+30 XP:</strong> Open Tools (Penpot/Blender/Krita)
                </div>
                <div style={{ background: 'var(--surface-raised)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                  <strong style={{ color: '#EC4899' }}>+15 XP / tech:</strong> Tool & Stack Versatility
                </div>
              </div>
            </div>
          )}

          {/* Contributor Rows / Empty State */}
          {loading ? (
            <div style={{
              background: 'var(--open-gray)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2xl)',
              textAlign: 'center'
            }}>
              <RefreshCw size={22} className="spin" style={{ margin: '0 auto 10px', color: 'var(--foss-mint)' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Calculating live rankings and XP scores...
              </p>
            </div>
          ) : activeList.length === 0 ? (
            <div style={{
              background: 'var(--open-gray)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2xl)',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                No contributors found matching your search.
              </p>
            </div>
          ) : (
            <div className="projects-list">
              {activeList.map((c) => (
                <div
                  key={c.user_id || c.username}
                  className="project-row-card"
                  style={{
                    borderLeft: c.domainRank === 1 ? '3px solid #F5C040' : c.domainRank === 2 ? '3px solid silver' : c.domainRank === 3 ? '3px solid #CD7F32' : undefined
                  }}
                >
                  <div className="project-row-main">
                    {/* Header Line */}
                    <div className="project-row-header">
                      <div className="project-row-title-group">
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: c.domainRank <= 3 ? '1.15rem' : '0.92rem',
                          minWidth: '28px',
                          textAlign: 'center',
                          color: c.domainRank === 1 ? '#F5C040' : c.domainRank === 2 ? 'silver' : c.domainRank === 3 ? '#CD7F32' : 'var(--text-muted)'
                        }}>
                          {c.domainMedal || `#${c.domainRank}`}
                        </span>

                        <img
                          src={c.avatar_url}
                          alt={c.username}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: `1.5px solid ${getTierColor(c.level)}`
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />

                        <span className="project-row-title">
                          {c.display_name}
                        </span>

                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          @{c.username}
                        </span>

                        <span 
                          className="tag-badge-pill"
                          style={{
                            borderColor: `${getTierColor(c.level)}66`,
                            color: getTierColor(c.level),
                            background: `${getTierColor(c.level)}15`,
                            fontWeight: 700
                          }}
                        >
                          LVL {c.level} • {c.title}
                        </span>

                        {c.is_verified_student && (
                          <span className="verified-student-badge">
                            <CheckCircle2 size={11} /> RIT Verified
                          </span>
                        )}
                      </div>

                      {/* Right side stats & action */}
                      <div className="project-row-actions">
                        <div className="project-stats-inline">
                          {activeDomain === 'code' ? (
                            <>
                              <span className="project-stat" title="Featured Repositories">
                                <Layers size={13} color="var(--text-secondary)" />
                                <strong>{c.total_projects}</strong>
                              </span>
                              <span className="project-stat" title="GitHub Stars">
                                <Star size={13} color="var(--byte-yellow)" />
                                <strong>{c.total_stars}</strong>
                              </span>
                              <span className="project-stat" title="Peer Forks">
                                <GitFork size={13} color="var(--pixel-blue)" />
                                <span>{c.total_forks}</span>
                              </span>
                            </>
                          ) : (
                            <span className="project-stat" title="Creative Showcases">
                              <Palette size={13} color="var(--pixel-blue)" />
                              <strong>{c.total_creatives} Works</strong>
                            </span>
                          )}

                          <span className="project-stat" title="Total XP" style={{ color: getTierColor(c.level), fontWeight: 800 }}>
                            <Zap size={13} color={getTierColor(c.level)} />
                            <strong>{c.xp} XP</strong>
                          </span>
                        </div>

                        <a
                          href={`https://github.com/${c.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm project-view-btn"
                          title="View Profile"
                        >
                          <span>Profile</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    {/* Middle line: XP Progress Bar toward next tier */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                      <div style={{ flex: 1, maxWidth: '240px', height: '6px', background: 'var(--surface-border)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                        <div style={{ width: `${c.progress}%`, height: '100%', background: getTierColor(c.level), borderRadius: 'var(--radius-pill)' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {c.progress}% to next tier ({c.min_xp} → {c.max_xp} XP)
                      </span>
                    </div>

                    {/* Bottom line: Badges */}
                    {c.badges && c.badges.length > 0 && (
                      <div className="project-row-footer" style={{ marginTop: '4px' }}>
                        <div className="tags-row-inline">
                          {c.badges.map(b => (
                            <span key={b.id} className="tag-badge" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span>{b.icon}</span> {b.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
