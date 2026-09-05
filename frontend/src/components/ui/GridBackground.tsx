import React, { useEffect, useRef } from 'react';
import { useVibe } from '../../context/VibeContext';

interface GridPoint {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

// ── 10 Curated Srcery / Gruvbox Terminal Colors ──────────────────────────────
interface MetroLinePalette {
  color: string;
  rgb: string;
}

const METRO_LINES: MetroLinePalette[] = [
  { color: '#519F50', rgb: '81, 159, 80' },    // Srcery Green (Hacker)
  { color: '#FBB829', rgb: '251, 184, 41' },  // Srcery Amber (Vibe)
  { color: '#F75341', rgb: '247, 83, 65' },   // Srcery Bright Red (Kernel)
  { color: '#2C78BF', rgb: '44, 120, 191' },  // Srcery Blue (Systems)
  { color: '#0AAEB3', rgb: '10, 174, 179' },  // Srcery Cyan
  { color: '#E02C6D', rgb: '224, 44, 109' },  // Srcery Magenta
  { color: '#98971A', rgb: '152, 151, 26' },  // Bright Green
  { color: '#FED06E', rgb: '254, 208, 110' }, // Gold
  { color: '#5DA5E8', rgb: '93, 165, 232' },  // Sky Blue
  { color: '#2BE4D0', rgb: '43, 228, 208' },  // Aqua
];

interface Waypoint {
  c: number;
  r: number;
}

interface MetroTrain {
  id: number;
  color: string;
  rgb: string;
  speed: number;           // grid cells per second
  progress: number;        // continuous 0..1 moving from waypoints[len-2] to waypoints[len-1]
  waypoints: Waypoint[];   // ordered history: oldest at [0], next target at [last]
  dir: { dx: number; dy: number };
  opacity: number;
  targetOpacity: number;
  fadingOut: boolean;
  age: number;
  maxLifetime: number;
  turnRate: number;
  isExpress: boolean;
}

const DIRS = [
  { dx: 1, dy: 0 },  // right
  { dx: -1, dy: 0 }, // left
  { dx: 0, dy: 1 },  // down
  { dx: 0, dy: -1 }, // up
];

let nextTrainId = 1;

// ── Sector-Based Anti-Clumping Spawner ─────────────────────────────────────────
function getSparseSpawnPoint(cols: number, rows: number, existingTrains: MetroTrain[]) {
  const sectorCounts = new Array(9).fill(0);

  for (const t of existingTrains) {
    const headW = t.waypoints[t.waypoints.length - 1] || t.waypoints[0];
    if (headW) {
      const sc = Math.max(0, Math.min(2, Math.floor((headW.c / Math.max(1, cols)) * 3)));
      const sr = Math.max(0, Math.min(2, Math.floor((headW.r / Math.max(1, rows)) * 3)));
      sectorCounts[sr * 3 + sc]++;
    }
  }

  let minCount = Infinity;
  for (let i = 0; i < 9; i++) {
    if (sectorCounts[i] < minCount) minCount = sectorCounts[i];
  }

  const candidateSectors: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (sectorCounts[i] <= minCount + 1) {
      candidateSectors.push(i);
    }
  }

  const chosen = candidateSectors[Math.floor(Math.random() * candidateSectors.length)];
  const sc = chosen % 3;
  const sr = Math.floor(chosen / 3);

  const colMin = Math.floor((sc / 3) * cols) + 2;
  const colMax = Math.floor(((sc + 1) / 3) * cols) - 2;
  const rowMin = Math.floor((sr / 3) * rows) + 2;
  const rowMax = Math.floor(((sr + 1) / 3) * rows) - 2;

  const c0 = Math.max(2, Math.min(cols - 3, colMin + Math.floor(Math.random() * Math.max(1, colMax - colMin))));
  const r0 = Math.max(2, Math.min(rows - 3, rowMin + Math.floor(Math.random() * Math.max(1, rowMax - rowMin))));

  return { c0, r0 };
}

