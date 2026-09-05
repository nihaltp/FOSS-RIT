import React from 'react';
import { Link } from 'react-router-dom';
import { StatsRibbon } from './StatsRibbon';
import { Compass, Layers, ArrowRight, Quote } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-centered">
          {/* Stamp badge — square, acid-green outlined */}
          <div className="hero-pill-badge">
            <span className="hero-pill-dot"></span>
            <span>RIT Kottayam • FOSS Community</span>
          </div>

          <h1 className="hero-title">
            Ship Free &amp;<br />Open Source.
          </h1>

          {/* Editorial ruled divider */}
          <div className="hero-editorial-rule">
            <span className="hero-editorial-rule-label">About the Club</span>
          </div>

          <p className="hero-description">
            The student Free and Open Source Software community at <strong>Rajiv Gandhi Institute of Technology (RIT), Kottayam</strong>, in active collaboration with <strong>TinkerHub</strong>. We believe knowledge should be free, open, and accessible to everyone.
          </p>

          <blockquote className="hero-quote">
            <Quote className="quote-icon" size={20} />
            <p className="hero-quote-text">
              "Information flow is what the Internet is about. Information sharing is power. If you don't share your ideas, smart people can't do anything about them, and you'll remain anonymous and powerless."
            </p>
            <cite className="hero-quote-author">
              — <strong>Vint Cerf</strong>, <span className="hero-quote-title">'Father of the Internet'</span>
            </cite>
          </blockquote>

          <div className="hero-cta-group">
            <Link to="/projects" className="btn btn-primary">
              <Layers size={17} />
              Explore Projects
            </Link>
            <a href="#events" className="btn btn-secondary">
              <Compass size={17} />
              View Workshops
            </a>
            <Link to="/manifesto" className="btn btn-ghost">
              Manifesto <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <StatsRibbon />
      </div>
    </section>
  );
};
