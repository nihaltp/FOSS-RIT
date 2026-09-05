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

// ── 10 Curated Transit Line Colors (Each train gets a distinct signature) ─────
interface MetroLinePalette {
  color: string;
  rgb: string;
}

const METRO_LINES: MetroLinePalette[] = [
  { color: '#BEFF5A', rgb: '190, 255, 90' },  // Acid Lime (Hacker)
  { color: '#00E5FF', rgb: '0, 229, 255' },   // Cyan Pulse (Systems)
  { color: '#FBBF24', rgb: '251, 191, 36' },  // Solar Amber (Vibe)
  { color: '#C084FC', rgb: '192, 132, 252' }, // Neon Violet
  { color: '#FB7185', rgb: '251, 113, 133' }, // Coral Pink
  { color: '#34D399', rgb: '52, 211, 153' },  // Emerald Mint
  { color: '#38BDF8', rgb: '56, 189, 248' },  // Sky Blue
  { color: '#F472B6', rgb: '244, 114, 182' }, // Soft Fuchsia
  { color: '#FB923C', rgb: '251, 146, 60' },  // Warm Tangerine
  { color: '#A3E635', rgb: '163, 230, 53' },  // Bright Chartreuse
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
  turnRate: number;        // chance to turn at intersection (lower for express, higher for local)
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
// Divides the screen into 3x3 sectors and spawns in the sector with lowest density.
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

  // Find lowest count
  let minCount = Infinity;
  for (let i = 0; i < 9; i++) {
    if (sectorCounts[i] < minCount) minCount = sectorCounts[i];
  }

  // Collect sectors at or near the minimum
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
  let color = '#BEFF5A';
  let rgb = '190, 255, 90';

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

  // 35% of trains are "Express" (high speed, prefers long cross-screen lines)
  const isExpress = Math.random() < 0.35;
  const speed = isExpress
    ? 3.2 + Math.random() * 0.9  // 3.2 – 4.1 cells/s
    : 2.2 + Math.random() * 0.8; // 2.2 – 3.0 cells/s

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
    targetOpacity: 0.68 + Math.random() * 0.16,
    fadingOut: false,
    age: 0,
    maxLifetime: 35 + Math.random() * 30, // 35 - 65 seconds
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
    const REPEL_STRENGTH = 45;
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

    // ── Trains Setup (Expanded to 10 on desktop, 5 on mobile) ────────────────
    const MAX_TRAINS = mobile ? 5 : 10;
    let trains: MetroTrain[] = [];

    const getVibeInfo = () => {
      const rgb = getComputedStyle(document.documentElement).getPropertyValue('--vibe-rgb').trim();
      const color = getComputedStyle(document.documentElement).getPropertyValue('--vibe-accent').trim();
      return {
        rgb: rgb || activeVibe?.rgb || '190, 255, 90',
        color: color || activeVibe?.color || '#BEFF5A',
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

    // ── Advance Trains with Anti-Clustering & Repulsion ──────────────────────
    const advanceTrains = (dt: number) => {
      for (const train of trains) {
        train.age += dt;

        // Smooth fade-in on spawn
        if (!train.fadingOut && train.opacity < train.targetOpacity) {
          train.opacity = Math.min(train.opacity + dt * 1.0, train.targetOpacity);
        }

        // Start fade-out when lifetime is reached
        if (train.age >= train.maxLifetime && !train.fadingOut) {
          train.fadingOut = true;
        }

        if (train.fadingOut) {
          train.opacity = Math.max(0, train.opacity - dt * 0.7);
        }

        // Advance along track
        train.progress += dt * train.speed;

        while (train.progress >= 1) {
          train.progress -= 1;
          const reached = train.waypoints[train.waypoints.length - 1];

          // Check for nearby trains (traffic repulsion to prevent clustering)
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

            // If another train is within 6 cells, feel repulsion away from it
            if (distSq < 36 && distSq > 0) {
              const weight = 1 / Math.sqrt(distSq);
              awayX += dc * weight;
              awayY += dr * weight;
              clusterCount++;
            }
          }

          // Options from current heading
          const currDir = train.dir;
          const straight = { dx: currDir.dx, dy: currDir.dy };
          const turnLeft = { dx: -currDir.dy, dy: currDir.dx };
          const turnRight = { dx: currDir.dy, dy: -currDir.dx };

          // Keep within playable grid bounds with 2-cell buffer
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

          // If close to other trains, steer in the direction that maximizes distance
          if (clusterCount > 0 && availableTurns.length > 0) {
            const candidates = straightOk ? [straight, ...availableTurns] : availableTurns;
            let bestScore = -Infinity;
            let bestCandidate = candidates[0];

            for (const cand of candidates) {
              // Dot product with repulsion vector
              const score = cand.dx * awayX + cand.dy * awayY + (cand === straight ? 0.3 : 0);
              if (score > bestScore) {
                bestScore = score;
                bestCandidate = cand;
              }
            }
            chosenDir = bestCandidate;
          } else {
            // Normal transit routing
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

          // Trim waypoint history
          if (train.waypoints.length > 12) {
            train.waypoints.shift();
          }
        }
      }
    };

    // ── Continuous Polyline Distance Sampler ─────────────────────────────────
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

    // ── Draw Sleek Mini-Metro Train ──────────────────────────────────────────
    const drawTrain = (train: MetroTrain) => {
      if (train.opacity <= 0.01) return;

      const baseAlpha = train.opacity;

      // ── 1. Tapered Fading Luminescent Trail (Comet Tail) ──
      const trailPoints: { x: number; y: number }[] = [];
      const trailSamples = 7;
      for (let s = 0; s <= trailSamples; s++) {
        const d = 1.35 + (s / trailSamples) * 1.5;
        const sample = getPosAtDistance(train, d);
        trailPoints.push(sample.point);
      }

      if (trailPoints.length > 1) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < trailPoints.length - 1; i++) {
          const tProgress = i / (trailPoints.length - 1);
          const segAlpha = baseAlpha * (0.22 * (1 - tProgress));
          if (segAlpha <= 0.005) continue;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${train.rgb}, ${segAlpha})`;
          ctx.lineWidth = 2.2 * (1 - tProgress * 0.5);
          ctx.moveTo(trailPoints[i].x, trailPoints[i].y);
          ctx.lineTo(trailPoints[i + 1].x, trailPoints[i + 1].y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── 2. Render Sleek Train Carriages (Mini Metro style capsules) ──
      const CAR_SPECS = [
        { start: 0.04, end: 0.44, width: 4.8, alphaMul: 0.85, glow: 9 }, // Lead Engine
        { start: 0.52, end: 0.88, width: 4.0, alphaMul: 0.58, glow: 6 }, // Mid Coach
        { start: 0.96, end: 1.28, width: 3.4, alphaMul: 0.38, glow: 3 }, // Rear Coach
      ];

      for (const car of CAR_SPECS) {
        const front = getPosAtDistance(train, car.start);
        const back = getPosAtDistance(train, car.end);

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = train.color;
        ctx.lineWidth = car.width;
        ctx.globalAlpha = baseAlpha * car.alphaMul;
        ctx.shadowColor = `rgba(${train.rgb}, 0.85)`;
        ctx.shadowBlur = car.glow;

        ctx.beginPath();
        ctx.moveTo(front.point.x, front.point.y);

        // Flex smoothly around 90° intersection turns
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

      // ── 3. Lead Bright Headlight Pulse ──
      const headPos = getPosAtDistance(train, 0.02);
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = `rgba(${train.rgb}, 1)`;
      ctx.shadowBlur = 10;
      ctx.globalAlpha = baseAlpha * 0.95;
      ctx.beginPath();
      ctx.arc(headPos.point.x, headPos.point.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
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

            const ambientWave = Math.sin(time + c * 0.2 + r * 0.2) * 0.12;
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

      // ── 2. Interactive Cursor Spotlight ─────────────────────────────────────
      if (!mobile && mouseX > -1000) {
        const spotRadius = MOUSE_RADIUS * 1.6;
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, spotRadius);
        grad.addColorStop(0, `rgba(${vi.rgb}, 0.16)`);
        grad.addColorStop(0.45, `rgba(${vi.rgb}, 0.06)`);
        grad.addColorStop(1, `rgba(${vi.rgb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, spotRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 32, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${vi.rgb}, 0.22)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── 3. Subtle Technical Grid Lines ──────────────────────────────────────
      ctx.lineWidth = 1.5;

      // Horizontal lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = points[r][c];
          const p2 = points[r][c + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const mouseDist = Math.hypot(midX - mouseX, midY - mouseY);

          let alpha = 0.06;
          if (!mobile && mouseDist < MOUSE_RADIUS * 1.5) {
            alpha += (1 - mouseDist / (MOUSE_RADIUS * 1.5)) * 0.45;
          }
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Vertical lines
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
          const p1 = points[r][c];
          const p2 = points[r + 1][c];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const mouseDist = Math.hypot(midX - mouseX, midY - mouseY);

          let alpha = 0.06;
          if (!mobile && mouseDist < MOUSE_RADIUS * 1.5) {
            alpha += (1 - mouseDist / (MOUSE_RADIUS * 1.5)) * 0.45;
          }
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Junction dots near cursor
      if (!mobile) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
            if (mouseDist < MOUSE_RADIUS) {
              const pAlpha = (1 - mouseDist / MOUSE_RADIUS) * 0.75;
              ctx.fillStyle = `rgba(${vi.rgb}, ${pAlpha})`;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // ── 4. Advance & Render Sleek Metro Trains ───────────────────────────────
      advanceTrains(dt);

      for (const train of trains) {
        drawTrain(train);
      }

      // Clean up dead trains and spawn into sparse sectors
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
