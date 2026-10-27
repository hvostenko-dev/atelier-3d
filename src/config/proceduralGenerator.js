// Procedural Texture, Typography, AI Art & PBR Fabric Map Engine for ATELIER 3D

/**
 * Generates a high-DPI offscreen canvas and returns its data URL.
 */
const createOffscreenCanvas = (size = 1024) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  return { canvas, ctx, size };
};

/**
 * Simple deterministic hash from string for seeded procedural art
 */
const hashString = (str) => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createSeededRandom = (seedStr) => {
  let a = hashString(seedStr || 'atelier-3d');
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Generates a custom Typography / Jersey / Streetwear Box Logo texture
 */
export const generateTextDecalTexture = ({
  text = 'ATELIER',
  subtext = 'EST. 2026 // STUDIO',
  numberText = '',
  fontFamily = 'Impact, "Arial Black", sans-serif',
  textColor = '#FFFFFF',
  accentColor = '#EFBD48',
  bgStyle = 'box', // 'none' | 'box' | 'badge' | 'jersey' | 'circle' | 'arched'
  strokeWidth = 0,
  strokeColor = '#000000',
  letterSpacing = 4,
  fontSize = 110,
}) => {
  const { canvas, ctx, size } = createOffscreenCanvas(1024);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;

  ctx.save();

  if (bgStyle === 'box') {
    // Supreme / Streetwear style Box Logo
    const boxW = size * 0.84;
    const boxH = subtext ? size * 0.34 : size * 0.26;
    const bx = cx - boxW / 2;
    const by = cy - boxH / 2;

    ctx.fillStyle = accentColor;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 16);
    ctx.fill();

    // Inner border frame
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(bx + 16, by + 16, boxW - 32, boxH - 32);
  } else if (bgStyle === 'badge') {
    // Hexagonal / Crest Shield
    const r = size * 0.38;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = textColor;
    ctx.stroke();
  } else if (bgStyle === 'circle') {
    // Circular seal stamp
    const r = size * 0.38;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 5;
    ctx.setLineDash([18, 12]);
    ctx.beginPath();
    ctx.arc(cx, cy, r - 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Render Jersey Mode (Player Name on top + Giant Number below)
  if (bgStyle === 'jersey') {
    const cleanName = (text || 'ATELIER').toUpperCase();
    const cleanNum = numberText || '26';

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${Math.round(fontSize * 0.85)}px ${fontFamily}`;
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = `${letterSpacing}px`;
    }

    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth * 2.5;
      ctx.strokeText(cleanName, cx, cy - 230);
    }
    ctx.fillStyle = textColor;
    ctx.fillText(cleanName, cx, cy - 230);

    // Decorative accent bar under name
    ctx.fillStyle = accentColor;
    ctx.fillRect(cx - 180, cy - 165, 360, 12);

    // Big Athletic Number
    ctx.font = `900 420px ${fontFamily}`;
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = '8px';
    }
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 22;
    ctx.strokeText(cleanNum, cx, cy + 115);

    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth * 3;
      ctx.strokeText(cleanNum, cx, cy + 115);
    }
    ctx.fillStyle = textColor;
    ctx.fillText(cleanNum, cx, cy + 115);

    if (subtext) {
      ctx.font = `700 38px "Inter", sans-serif`;
      ctx.fillStyle = accentColor;
      ctx.fillText(subtext.toUpperCase(), cx, cy + 370);
    }

    ctx.restore();
    return canvas.toDataURL('image/png');
  }

  // Render Arched Collegiate Text
  if (bgStyle === 'arched') {
    const cleanText = (text || 'ATELIER').toUpperCase();
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const radius = 340;
    const totalAngle = Math.min(Math.PI * 0.78, cleanText.length * 0.11);
    const startAngle = -Math.PI / 2 - totalAngle / 2;
    const step = cleanText.length > 1 ? totalAngle / (cleanText.length - 1) : 0;

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const theta = cleanText.length === 1 ? -Math.PI / 2 : startAngle + i * step;
      ctx.save();
      ctx.translate(cx + Math.cos(theta) * radius, cy + 180 + Math.sin(theta) * radius);
      ctx.rotate(theta + Math.PI / 2);
      if (strokeWidth > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth * 2;
        ctx.strokeText(char, 0, 0);
      }
      ctx.fillStyle = textColor;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    if (subtext) {
      ctx.font = `800 44px ${fontFamily}`;
      ctx.fillStyle = accentColor;
      ctx.fillText(subtext.toUpperCase(), cx, cy + 60);
    }

    if (numberText) {
      ctx.font = `900 180px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.strokeText(numberText, cx, cy + 220);
      ctx.fillText(numberText, cx, cy + 220);
    }

    ctx.restore();
    return canvas.toDataURL('image/png');
  }

  // Standard / Box / Badge / Circle centered text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${letterSpacing}px`;
  }

  const mainY = subtext ? cy - 28 : cy;
  const displayMain = (text || 'ATELIER').toUpperCase();

  if (strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth * 2.5;
    ctx.lineJoin = 'round';
    ctx.strokeText(displayMain, cx, mainY);
  }

  ctx.fillStyle = textColor;
  ctx.fillText(displayMain, cx, mainY);

  if (subtext) {
    ctx.font = `700 ${Math.max(28, Math.round(fontSize * 0.34))}px "Inter", sans-serif`;
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = `${Math.max(2, Math.round(letterSpacing * 1.4))}px`;
    }
    ctx.fillStyle = bgStyle === 'box' ? textColor : accentColor;
    ctx.fillText(subtext.toUpperCase(), cx, cy + fontSize * 0.58);
  }

  ctx.restore();
  return canvas.toDataURL('image/png');
};