function createTrain(
  cols: number,
  rows: number,
  existingTrains: MetroTrain[],
  usedColors: Set<string>,
  vibeColor?: string,
  vibeRgb?: string
): MetroTrain {
  let color = '#519F50';
  let rgb = '81, 159, 80';

  if (vibeColor && vibeRgb && !usedColors.has(vibeColor) && Math.random() < 0.4) {
    color = vibeColor;
    rgb = vibeRgb;
  } else {
    const avail = METRO_LINES.filter(l => !usedColors.has(l.color));
    const chosen = avail.length > 0
      ? avail[Math.floor(Math.random() * avail.length)]
      : METRO_LINES[Math.floor(Math.random() * METRO_LINES.length)];
    color = chosen.color;
    rgb = chosen.rgb;
  }

  const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
  const { c0, r0 } = getSparseSpawnPoint(cols, rows, existingTrains);

  const isExpress = Math.random() < 0.35;
  const speed = isExpress
    ? 3.0 + Math.random() * 0.8
    : 2.1 + Math.random() * 0.7;

  const turnRate = isExpress ? 0.12 : 0.24;

  const waypoints: Waypoint[] = [
    { c: c0 - dir.dx * 2, r: r0 - dir.dy * 2 },
    { c: c0 - dir.dx, r: r0 - dir.dy },
    { c: c0, r: r0 },
    { c: c0 + dir.dx, r: r0 + dir.dy },
  ];

  return {
    id: nextTrainId++,
    color,
    rgb,
    speed,
    progress: Math.random() * 0.5,
    waypoints,
    dir,
    opacity: 0,
    targetOpacity: 0.72 + Math.random() * 0.18,
    fadingOut: false,
    age: 0,
    maxLifetime: 35 + Math.random() * 30,
    turnRate,
    isExpress,
  };
}

