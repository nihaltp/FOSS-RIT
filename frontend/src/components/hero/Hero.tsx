import React from 'react';
import { Link } from 'react-router-dom';
import { StatsRibbon } from './StatsRibbon';
import { Compass, Layers, ArrowRight, Quote } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-centered">
          {/* Header Index Stamp */}
          <div className="hero-tech-stamp">
            <span className="hero-tech-stamp-dot"></span>
            <span>FOSS CELL • RIT KOTTAYAM</span>
          </div>

          <h1 className="hero-title">
            Ship Free &amp;<br />Open Source.
          </h1>

          <p className="hero-description">
            The student Free and Open Source Software community at <strong>Rajiv Gandhi Institute of Technology (RIT), Kottayam</strong>, in active collaboration with <strong>TinkerHub</strong>. We believe knowledge, source code, and creative tools should be free, open, and accessible to everyone.
          </p>

          {/* Pull-Quote with Classic Double Border / Physical Paper Framing */}
          <blockquote className="hero-quote">
            <Quote className="quote-icon" size={18} />
            <p className="hero-quote-text">
              "Information flow is what the Internet is about. Information sharing is power. If you don't share your ideas, smart people can't do anything about them, and you'll remain anonymous and powerless."
            </p>
            <cite className="hero-quote-author">
              — <strong>Vint Cerf</strong>, <span className="hero-quote-title">'Father of the Internet'</span>
            </cite>
          </blockquote>

          {/* Tactile Inverted CTA Cluster */}
          <div className="hero-cta-group">
            <Link to="/projects" className="btn btn-primary">
              <Layers size={15} />
              Explore Projects
            </Link>
            <a href="#events" className="btn btn-secondary">
              <Compass size={15} />
              View Workshops
            </a>
            <Link to="/manifesto" className="btn btn-ghost">
              Manifesto <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Live Metrics Ribbon — Hardware Diagnostic Gauge / Punchcard Block */}
        <StatsRibbon />
      </div>
    </section>
  );
};