/**
 * Generates high-res Procedural AI Artwork or Seamless Pattern based on prompt & mode
 * @param {string} prompt - User prompt or style description
 * @param {'logo' | 'full'} mode - 'logo' generates a transparent centered emblem; 'full' generates a full-bleed pattern
 * @param {string} baseColor - Current shirt color for harmonious contrast
 */
export const generateProceduralArt = (prompt = 'Cyberpunk Neon Studio', mode = 'logo') => {
  const { canvas, ctx, size } = createOffscreenCanvas(1024);
  const p = prompt.toLowerCase();
  const rand = createSeededRandom(prompt + ':' + mode);

  // Determine palette from prompt keywords
  let palette = ['#FF3366', '#00F5D4', '#FEE440', '#9B5DE5', '#0B090A'];
  if (p.includes('cyber') || p.includes('neon') || p.includes('glitch') || p.includes('synth')) {
    palette = ['#00F5D4', '#FF007F', '#7B2CBF', '#FFE600', '#090A10'];
  } else if (p.includes('gold') || p.includes('luxury') || p.includes('royal') || p.includes('minimal')) {
    palette = ['#D4AF37', '#F3E5AB', '#AA771C', '#FFFFFF', '#111318'];
  } else if (p.includes('ocean') || p.includes('wave') || p.includes('water') || p.includes('japan') || p.includes('ice')) {
    palette = ['#00B4D8', '#90E0EF', '#03045E', '#CAF0F8', '#0A192F'];
  } else if (p.includes('fire') || p.includes('flame') || p.includes('sunset') || p.includes('mars') || p.includes('red')) {
    palette = ['#FF4D00', '#FF9E00', '#FF0055', '#FFF3B0', '#1A090D'];
  } else if (p.includes('forest') || p.includes('camo') || p.includes('nature') || p.includes('acid') || p.includes('toxic')) {
    palette = ['#38B000', '#CCFF33', '#007200', '#9EF01A', '#0B1D13'];
  } else if (p.includes('mono') || p.includes('black') || p.includes('white') || p.includes('bauhaus')) {
    palette = ['#FFFFFF', '#E63946', '#F4A261', '#457B9D', '#1D3557'];
  }

  const cx = size / 2;
  const cy = size / 2;

  if (mode === 'full') {
    // Full-garment seamless/all-over art pattern
    ctx.fillStyle = palette[4];
    ctx.fillRect(0, 0, size, size);

    if (p.includes('topo') || p.includes('contour') || p.includes('wave')) {
      // Topographic contour lines
      ctx.lineWidth = 4;
      for (let ring = 0; ring < 36; ring++) {
        ctx.strokeStyle = palette[ring % 3];
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        const baseY = (ring / 36) * size;
        for (let x = 0; x <= size; x += 16) {
          const yOffset =
            Math.sin(x * 0.008 + ring * 0.4) * 42 +
            Math.cos(x * 0.02 - ring * 0.2) * 24;
          if (x === 0) ctx.moveTo(x, baseY + yOffset);
          else ctx.lineTo(x, baseY + yOffset);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (p.includes('grid') || p.includes('cyber') || p.includes('synth') || p.includes('matrix')) {
      // Perspective synthwave / cyber grid + glowing nodes
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, palette[4]);
      grad.addColorStop(0.5, '#120826');
      grad.addColorStop(1, palette[4]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = palette[0];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.35;
      const step = 64;
      for (let i = 0; i <= size; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Glowing cyber circuits & geometric shards
      for (let i = 0; i < 45; i++) {
        const gx = Math.floor(rand() * 16) * step;
        const gy = Math.floor(rand() * 16) * step;
        ctx.fillStyle = palette[i % 4];
        ctx.beginPath();
        ctx.arc(gx, gy, 6 + rand() * 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = palette[(i + 1) % 4];
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + (rand() > 0.5 ? step : -step), gy + (rand() > 0.5 ? step : 0));
        ctx.stroke();
      }
    } else if (p.includes('bauhaus') || p.includes('geo') || p.includes('abstract')) {
      // Bauhaus geometric blocks & quarter-circles
      const cell = size / 8;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const x = c * cell;
          const y = r * cell;
          const shapeType = Math.floor(rand() * 4);
          ctx.fillStyle = palette[Math.floor(rand() * 4)];
          ctx.beginPath();
          if (shapeType === 0) {
            ctx.arc(x, y, cell, 0, Math.PI / 2);
            ctx.lineTo(x, y);
          } else if (shapeType === 1) {
            ctx.arc(x + cell / 2, y + cell / 2, cell * 0.42, 0, Math.PI * 2);
          } else if (shapeType === 2) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + cell, y);
            ctx.lineTo(x, y + cell);
          } else {
            ctx.rect(x + 8, y + 8, cell - 16, cell - 16);
          }
          ctx.closePath();
          ctx.fill();
        }
      }
    } else {
      // Dynamic Streetwear Abstract Splatter / Energy Aurora
      for (let i = 0; i < 28; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const radius = 80 + rand() * 240;
        const grad = ctx.createRadialGradient(x, y, 5, x, y, radius);
        const col = palette[i % 4];
        grad.addColorStop(0, col);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crisp geometric overlay lines
      ctx.strokeStyle = '#FFFFFF';
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 3;
      for (let i = 0; i < 18; i++) {
        ctx.beginPath();
        ctx.moveTo(rand() * size, rand() * size);
        ctx.lineTo(rand() * size, rand() * size);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    return canvas.toDataURL('image/png');
  }

  // LOGO / CHEST EMBLEM MODE (Transparent background, crisp vector-style graphic)
  ctx.clearRect(0, 0, size, size);

  // Outer tech ring / crest
  ctx.save();
  ctx.strokeStyle = palette[0];
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 360, 0, Math.PI * 2);
  ctx.stroke();

  // Inner filled medallion
  const bgGrad = ctx.createLinearGradient(cx - 320, cy - 320, cx + 320, cy + 320);
  bgGrad.addColorStop(0, palette[4]);
  bgGrad.addColorStop(1, '#181824');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 335, 0, Math.PI * 2);
  ctx.fill();

  // Synthwave Sun or Sacred Geometry inside medallion
  const sunGrad = ctx.createLinearGradient(cx, cy - 220, cx, cy + 180);
  sunGrad.addColorStop(0, palette[0]);
  sunGrad.addColorStop(0.5, palette[1]);
  sunGrad.addColorStop(1, palette[2]);
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 210, 0, Math.PI * 2);
  ctx.fill();

  // Horizontal retro slice cutouts across the sun
  ctx.fillStyle = palette[4];
  for (let i = 0; i < 6; i++) {
    const sliceY = cy + 10 + i * 28;
    const sliceH = 6 + i * 3.2;
    ctx.fillRect(cx - 240, sliceY, 480, sliceH);
  }

  // Geometric sacred polygon or star overlay
  const points = 3 + (Math.floor(rand() * 4) * 2); // 3, 5, 7, or 9 points
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
    const r = 175;
    const x = cx + r * Math.cos(angle);
    const y = cy - 20 + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Dynamic banner across bottom of emblem with prompt keyword
  const label = (prompt.trim().split(/\s+/).slice(0, 2).join(' ') || 'ATELIER').toUpperCase().slice(0, 14);
  ctx.fillStyle = palette[0];
  ctx.beginPath();
  ctx.roundRect(cx - 270, cy + 185, 540, 86, 14);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.strokeRect(cx - 260, cy + 195, 520, 66);

  ctx.fillStyle = palette[4];
  ctx.font = '900 46px "Inter", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy + 230);

  ctx.restore();
  return canvas.toDataURL('image/png');
};