// ── Main Component ───────────────────────────────────────────────────────────
export const GridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { activeVibe } = useVibe();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const SPACING = 42;
    const MOUSE_RADIUS = 160;
    const REPEL_STRENGTH = 40;
    const SPRING_TENSION = 0.05;
    const DAMPING = 0.86;

    const isMobile = () =>
      window.innerWidth <= 768 ||
      ('ontouchstart' in window && window.innerWidth <= 1024);

    const mobile = isMobile();

    // ── Grid setup ───────────────────────────────────────────────────────────
    let logW = window.innerWidth;
    let logH = window.innerHeight;
    let cols = 0, rows = 0;
    let points: GridPoint[][] = [];

    const initGrid = () => {
      const dpr = window.devicePixelRatio || 1;
      logW = window.innerWidth;
      logH = window.innerHeight;
      canvas.width = logW * dpr;
      canvas.height = logH * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      cols = Math.ceil(logW / SPACING) + 3;
      rows = Math.ceil(logH / SPACING) + 3;

      points = [];
      for (let r = 0; r < rows; r++) {
        const row: GridPoint[] = [];
        for (let c = 0; c < cols; c++) {
          const originX = (c - 1) * SPACING;
          const originY = (r - 1) * SPACING;
          row.push({ x: originX, y: originY, originX, originY, vx: 0, vy: 0 });
        }
        points.push(row);
      }
    };

    initGrid();

    // ── Bilinear Elastic Screen Position ─────────────────────────────────────
    const getScreenPos = (c: number, r: number) => {
      const c0 = Math.max(0, Math.min(cols - 2, Math.floor(c)));
      const r0 = Math.max(0, Math.min(rows - 2, Math.floor(r)));
      const c1 = c0 + 1;
      const r1 = r0 + 1;
      const u = Math.max(0, Math.min(1, c - c0));
      const v = Math.max(0, Math.min(1, r - r0));

      const p00 = points[r0]?.[c0];
      const p10 = points[r0]?.[c1];
      const p01 = points[r1]?.[c0];
      const p11 = points[r1]?.[c1];

      if (!p00 || !p10 || !p01 || !p11) {
        return { x: (c - 1) * SPACING, y: (r - 1) * SPACING };
      }

      const topX = p00.x + (p10.x - p00.x) * u;
      const topY = p00.y + (p10.y - p00.y) * u;
      const botX = p01.x + (p10.x - p01.x) * u;
      const botY = p01.y + (p10.y - p01.y) * u;

      return {
        x: topX + (botX - topX) * v,
        y: topY + (botY - topY) * v,
      };
    };

    // ── Trains Setup ─────────────────────────────────────────────────────────
    const MAX_TRAINS = mobile ? 5 : 10;
    let trains: MetroTrain[] = [];

    const getVibeInfo = () => {
      const rgb = getComputedStyle(document.documentElement).getPropertyValue('--vibe-rgb').trim();
      const color = getComputedStyle(document.documentElement).getPropertyValue('--vibe-accent').trim();
      return {
        rgb: rgb || activeVibe?.rgb || '81, 159, 80',
        color: color || activeVibe?.color || '#519F50',
      };
    };

    const usedColors = () => new Set(trains.map(t => t.color));

    for (let i = 0; i < MAX_TRAINS; i++) {
      const vi = getVibeInfo();
      trains.push(createTrain(cols, rows, trains, usedColors(), vi.color, vi.rgb));
    }

    // ── Mouse / Touch Tracking ───────────────────────────────────────────────
    let mouseX = -9999, mouseY = -9999;
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }
    };
    const onTouchEnd = () => { mouseX = -9999; mouseY = -9999; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', initGrid);

    // ── Advance Trains with Traffic Repulsion ────────────────────────────────
    const advanceTrains = (dt: number) => {
      for (const train of trains) {
        train.age += dt;

        if (!train.fadingOut && train.opacity < train.targetOpacity) {
          train.opacity = Math.min(train.opacity + dt * 1.0, train.targetOpacity);
        }

        if (train.age >= train.maxLifetime && !train.fadingOut) {
          train.fadingOut = true;
        }

        if (train.fadingOut) {
          train.opacity = Math.max(0, train.opacity - dt * 0.7);
        }

        train.progress += dt * train.speed;

        while (train.progress >= 1) {
          train.progress -= 1;
          const reached = train.waypoints[train.waypoints.length - 1];

          let awayX = 0;
          let awayY = 0;
          let clusterCount = 0;

          for (const other of trains) {
            if (other.id === train.id) continue;
            const otherHead = other.waypoints[other.waypoints.length - 1];
            if (!otherHead) continue;

            const dc = reached.c - otherHead.c;
            const dr = reached.r - otherHead.r;
            const distSq = dc * dc + dr * dr;

            if (distSq < 36 && distSq > 0) {
              const weight = 1 / Math.sqrt(distSq);
              awayX += dc * weight;
              awayY += dr * weight;
              clusterCount++;
            }
          }

          const currDir = train.dir;
          const straight = { dx: currDir.dx, dy: currDir.dy };
          const turnLeft = { dx: -currDir.dy, dy: currDir.dx };
          const turnRight = { dx: currDir.dy, dy: -currDir.dx };

          const margin = 2;
          const isValid = (c: number, r: number) =>
            c >= margin && c <= cols - margin && r >= margin && r <= rows - margin;

          const straightOk = isValid(reached.c + straight.dx, reached.r + straight.dy);
          const leftOk = isValid(reached.c + turnLeft.dx, reached.r + turnLeft.dy);
          const rightOk = isValid(reached.c + turnRight.dx, reached.r + turnRight.dy);

          const availableTurns: { dx: number; dy: number }[] = [];
          if (leftOk) availableTurns.push(turnLeft);
          if (rightOk) availableTurns.push(turnRight);

          let chosenDir = straight;

          if (clusterCount > 0 && availableTurns.length > 0) {
            const candidates = straightOk ? [straight, ...availableTurns] : availableTurns;
            let bestScore = -Infinity;
            let bestCandidate = candidates[0];

            for (const cand of candidates) {
              const score = cand.dx * awayX + cand.dy * awayY + (cand === straight ? 0.3 : 0);
              if (score > bestScore) {
                bestScore = score;
                bestCandidate = cand;
              }
            }
            chosenDir = bestCandidate;
          } else {
            if (!straightOk || (availableTurns.length > 0 && Math.random() < train.turnRate)) {
              if (availableTurns.length > 0) {
                chosenDir = availableTurns[Math.floor(Math.random() * availableTurns.length)];
              } else if (straightOk) {
                chosenDir = straight;
              } else {
                chosenDir = { dx: -currDir.dx, dy: -currDir.dy };
              }
            }
          }

          train.dir = chosenDir;
          train.waypoints.push({
            c: reached.c + chosenDir.dx,
            r: reached.r + chosenDir.dy,
          });

          if (train.waypoints.length > 12) {
            train.waypoints.shift();
          }
        }
      }
    };

    // ── Distance Sampler Along Waypoint Polyline ─────────────────────────────
    const getPosAtDistance = (train: MetroTrain, distBehindHead: number) => {
      const headIdx = train.waypoints.length - 2;
      const totalParam = headIdx + train.progress - distBehindHead;

      if (totalParam <= 0) {
        const w0 = train.waypoints[0];
        return { point: getScreenPos(w0.c, w0.r), corner: null };
      }

      const segIdx = Math.max(0, Math.min(train.waypoints.length - 2, Math.floor(totalParam)));
      const frac = Math.max(0, Math.min(1, totalParam - segIdx));

      const wA = train.waypoints[segIdx];
      const wB = train.waypoints[segIdx + 1];

      const c = wA.c + (wB.c - wA.c) * frac;
      const r = wA.r + (wB.r - wA.r) * frac;

      return {
        point: getScreenPos(c, r),
        segIdx,
        c,
        r,
      };
    };

    // ── Draw Srcery Terminal Data Signal ─────────────────────────────────────
    const drawTrain = (train: MetroTrain) => {
      if (train.opacity <= 0.01) return;

      const baseAlpha = train.opacity;

      // 1. Tapered Glowing Trace Behind Train
      const trailPoints: { x: number; y: number }[] = [];
      const trailSamples = 7;
      for (let s = 0; s <= trailSamples; s++) {
        const d = 1.25 + (s / trailSamples) * 1.5;
        const sample = getPosAtDistance(train, d);
        trailPoints.push(sample.point);
      }

      if (trailPoints.length > 1) {
        ctx.save();
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        for (let i = 0; i < trailPoints.length - 1; i++) {
          const tProgress = i / (trailPoints.length - 1);
          const segAlpha = baseAlpha * (0.28 * (1 - tProgress));
          if (segAlpha <= 0.005) continue;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${train.rgb}, ${segAlpha})`;
          ctx.lineWidth = 1.8 * (1 - tProgress * 0.4);
          ctx.moveTo(trailPoints[i].x, trailPoints[i].y);
          ctx.lineTo(trailPoints[i + 1].x, trailPoints[i + 1].y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Render Rectangular Terminal Signal Carriages
      const CAR_SPECS = [
        { start: 0.04, end: 0.42, width: 4.5, alphaMul: 0.95, glow: 8 }, // Lead Pen / Head
        { start: 0.50, end: 0.84, width: 3.8, alphaMul: 0.70, glow: 5 }, // Mid Segment
        { start: 0.92, end: 1.22, width: 3.0, alphaMul: 0.50, glow: 3 }, // Rear Segment
      ];

      for (const car of CAR_SPECS) {
        const front = getPosAtDistance(train, car.start);
        const back = getPosAtDistance(train, car.end);

        ctx.save();
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = train.color;
        ctx.lineWidth = car.width;
        ctx.globalAlpha = baseAlpha * car.alphaMul;
        ctx.shadowColor = `rgba(${train.rgb}, 0.6)`;
        ctx.shadowBlur = car.glow;

        ctx.beginPath();
        ctx.moveTo(front.point.x, front.point.y);

        if (front.segIdx !== undefined && back.segIdx !== undefined && front.segIdx !== back.segIdx) {
          const cornerW = train.waypoints[Math.max(front.segIdx, back.segIdx)];
          if (cornerW) {
            const cornerPos = getScreenPos(cornerW.c, cornerW.r);
            ctx.lineTo(cornerPos.x, cornerPos.y);
          }
        }

        ctx.lineTo(back.point.x, back.point.y);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Lead Terminal Pixel Dot / Headlight
      const headPos = getPosAtDistance(train, 0.02);
      ctx.save();
      ctx.fillStyle = '#FCE8C3';
      ctx.shadowColor = `rgba(${train.rgb}, 0.8)`;
      ctx.shadowBlur = 6;
      ctx.globalAlpha = baseAlpha * 0.95;
      ctx.fillRect(headPos.point.x - 2, headPos.point.y - 2, 4, 4);
      ctx.restore();
    };

    // ── Main Render Loop ─────────────────────────────────────────────────────
    let lastTime = performance.now();
    let time = 0;

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      time += 0.02;

      ctx.clearRect(0, 0, logW, logH);

      const vi = getVibeInfo();

      // ── 1. Spring Physics for Grid ──────────────────────────────────────────
      if (!mobile) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS && dist > 0) {
              const force = (1 - dist / MOUSE_RADIUS) * REPEL_STRENGTH;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * force * 0.25;
              p.vy += Math.sin(angle) * force * 0.25;
            }

            const ambientWave = Math.sin(time + c * 0.2 + r * 0.2) * 0.10;
            p.vy += ambientWave;

            p.vx = (p.vx + (p.originX - p.x) * SPRING_TENSION) * DAMPING;
            p.vy = (p.vy + (p.originY - p.y) * SPRING_TENSION) * DAMPING;
            p.x += p.vx;
            p.y += p.vy;
          }
        }
      } else {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            p.x = p.originX;
            p.y = p.originY;
          }
        }
      }

      // ── 2. Warm Terminal Cursor Spotlight ───────────────────────────────────
      if (!mobile && mouseX > -1000) {
        const spotRadius = MOUSE_RADIUS * 1.5;
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, spotRadius);
        grad.addColorStop(0, `rgba(${vi.rgb}, 0.14)`);
        grad.addColorStop(0.5, `rgba(${vi.rgb}, 0.04)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, spotRadius, 0, Math.PI * 2);
        ctx.fill();

        // Technical crosshair around cursor
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 28, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${vi.rgb}, 0.3)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── 3. Subtle Warm Cream Terminal Grid Lines ───────────────────────────
      ctx.lineWidth = 1.0;

      // Horizontal lines
      for (let r = 0; r < rows; r++) {
        const isMajor = r % 5 === 0;
        for (let c = 0; c < cols - 1; c++) {
          const p1 = points[r][c];
          const p2 = points[r][c + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const mouseDist = Math.hypot(midX - mouseX, midY - mouseY);

          let alpha = isMajor ? 0.08 : 0.04;
          if (!mobile && mouseDist < MOUSE_RADIUS * 1.4) {
            alpha += (1 - mouseDist / (MOUSE_RADIUS * 1.4)) * 0.26;
          }
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 241, 214, ${alpha})`;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Vertical lines
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
          const isMajor = c % 5 === 0;
          const p1 = points[r][c];
          const p2 = points[r + 1][c];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const mouseDist = Math.hypot(midX - mouseX, midY - mouseY);

          let alpha = isMajor ? 0.08 : 0.04;
          if (!mobile && mouseDist < MOUSE_RADIUS * 1.4) {
            alpha += (1 - mouseDist / (MOUSE_RADIUS * 1.4)) * 0.26;
          }
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 241, 214, ${alpha})`;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Registration grid dots near cursor
      if (!mobile) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
            if (mouseDist < MOUSE_RADIUS * 0.9) {
              const pAlpha = (1 - mouseDist / (MOUSE_RADIUS * 0.9)) * 0.40;
              ctx.fillStyle = `rgba(255, 241, 214, ${pAlpha})`;
              ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
            }
          }
        }
      }

      // ── 4. Advance & Render Terminal Data Signals ────────────────────────────
      advanceTrains(dt);

      for (const train of trains) {
        drawTrain(train);
      }

      trains = trains.filter(t => !t.fadingOut || t.opacity > 0.01);
      while (trains.length < MAX_TRAINS) {
        trains.push(createTrain(cols, rows, trains, usedColors(), vi.color, vi.rgb));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', initGrid);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeVibe]);

  return (
    <div className="interactive-grid-bg" aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};
