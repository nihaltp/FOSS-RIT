import React, { createContext, useContext, useState, useEffect } from 'react';

export type VibeId = 'hacker' | 'systems' | 'vibe' | 'kernel';

export interface VibeData {
  id: VibeId;
  name: string;
  role: string;
  emoticon: string;
  color: string;
  hover: string;
  rgb: string;
  glow: string;
  subtle: string;
  contrast: string;
  quote: string;
  tips: string[];
}

export const VIBES: Record<VibeId, VibeData> = {
  hacker: {
    id: 'hacker',
    name: 'The Happy Hacker',
    role: 'Open Source Explorer',
    emoticon: ':)',
    color: '#519F50',
    hover: '#689D6A',
    contrast: '#1C1B19',
    rgb: '81, 159, 80',
    glow: 'rgba(81, 159, 80, 0.35)',
    subtle: 'rgba(81, 159, 80, 0.12)',
    quote: 'Every master was once a beginner who refused to stop tinkering.',
    tips: [
      'git commit --amend lets you quickly fix your last commit message or staging without a messy extra commit!',
      'git log --oneline --graph --all displays a clean ASCII visualization of your Git branches.',
      'gh repo fork <owner/repo> --clone forks and clones any open-source repo in one CLI command.',
      'Starred a great repo? Star it on GitHub and feature your fork on our Project Radar!'
    ]
  },
  systems: {
    id: 'systems',
    name: 'The Systems Master',
    role: 'Systems & Backend Architect',
    emoticon: ';)',
    color: '#2C78BF',
    hover: '#5DA5E8',
    contrast: '#FCE8C3',
    rgb: '44, 120, 191',
    glow: 'rgba(44, 120, 191, 0.35)',
    subtle: 'rgba(44, 120, 191, 0.12)',
    quote: 'Talk is cheap. Show me the code.',
    tips: [
      'grep -rnw . -e "search_term" searches recursively across code files in seconds.',
      'btop and htop give you instant terminal-based GPU/CPU and process telemetry.',
      'docker system prune -a safely reclaims gigabytes of cached unused containers and layers.',
      'curl -IL <url> inspects all HTTP redirects and response headers directly from the terminal.'
    ]
  },
  vibe: {
    id: 'vibe',
    name: 'The Vibe Coder',
    role: 'UI/UX & Creative Craftsman',
    emoticon: '^_^',
    color: '#FBB829',
    hover: '#FED06E',
    contrast: '#1C1B19',
    rgb: '251, 184, 41',
    glow: 'rgba(251, 184, 41, 0.35)',
    subtle: 'rgba(251, 184, 41, 0.12)',
    quote: 'Good software is functional. Great software is a joy to experience.',
    tips: [
      'console.table(data) renders arrays of objects into neat inspectable tables in devtools.',
      'Use CSS clamp(min, val, max) for fluid responsive typography without media queries.',
      'Shift + Click on Chrome devtools color picker toggles between HEX, RGB, and HSL formats.',
      'npm outdated lists newer dependencies with breaking-change color codes.'
    ]
  },
  kernel: {
    id: 'kernel',
    name: 'The Kernel Debugger',
    role: 'Low-Level & OS Hacker',
    emoticon: ':|',
    color: '#EF2F27',
    hover: '#F75341',
    contrast: '#FCE8C3',
    rgb: '239, 47, 39',
    glow: 'rgba(239, 47, 39, 0.35)',
    subtle: 'rgba(239, 47, 39, 0.12)',
    quote: "There is no cloud, just someone else's Linux computer.",
    tips: [
      'strace -c <command> profiles system calls to pinpoint I/O and latency bottlenecks.',
      'dmesg -T prints kernel ring buffer messages with human-readable timestamps.',
      'valgrind --leak-check=full pinpoint exact memory leaks in C and C++ programs.',
      'journalctl -xeu <service> inspects systemd unit crash logs and traceback dumps.'
    ]
  }
};

interface VibeContextType {
  activeVibe: VibeData;
  setVibe: (vibeId: VibeId) => void;
  activeTipIndex: number;
  nextTip: () => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export const VibeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vibeId, setVibeId] = useState<VibeId>(() => {
    const saved = localStorage.getItem('foss_builder_vibe') as VibeId;
    return saved && VIBES[saved] ? saved : 'hacker';
  });

  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const activeVibe = VIBES[vibeId] || VIBES.hacker;

  useEffect(() => {
    const root = document.documentElement;
    // Set builder vibe CSS variables
    root.style.setProperty('--vibe-accent', activeVibe.color);
    root.style.setProperty('--vibe-hover', activeVibe.hover);
    root.style.setProperty('--vibe-contrast', activeVibe.contrast);
    root.style.setProperty('--vibe-rgb', activeVibe.rgb);
    root.style.setProperty('--vibe-glow', activeVibe.glow);
    root.style.setProperty('--vibe-subtle', activeVibe.subtle);

    // Retro technical & editorial accents (now fully reactive to selected vibe)
    root.style.setProperty('--forest-tech', activeVibe.color);
    root.style.setProperty('--moss-tech', activeVibe.hover);
    root.style.setProperty('--border-active', activeVibe.color);

    // Propagate to acid token system
    root.style.setProperty('--acid', activeVibe.color);
    root.style.setProperty('--acid-dim', activeVibe.subtle);
    root.style.setProperty('--acid-glow', activeVibe.glow);

    // Legacy aliases
    root.style.setProperty('--foss-mint', activeVibe.color);
    root.style.setProperty('--foss-mint-hover', activeVibe.hover);
    root.style.setProperty('--foss-mint-glow', activeVibe.glow);
    root.style.setProperty('--foss-mint-subtle', activeVibe.subtle);
    root.style.setProperty('--shadow-mint', `2px 2px 0 ${activeVibe.color}`);
    root.style.setProperty('--shadow-offset-acid', `2px 2px 0 ${activeVibe.color}`);

    localStorage.setItem('foss_builder_vibe', vibeId);
  }, [activeVibe, vibeId]);

  const setVibe = (id: VibeId) => {
    if (VIBES[id]) {
      setVibeId(id);
      setActiveTipIndex(0);
    }
  };

  const nextTip = () => {
    setActiveTipIndex(prev => (prev + 1) % activeVibe.tips.length);
  };

  return (
    <VibeContext.Provider value={{ activeVibe, setVibe, activeTipIndex, nextTip }}>
      {children}
    </VibeContext.Provider>
  );
};

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
};