/**
 * Curated Preset Graphics & Seamless Patterns Library
 */
export const CURATED_GRAPHICS = [
  {
    id: 'cyber-samurai',
    name: 'Cyber Sun Crest',
    category: 'logo',
    prompt: 'Cyberpunk Neon Sun Studio',
    previewColor: '#00F5D4',
  },
  {
    id: 'luxury-crest',
    name: 'Royal Gold Atelier',
    category: 'logo',
    prompt: 'Luxury Gold Minimalist Crest',
    previewColor: '#D4AF37',
  },
  {
    id: 'ocean-wave',
    name: 'Kanagawa Apex',
    category: 'logo',
    prompt: 'Ocean Wave Japan Blue',
    previewColor: '#00B4D8',
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare 99',
    category: 'logo',
    prompt: 'Fire Sunset Mars Flare',
    previewColor: '#FF4D00',
  },
  {
    id: 'acid-rave',
    name: 'Bio-Hazard Acid',
    category: 'logo',
    prompt: 'Acid Toxic Rave Green',
    previewColor: '#CCFF33',
  },
  {
    id: 'topo-pattern',
    name: 'Topographic Contour',
    category: 'full',
    prompt: 'Topographic Contour Wave Neon',
    previewColor: '#00F5D4',
  },
  {
    id: 'bauhaus-pattern',
    name: 'Bauhaus Geometric',
    category: 'full',
    prompt: 'Bauhaus Geometric Abstract',
    previewColor: '#E63946',
  },
  {
    id: 'synth-grid',
    name: 'Cyber Matrix Grid',
    category: 'full',
    prompt: 'Cyber Grid Matrix Synth',
    previewColor: '#FF007F',
  },
  {
    id: 'aurora-nebula',
    name: 'Aurora Street Camo',
    category: 'full',
    prompt: 'Fire Sunset Nebula Splatter',
    previewColor: '#FF9E00',
  },
];

