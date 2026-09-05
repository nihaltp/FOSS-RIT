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
          <Link to="/" className="btn btn-ghost btn-sm" style={{ paddingLeft: '8px' }}>
            <ArrowLeft size={15} /> [BACK TO OVERVIEW]
          </Link>
        </div>

        {/* Page Banner — Print Room Specimen Archive */}
        <div className="page-header-banner" style={{
          backgroundColor: 'var(--paper-lift)',
          backgroundImage: 'var(--paper-grain)',
          backgroundRepeat: 'repeat',
          border: '2px solid var(--border-tech)',
          boxShadow: '3px 3px 0 var(--border-tech)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-2xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-lg)'
        }}>
          <div style={{ maxWidth: '660px' }}>
            <div className="section-tag">[STUDIO // PRINT ROOM ARCHIVE]</div>
            <h1 style={{ marginTop: '8px', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
              Design &amp; Media Specimen
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--ink-soft)', marginTop: '8px', lineHeight: 1.6 }}>
              Explore UI/UX prototypes, event photography, typography specimens, and visual artwork crafted by student creators across <strong>RIT Kottayam</strong>.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenSubmitCreative}>
            <Sparkles size={15} />
            Submit Creative Specimen
          </button>
        </div>

        {/* Full Creative Catalog */}
        <CreativeShowcase 
          key={`page-studio-${refreshKey}`}
          showSearch={true}
          showViewAll={false}
          onOpenSubmitCreative={onOpenSubmitCreative}
          title="Creative Archive Specimens"
          tagline="[GALLERY // MEDIA REGISTRY]"
        />
      </div>
    </div>
  );
};
