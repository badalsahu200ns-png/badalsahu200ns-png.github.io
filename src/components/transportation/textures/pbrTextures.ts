import * as THREE from 'three';

/**
 * Procedural PBR Texture Generator (HTML5 Canvas)
 * Generates high-resolution, tileable procedural textures for materials:
 * - Asphalt highway road with painted white dashed lane stripes
 * - Railway steel tracks with cross-ties and gravel ballast
 * - Carbon fiber composite weave for vehicle chassis
 * - Knobby tire tread bump map
 * - Ocean water caustics and wave normal map
 * - Photovoltaic solar array grid
 */

const textureCache = new Map<string, THREE.CanvasTexture>();

export function getAsphaltRoadTexture(): THREE.CanvasTexture {
  const key = 'asphalt_road';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark asphalt base with noise grain
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 512, 1024);

  const imgData = ctx.getImageData(0, 0, 512, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 28;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // 2. Yellow solid shoulder lines (both sides)
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(24, 0, 10, 1024);
  ctx.fillRect(478, 0, 10, 1024);

  // 3. White dashed lane lines (2 center lanes)
  ctx.fillStyle = '#f8fafc';
  for (let y = 0; y < 1024; y += 128) {
    ctx.fillRect(175, y + 20, 12, 70);
    ctx.fillRect(325, y + 20, 12, 70);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 12);
  textureCache.set(key, texture);
  return texture;
}

export function getRailwayTrackTexture(): THREE.CanvasTexture {
  const key = 'railway_track';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Ballast stone gravel base
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 45;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // Wooden / concrete cross-ties (sleepers)
  ctx.fillStyle = '#334155';
  for (let y = 32; y < 512; y += 96) {
    ctx.fillRect(60, y, 392, 42);
    // Fasteners / baseplates
    ctx.fillStyle = '#64748b';
    ctx.fillRect(118, y + 6, 28, 30);
    ctx.fillRect(366, y + 6, 28, 30);
    ctx.fillStyle = '#334155';
  }

  // Steel railhead specular strips
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(126, 0, 12, 512);
  ctx.fillRect(374, 0, 12, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 16);
  textureCache.set(key, texture);
  return texture;
}

export function getCarbonFiberTexture(): THREE.CanvasTexture {
  const key = 'carbon_fiber';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 128, 128);

  // 2x2 carbon twill weave pattern
  const tileSize = 16;
  for (let x = 0; x < 128; x += tileSize) {
    for (let y = 0; y < 128; y += tileSize) {
      const isEven = (x / tileSize + y / tileSize) % 2 === 0;
      ctx.fillStyle = isEven ? '#1e293b' : '#090d16';
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.fillStyle = isEven ? '#334155' : '#141d2d';
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache.set(key, texture);
  return texture;
}

export function getTireTreadTexture(): THREE.CanvasTexture {
  const key = 'tire_tread';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, 256, 256);

  // Deep knobby aggressive chevron tread grooves
  ctx.fillStyle = '#1e293b';
  for (let y = 0; y < 256; y += 32) {
    // Left lug
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(110, y + 14);
    ctx.lineTo(100, y + 28);
    ctx.lineTo(20, y + 14);
    ctx.closePath();
    ctx.fill();

    // Right lug
    ctx.beginPath();
    ctx.moveTo(226, y);
    ctx.lineTo(146, y + 14);
    ctx.lineTo(156, y + 28);
    ctx.lineTo(236, y + 14);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 8);
  textureCache.set(key, texture);
  return texture;
}

export function getWaterCausticTexture(): THREE.CanvasTexture {
  const key = 'water_caustic';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#03203c';
  ctx.fillRect(0, 0, 512, 512);

  // Overlapping sine-wave caustics web
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.35;

  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    const startY = i * 24;
    ctx.moveTo(0, startY);
    for (let x = 0; x <= 512; x += 16) {
      const y = startY + Math.sin(x * 0.05 + i) * 12 + Math.cos(x * 0.02 + i * 2) * 8;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    const startX = i * 24;
    ctx.moveTo(startX, 0);
    for (let y = 0; y <= 512; y += 16) {
      const x = startX + Math.sin(y * 0.05 + i) * 12 + Math.cos(y * 0.02 + i * 2) * 8;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 12);
  textureCache.set(key, texture);
  return texture;
}

export function getSolarPanelTexture(): THREE.CanvasTexture {
  const key = 'solar_panel';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep photovoltaic silicon blue
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 256);

  const cellW = 30;
  const cellH = 60;
  for (let x = 4; x < 256; x += cellW + 2) {
    for (let y = 4; y < 256; y += cellH + 2) {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(x, y, cellW, cellH);
      // Subtle gradient on wafer
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
    }
  }

  // Silver electrical collector grid lines
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  for (let y = 4; y < 256; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(key, texture);
  return texture;
}

export function getSciFiHullPlatesTexture(): THREE.CanvasTexture {
  const key = 'scifi_hull_plates';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Neutral titanium alloy base
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);

  // Modular armor plates
  const plateCols = 4;
  const plateRows = 4;
  const pw = 512 / plateCols;
  const ph = 512 / plateRows;

  for (let c = 0; c < plateCols; c++) {
    for (let r = 0; r < plateRows; r++) {
      const shade = Math.floor(25 + ((c * 7 + r * 11) % 18));
      ctx.fillStyle = `rgb(${shade}, ${shade + 8}, ${shade + 18})`;
      ctx.fillRect(c * pw + 2, r * ph + 2, pw - 4, ph - 4);

      // Plate bevel edge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(c * pw + 4, r * ph + 4, pw - 8, ph - 8);

      // Corner rivets
      ctx.fillStyle = '#94a3b8';
      const corners = [
        [c * pw + 8, r * ph + 8],
        [(c + 1) * pw - 8, r * ph + 8],
        [c * pw + 8, (r + 1) * ph - 8],
        [(c + 1) * pw - 8, (r + 1) * ph - 8],
      ];
      for (const [rx, ry] of corners) {
        ctx.beginPath();
        ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Seam grooves
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += pw) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }
  for (let j = 0; j <= 512; j += ph) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(512, j);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(key, texture);
  return texture;
}

export function getBrushedMetalTexture(): THREE.CanvasTexture {
  const key = 'brushed_metal';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, 256, 256);

  // Micro fine linear brushing
  ctx.fillStyle = '#94a3b8';
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 256;
    const len = 30 + Math.random() * 100;
    const x = Math.random() * 256;
    ctx.globalAlpha = 0.08 + Math.random() * 0.12;
    ctx.fillRect(x, y, len, 1);
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(key, texture);
  return texture;
}
