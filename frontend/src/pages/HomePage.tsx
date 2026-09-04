import React from 'react';
import { Hero } from '../components/hero/Hero';
import { Pillars } from '../components/sections/Pillars';
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
      <Pillars />
      
      {/* 1. Featured Campus Workshops & Events */}
      <EventsGrid 
        key={`home-events-${refreshKey}`}
        limit={3}
        showViewAll={true}
        onOpenRsvp={onOpenRsvp}
      />

      {/* 2. Featured Open Source Software Repositories */}
      <ProjectsGrid 
        key={`home-projects-${refreshKey}`}
        limit={3}
        showViewAll={true}
        onOpenSubmitProject={onOpenSubmitProject}
      />

      {/* 3. Featured Creative Media, Design & Video Studio */}
      <CreativeShowcase
        key={`home-creatives-${refreshKey}`}
        limit={4}
        showViewAll={true}
        onOpenSubmitCreative={onOpenSubmitProject}
      />

      <MascotBanner />
      <Manifesto />
    </div>
  );
};
