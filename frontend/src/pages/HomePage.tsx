import React from 'react';
import { Hero } from '../components/hero/Hero';
import { EventsGrid } from '../components/sections/EventsGrid';
import { ProjectsGrid } from '../components/sections/ProjectsGrid';
import { CreativeShowcase } from '../components/sections/CreativeShowcase';
import { MascotBanner } from '../components/sections/MascotBanner';
import { Manifesto } from '../components/sections/Manifesto';
import { Event } from '../types';

interface HomePageProps {
  onOpenRsvp: (event: Event) => void;
  onOpenSubmitProject: () => void;
  refreshKey: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenRsvp,
  onOpenSubmitProject,
  refreshKey
}) => {
  return (
    <div>
      <Hero />
      
      {/* 1. Featured Open Source Software Repositories */}
      <ProjectsGrid 
        key={`home-projects-${refreshKey}`}
        limit={3}
        showViewAll={true}
        onOpenSubmitProject={onOpenSubmitProject}
      />

      {/* 2. Featured Creative Media, Design & Video Studio */}
      <CreativeShowcase
        key={`home-creatives-${refreshKey}`}
        limit={4}
        showViewAll={true}
        onOpenSubmitCreative={onOpenSubmitProject}
      />

      {/* 3. Featured Campus Workshops & Events (3rd last section, above Vibe Selector) */}
      <EventsGrid 
        key={`home-events-${refreshKey}`}
        limit={3}
        showViewAll={true}
        onOpenRsvp={onOpenRsvp}
      />

      {/* 4. Choose Your Builder Vibe (2nd last section) */}
      <MascotBanner />

      {/* 5. Manifesto (Last section) */}
      <Manifesto />
    </div>
  );
};
