import React, { useEffect } from 'react';
import { X, ExternalLink, Camera, CheckCircle2 } from 'lucide-react';
import { CreativeWork } from '../../types';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  creative: CreativeWork | null;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  creative
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !creative) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content media-viewer-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', width: '92%' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tag-badge-pill" style={{ textTransform: 'capitalize' }}>
              {creative.category}
            </span>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{creative.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: 'var(--space-md)' }}>
          {/* Media Player or Image Canvas */}
          {creative.youtube_id ? (
            <div className="media-embed-container">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${creative.youtube_id}?autoplay=1&rel=0`}
                title={creative.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="media-iframe"
              />
            </div>
          ) : (
            <div className="media-image-canvas">
              <img
                src={creative.media_url || creative.thumbnail_url}
                alt={creative.title}
                className="media-canvas-img"
              />
            </div>
          )}

          {/* Details & Author Meta */}
          <div className="media-info-bar">
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '8px' }}>
                {creative.description}
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginTop: '6px' }}>
                {creative.tools.map((t) => (
                  <span key={t} className="tag-badge" style={{ fontSize: '0.75rem' }}>
                    {t}
                  </span>
                ))}
                {creative.license && (
                  <span className="tag-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--pixel-blue)' }}>
                    {creative.license}
                  </span>
                )}
                {creative.camera_meta?.camera && (
                  <span className="tag-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Camera size={11} /> {creative.camera_meta.camera} {creative.camera_meta.lens ? `• ${creative.camera_meta.lens}` : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="media-author-actions">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={creative.avatar_url || `https://github.com/${creative.author}.png`}
                  alt={creative.author_name || creative.author}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--surface-border)' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{creative.author_name || creative.author}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {creative.department ? `${creative.department} '${creative.batch?.slice(-2)}` : 'Campus Maker'}
                    {creative.is_verified_student && (
                      <span style={{ color: 'var(--foss-mint)', marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {creative.media_url && !creative.youtube_id && (
                <a
                  href={creative.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <span>Open Full Asset</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
