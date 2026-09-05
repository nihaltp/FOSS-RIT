import React from 'react';
import { Link } from 'react-router-dom';
import { EventsGrid } from '../components/sections/EventsGrid';
import { Event } from '../types';
import { ArrowLeft } from 'lucide-react';

interface EventsPageProps {
  onOpenRsvp: (event: Event) => void;
  refreshKey: number;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onOpenRsvp, refreshKey }) => {
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
        <div className="page-header-banner" style={{
          backgroundColor: 'var(--paper-lift)',
          backgroundImage: 'var(--paper-grain)',
          backgroundRepeat: 'repeat',
          border: '2px solid var(--border-tech)',
          boxShadow: '3px 3px 0 var(--border-tech)',
          borderRadius: 0,
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-2xl)',
          position: 'relative',
        }}>
          <div style={{ maxWidth: '680px' }}>
            <div className="section-tag">[CAMPUS SCHEDULE // SESSIONS]</div>
            <h1 style={{ marginTop: '8px', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
              Workshops, Hackathons &amp; Bootcamps
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--ink-soft)', marginTop: '8px', lineHeight: 1.6 }}>
              Explore hands-on technical sessions organized by <strong>FOSS Club RIT Kottayam</strong> in collaboration with <strong>TinkerHub</strong>. All sessions are 100% free and beginner-friendly.
            </p>
          </div>
        </div>

        {/* Full Events Catalog with Live Search */}
        <EventsGrid
          key={`all-events-${refreshKey}`}
          showSearch={true}
          showViewAll={false}
          title="All Scheduled Sessions"
          tagline="COMPLETE WORKSHOP ROSTER"
          onOpenRsvp={onOpenRsvp}
        />
      </div>
    </div>
  );
};
