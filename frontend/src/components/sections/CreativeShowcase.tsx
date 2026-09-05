import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CreativeWork } from '../../types';
import { 
  Play, 
  Maximize2, 
  ExternalLink, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Search,
  Camera
} from 'lucide-react';
import { MediaViewerModal } from '../modals/MediaViewerModal';
import { RetroBarcode } from '../ui/RetroBarcode';

interface CreativeShowcaseProps {
  onOpenSubmitCreative: () => void;
  limit?: number;
  showViewAll?: boolean;
  showSearch?: boolean;
  title?: string;
  tagline?: string;
}

type CraftCategory = 'all' | 'design' | 'photography' | 'video' | '3d';

export const CreativeShowcase: React.FC<CreativeShowcaseProps> = ({
  onOpenSubmitCreative,
  limit,
  showViewAll = false,
  showSearch = false,
  title = "Designs, Frames & Visuals",
  tagline = "STUDENT DESIGNS & MEDIA"
}) => {
  const [creatives, setCreatives] = useState<CreativeWork[]>([]);
  const [activeCategory, setActiveCategory] = useState<CraftCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWork, setSelectedWork] = useState<CreativeWork | null>(null);

  useEffect(() => {
    api.getCreatives().then(setCreatives).catch(() => {});
  }, []);

  // Filter creatives
  let filtered = creatives.filter(c => {
    if (activeCategory !== 'all' && c.category?.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tools.some(t => t.toLowerCase().includes(q)) ||
      (c.author_name && c.author_name.toLowerCase().includes(q))
    );
  });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section id="studio" className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-tag">{tagline}</div>
            <h2>{title}</h2>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            {showSearch && (
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search craft, tools, creator..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px', width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            )}

            {showViewAll && (
              <Link to="/studio" className="btn btn-ghost btn-sm">
                View all <ArrowRight size={14} />
              </Link>
            )}

            <button className="btn btn-secondary btn-sm" onClick={onOpenSubmitCreative}>
              <Plus size={14} />
              Submit Media
            </button>
          </div>
        </div>

        {/* Single Row Clean Category Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Crafts
          </button>
          <button
            className={`filter-btn ${activeCategory === 'design' ? 'active' : ''}`}
            onClick={() => setActiveCategory('design')}
          >
            UI/UX Design
          </button>
          <button
            className={`filter-btn ${activeCategory === 'photography' ? 'active' : ''}`}
            onClick={() => setActiveCategory('photography')}
          >
            Photography
          </button>
          <button
            className={`filter-btn ${activeCategory === 'video' ? 'active' : ''}`}
            onClick={() => setActiveCategory('video')}
          >
            Video & Motion
          </button>
          <button
            className={`filter-btn ${activeCategory === '3d' ? 'active' : ''}`}
            onClick={() => setActiveCategory('3d')}
          >
            3D & Visuals
          </button>
        </div>

        {/* Minimalist Horizontal Cards List */}
        {displayed.length === 0 ? (
          <div style={{
            background: 'var(--open-gray)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-2xl)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>No creative media found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="projects-list">
            {displayed.map(item => (
              <div key={item.id} className="project-row-card interactive-hover-card creative-row-card">
                {/* Left Spine: Technical Archival Barcode */}
                <div className="card-barcode-spine">
                  <RetroBarcode 
                    value={`*CRF-${String(item.id).toUpperCase().slice(0, 6)}*`}
                    orientation="responsive"
                    width={18}
                    height={78}
                  />
                </div>

                {/* Left: Compact 16:9 Thumbnail with Subtle Action Overlay */}
                <div 
                  className="creative-thumb-wrapper"
                  onClick={() => setSelectedWork(item)}
                  title="Click to preview media"
                >
                  <img 
                    src={item.thumbnail_url || item.media_url} 
                    alt={item.title} 
                    className="creative-thumb-img" 
                    loading="lazy"
                  />
                  {item.category === 'video' ? (
                    <div className="creative-play-overlay">
                      <Play size={18} fill="#fff" />
                      {item.duration && <span className="creative-duration-pill">{item.duration}</span>}
                    </div>
                  ) : (
                    <div className="creative-play-overlay">
                      <Maximize2 size={15} />
                    </div>
                  )}
                </div>

                {/* Right: Project Main Details */}
                <div className="project-row-main" style={{ flex: 1, minWidth: 0 }}>
                  {/* Top Line: Title, Badges & Action */}
                  <div className="project-row-header">
                    <div className="project-row-title-group">
                      <span 
                        className="project-row-title"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedWork(item)}
                      >
                        {item.title}
                      </span>
                      <span className="category-badge-pill">{item.category}</span>
                      {item.is_verified_student && (
                        <span className="verified-student-badge" title="RIT Verified Student">
                          <CheckCircle2 size={11} /> RIT Verified
                        </span>
                      )}
                    </div>

                    <div className="project-row-actions">
                      {item.category === 'video' ? (
                        <button
                          className="btn btn-secondary btn-sm project-view-btn"
                          onClick={() => setSelectedWork(item)}
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Watch</span>
                        </button>
                      ) : item.category === 'design' && item.media_url ? (
                        <a
                          href={item.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm project-view-btn"
                        >
                          <span>Prototype</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm project-view-btn"
                          onClick={() => setSelectedWork(item)}
                        >
                          <Maximize2 size={12} />
                          <span>Preview</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Middle Line: Concise Description */}
                  <p className="project-row-desc">{item.description}</p>

                  {/* Bottom Line: Tags, License & Creator */}
                  <div className="project-row-footer">
                    <div className="tags-row-inline">
                      {item.tools.slice(0, 4).map(t => (
                        <span key={t} className="tag-badge">{t}</span>
                      ))}
                      {item.license && (
                        <span className="tag-badge" style={{ background: 'rgba(56, 189, 248, 0.08)', color: 'var(--pixel-blue)' }}>
                          {item.license}
                        </span>
                      )}
                      {item.camera_meta?.camera && (
                        <span className="tag-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Camera size={11} /> {item.camera_meta.camera}
                        </span>
                      )}
                    </div>

                    <div className="project-author-link">
                      <img
                        src={item.avatar_url || `https://github.com/${item.author}.png`}
                        alt={item.author_name || item.author}
                        className="project-author-pfp"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span>by {item.author_name || item.author} ({item.department || 'Campus'})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showViewAll && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link to="/studio" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              Explore Complete Studio Showcase <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Floating Media Viewer Modal */}
      <MediaViewerModal
        isOpen={Boolean(selectedWork)}
        onClose={() => setSelectedWork(null)}
        creative={selectedWork}
      />
    </section>
  );
};
