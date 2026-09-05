import React, { useMemo } from 'react';

interface RetroBarcodeProps {
  value?: string;
  orientation?: 'horizontal' | 'vertical' | 'responsive';
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
  opacity?: number;
}

export const RetroBarcode: React.FC<RetroBarcodeProps> = ({
  value = '*RIT-2160*',
  orientation = 'responsive',
  width,
  height,
  showText = true,
  className = '',
  opacity = 0.55
}) => {
  // Deterministic generator for barcode sequences
  const { vertBars, vertTotal, horizBars, horizTotal } = useMemo(() => {
    let hash = 0;
    const seed = value.toUpperCase();
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }

    // Horizontal bars stacked vertically (Desktop)
    const vList: { pos: number; size: number; isGuard: boolean }[] = [];
    let curV = 1;
    vList.push({ pos: curV, size: 1.5, isGuard: true });
    curV += 2.5;
    vList.push({ pos: curV, size: 1, isGuard: true });
    curV += 2.5;

    let pV = Math.abs(hash) || 12345;
    const countV = 18;
    const midV = Math.floor(countV / 2);

    for (let i = 0; i < countV; i++) {
      if (i === midV) {
        vList.push({ pos: curV, size: 1, isGuard: true });
        curV += 2;
        vList.push({ pos: curV, size: 1, isGuard: true });
        curV += 2;
      }
      pV = (pV * 16807) % 2147483647;
      const bSize = (pV % 3) + 1;
      vList.push({ pos: curV, size: bSize, isGuard: false });
      pV = (pV * 16807) % 2147483647;
      const sSize = (pV % 2) + 1;
      curV += bSize + sSize;
    }
    curV += 1;
    vList.push({ pos: curV, size: 1, isGuard: true });
    curV += 2;
    vList.push({ pos: curV, size: 1.5, isGuard: true });
    curV += 2;

    // Vertical bars placed horizontally (Mobile / Horizontal mode)
    const hList: { pos: number; size: number; isGuard: boolean }[] = [];
    let curH = 1;
    hList.push({ pos: curH, size: 1.5, isGuard: true });
    curH += 2.5;
    hList.push({ pos: curH, size: 1, isGuard: true });
    curH += 2.5;

    let pH = Math.abs(hash) || 12345;
    const countH = 22;
    const midH = Math.floor(countH / 2);

    for (let i = 0; i < countH; i++) {
      if (i === midH) {
        hList.push({ pos: curH, size: 1, isGuard: true });
        curH += 2;
        hList.push({ pos: curH, size: 1, isGuard: true });
        curH += 2;
      }
      pH = (pH * 16807) % 2147483647;
      const bSize = (pH % 3) + 1;
      hList.push({ pos: curH, size: bSize, isGuard: false });
      pH = (pH * 16807) % 2147483647;
      const sSize = (pH % 2) + 1;
      curH += bSize + sSize;
    }
    curH += 1;
    hList.push({ pos: curH, size: 1, isGuard: true });
    curH += 2;
    hList.push({ pos: curH, size: 1.5, isGuard: true });
    curH += 2;

    return { vertBars: vList, vertTotal: curV, horizBars: hList, horizTotal: curH };
  }, [value]);

  const desktopSvgWidth = width ?? 16;
  const desktopSvgHeight = height ?? 62;

  const mobileSvgWidth = 86;
  const mobileSvgHeight = 16;

  const renderVerticalDesktop = () => (
    <div className="barcode-desktop" aria-hidden="true">
      <svg
        width={desktopSvgWidth}
        height={desktopSvgHeight}
        viewBox={`0 0 ${desktopSvgWidth} ${vertTotal}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {vertBars.map((bar, idx) => {
          const barW = bar.isGuard ? desktopSvgWidth : desktopSvgWidth - 3;
          const barX = bar.isGuard ? 0 : 1.5;
          return (
            <rect
              key={idx}
              x={barX}
              y={bar.pos}
              width={barW}
              height={bar.size}
              fill="var(--text-secondary, #DFCBB1)"
            />
          );
        })}
      </svg>
      {showText && (
        <span className="barcode-text-vertical">
          {value}
        </span>
      )}
    </div>
  );

  const renderHorizontalMobile = () => (
    <div className="barcode-mobile" aria-hidden="true">
      <svg
        width={mobileSvgWidth}
        height={mobileSvgHeight}
        viewBox={`0 0 ${horizTotal} ${mobileSvgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {horizBars.map((bar, idx) => {
          const barH = bar.isGuard ? mobileSvgHeight : mobileSvgHeight - 3;
          return (
            <rect
              key={idx}
              x={bar.pos}
              y={0}
              width={bar.size}
              height={barH}
              fill="var(--text-secondary, #DFCBB1)"
            />
          );
        })}
      </svg>
      {showText && (
        <span className="barcode-text-horizontal">
          {value}
        </span>
      )}
    </div>
  );

  if (orientation === 'horizontal') {
    return (
      <div className={`retro-barcode ${className}`} style={{ opacity }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {renderHorizontalMobile()}
        </div>
      </div>
    );
  }

  // Dual-mode Responsive (Desktop: Vertical with text on right / Mobile: Horizontal at top of card)
  return (
    <div className={`retro-barcode retro-barcode-responsive ${className}`} style={{ opacity }}>
      {renderVerticalDesktop()}
      {renderHorizontalMobile()}
    </div>
  );
};
