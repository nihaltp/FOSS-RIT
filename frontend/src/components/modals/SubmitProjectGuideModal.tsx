import React, { useState } from 'react';
import { X, GitFork, FileCode, GitPullRequest, Copy, Check, ExternalLink, Sparkles, Code, Palette, Send, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SubmitProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitProjectGuideModal: React.FC<SubmitProjectGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'creative'>('code');
  const [showCreativeManual, setShowCreativeManual] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const codeTemplateSnippet = `---
name: "My Awesome Project"
description: "A concise 1-2 sentence description explaining what your project does."
repo_url: "https://github.com/your-username/your-repo-name"
tech_stack: ["Python", "React", "FastAPI"]
author: "your-github-username"
author_name: "Your Full Name"
is_verified_student: true
batch: "2026"
featured: true
---`;

  const creativeTemplateSnippet = `---
title: "Campus Hub Design System / Aftermovie / Photo Walk"
category: "design" # Options: design | photography | video | 3d
author: "your-github-or-handle"
author_name: "Your Full Name"
batch: "2026"
department: "CSE" # e.g. CSE, ECE, ME, CE, EEE, B.Arch
tools: ["Penpot", "Figma", "Blender", "DaVinci Resolve"]
media_url: "https://design.penpot.app/... OR https://youtu.be/... OR Unsplash Link"
thumbnail_url: "https://images.unsplash.com/... OR Direct Image Link"
aspect_ratio: "16:9" # Options: 16:9 | 3:2 | 1:1
license: "CC-BY-4.0" # Creative Commons: CC-BY-4.0, CC-BY-SA-4.0, CC0-1.0
is_verified_student: true
featured: true
---

A brief 1-2 paragraph description explaining your design, video aftermovie, or photography series.`;

  const currentSnippet = activeTab === 'code' ? codeTemplateSnippet : creativeTemplateSnippet;
  const targetFolder = activeTab === 'code' ? 'content/projects/' : 'content/creatives/';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    showToast('Markdown template copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', width: '100%' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-raised)',
            border: '1px solid var(--surface-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--foss-mint)',
            flexShrink: 0
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>Feature Your Work</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Open Source GitOps Submissions
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)' }}>
          <button
            className={`filter-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Code size={13} />
            <span>Code Repository</span>
          </button>
          <button
            className={`filter-btn ${activeTab === 'creative' ? 'active' : ''}`}
            onClick={() => setActiveTab('creative')}
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Palette size={13} />
            <span>Creative Showcase</span>
          </button>
        </div>

        {/* Creative Showcase Panel */}
        {activeTab === 'creative' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-lg)' }}>
            {/* Primary Action Card: Form Submission */}
            <div style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Submit via Web Form
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Structured form with student verification, media previews, and CC licensing. Reviewed and published by maintainers.
                  </div>
                </div>
              </div>

              <a
                href="https://github.com/vertigotalks7/FOSS-RIT/issues/new?template=creative-submission.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: '100%',
                  padding: '10px 16px'
                }}
              >
                <Send size={14} />
                <span>Open Submission Form on GitHub</span>
                <ExternalLink size={13} />
              </a>

              {/* GitHub Account Note for Creatives */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.22)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                <Info size={14} color="var(--pixel-blue)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Quick note:</strong> Requires a free GitHub account (takes &lt; 2 mins to sign up). No coding, Git, or terminal setup required!
                </span>
              </div>
            </div>

            {/* Manual PR Toggle Section */}
            <div style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Or submit via Pull Request (Markdown)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowCreativeManual(!showCreativeManual)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                  >
                    {showCreativeManual ? 'Hide Template' : 'View Template'}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', padding: '4px 8px' }}
                  >
                    {copied ? <Check size={12} color="var(--foss-mint)" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {showCreativeManual && (
                <pre style={{
                  background: 'var(--surface-base)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  margin: '10px 0 0 0',
                  overflowX: 'auto',
                  border: '1px solid var(--surface-border)',
                  maxWidth: '100%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}>
                  {creativeTemplateSnippet}
                </pre>
              )}
            </div>
          </div>
        ) : (
          /* Code Repository Panel: 3 Step Flow */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-lg)' }}>
            {/* Step 1 */}
            <div style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 200px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--foss-mint-subtle)', color: 'var(--foss-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GitFork size={14} color="var(--pixel-blue)" /> Fork this Repository
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Create your personal fork on GitHub.
                  </div>
                </div>
              </div>
              <a
                href="https://github.com/vertigotalks7/FOSS-RIT/fork"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
              >
                <span>Fork Repo</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Step 2 */}
            <div style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--foss-mint-subtle)', color: 'var(--foss-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileCode size={14} color="var(--byte-yellow)" /> Create Markdown File
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Add <code>{targetFolder}your-slug.md</code>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
                >
                  {copied ? <Check size={12} color="var(--foss-mint)" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy Template'}</span>
                </button>
              </div>

              <pre style={{
                background: 'var(--surface-base)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                margin: 0,
                overflowX: 'auto',
                border: '1px solid var(--surface-border)',
                maxWidth: '100%',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {codeTemplateSnippet}
              </pre>
            </div>

            {/* Step 3 */}
            <div style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 200px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--foss-mint-subtle)', color: 'var(--foss-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GitPullRequest size={14} color="var(--foss-mint)" /> Open Pull Request
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Submit to <code>main</code> for automated verification & merge.
                  </div>
                </div>
              </div>
              <a
                href="https://github.com/vertigotalks7/FOSS-RIT/compare"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
              >
                <span>Submit PR</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: 'var(--space-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Read our <a href="https://github.com/vertigotalks7/FOSS-RIT/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foss-mint)' }}>Contributor Guide</a>
          </span>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
