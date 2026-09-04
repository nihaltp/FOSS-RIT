import React from 'react';
import { Link } from 'react-router-dom';
import { CreativeShowcase } from '../components/sections/CreativeShowcase';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CreativesPageProps {
  onOpenSubmitCreative: () => void;
  refreshKey?: number;
}

export const CreativesPage: React.FC<CreativesPageProps> = ({
  onOpenSubmitCreative,
  refreshKey = 0
}) => {
  return (
    <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Link to="/" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={16} /> Back to Overview
          </Link>
        </div>

        {/* Page Banner */}
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
            <span className="event-badge" style={{ background: 'rgba(56, 189, 248, 0.12)', color: 'var(--pixel-blue)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              Creative Studio
            </span>
            <h1 style={{ marginTop: '8px', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
              Design & Media Showcase
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Explore UI/UX prototypes, event photography, aftermovies, and 3D artwork crafted by student creators across <strong>RIT Kottayam</strong>.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenSubmitCreative}>
            <Sparkles size={16} />
            Submit Creative Work
          </button>
        </div>

        {/* Full Creative Catalog */}
        <CreativeShowcase 
          key={`page-studio-${refreshKey}`}
          showSearch={true}
          showViewAll={false}
          onOpenSubmitCreative={onOpenSubmitCreative}
          title="All Featured Works"
          tagline="CAMPUS CREATIVE SHOWCASE"
        />
      </div>
    </div>
  );
};