/**
 * Generates a procedural bump/normal canvas for realistic PBR fabric micro-surfaces
 */
export const generateFabricBumpCanvas = (fabricType = 'cotton') => {
  const { canvas, ctx, size } = createOffscreenCanvas(256);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  if (fabricType === 'cotton') {
    // Fine knit jersey cotton weave
    ctx.fillStyle = '#969696';
    for (let y = 0; y < size; y += 4) {
      for (let x = 0; x < size; x += 4) {
        if ((x + y) % 8 === 0) {
          ctx.fillRect(x, y, 2, 3);
        } else {
          ctx.fillStyle = '#686868';
          ctx.fillRect(x + 1, y + 1, 2, 2);
          ctx.fillStyle = '#969696';
        }
      }
    }
  } else if (fabricType === 'mesh') {
    // Athletic breathable jersey mesh with micro-perforations
    ctx.fillStyle = '#A8A8A8';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#303030';
    const step = 16;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const offsetX = (y / step) % 2 === 0 ? 0 : step / 2;
        ctx.beginPath();
        ctx.arc(x + offsetX, y, 4.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (fabricType === 'denim') {
    // Diagonal twill weave
    ctx.strokeStyle = '#B0B0B0';
    ctx.lineWidth = 2;
    for (let i = -size; i < size * 2; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();
    }
  } else if (fabricType === 'carbon') {
    // Interlocking carbon-fiber tech weave
    const cell = 16;
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        const isAlt = ((x + y) / cell) % 2 === 0;
        ctx.fillStyle = isAlt ? '#B8B8B8' : '#505050';
        ctx.fillRect(x, y, cell - 1, cell - 1);
      }
    }
  }

  return canvas;
};
