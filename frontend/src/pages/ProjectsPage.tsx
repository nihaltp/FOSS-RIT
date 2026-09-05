import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectsGrid } from '../components/sections/ProjectsGrid';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface ProjectsPageProps {
  onOpenSubmitProject: () => void;
  refreshKey: number;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenSubmitProject, refreshKey }) => {
  return (
    <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Link to="/" className="btn btn-ghost btn-sm" style={{ paddingLeft: '8px' }}>
            <ArrowLeft size={15} /> [BACK TO OVERVIEW]
          </Link>
        </div>

        {/* Page Banner — Archival Technical Header */}
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
            <div className="section-tag">[ARCHIVE // RIT-REPO-INDEX]</div>
            <h1 style={{ marginTop: '8px', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
              Open Source Showcase
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--ink-soft)', marginTop: '8px', lineHeight: 1.6 }}>
              Discover open-source libraries, web tools, and campus utilities maintained by students and alumni of <strong>RIT Kottayam</strong>. All metrics are auto-synced from GitHub.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenSubmitProject}>
            <Sparkles size={15} />
            Submit Repository
          </button>
        </div>

        {/* Full Projects Catalog with Search, Sorting & Tech Stack Filter */}
        <ProjectsGrid
          key={`all-projects-${refreshKey}`}
          showSearch={true}
          showSorting={true}
          showViewAll={false}
          title="Campus Technical Registry"
          tagline="[INDEX // VERIFIED REPOSITORIES]"
          onOpenSubmitProject={onOpenSubmitProject}
        />
      </div>
    </div>
  );
};
