import { FABRIC_TYPES, calculateEstimatedPrice, createStateSnapshot } from '../store';

export const downloadCanvasToImage = (filename = 'atelier-3d-render.png') => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');

  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates and downloads an interview-grade Production Tech-Pack Spec Sheet PNG
 * combining the 3D WebGL viewport capture with technical garment specifications.
 */
export const downloadTechPackSpecSheet = (snap) => {
  const glCanvas = document.querySelector('canvas');
  if (!glCanvas) return;

  const sheet = document.createElement('canvas');
  sheet.width = 1600;
  sheet.height = 1000;
  const ctx = sheet.getContext('2d');

  // Dark Studio Blueprint Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1000);
  bgGrad.addColorStop(0, '#090D16');
  bgGrad.addColorStop(1, '#111827');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1000);

  // Subtle technical blueprint grid
  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1600; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1000);
    ctx.stroke();
  }
  for (let y = 0; y < 1000; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1600, y);
    ctx.stroke();
  }

  // Outer technical border
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 1536, 936);

  // Header bar
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(32, 32, 1536, 88);
  ctx.strokeRect(32, 32, 1536, 88);

  ctx.fillStyle = '#F59E0B';
  ctx.font = '900 28px "Inter", sans-serif';
  ctx.fillText('ATELIER 3D // PRODUCTION TECH-PACK SPECIFICATION', 64, 86);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 16px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`DOC REF: ATL-${Date.now().toString().slice(-6)} | REV 2.4`, 1536, 84);
  ctx.textAlign = 'left';

  // Draw 3D Viewport Render Box on the Left
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(64, 152, 820, 780);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.strokeRect(64, 152, 820, 780);

  // Maintain aspect ratio of WebGL canvas inside the 820x780 frame
  const srcW = glCanvas.width;
  const srcH = glCanvas.height;
  const scale = Math.min(780 / srcW, 740 / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const drawX = 64 + (820 - drawW) / 2;
  const drawY = 152 + (780 - drawH) / 2;
  ctx.drawImage(glCanvas, drawX, drawY, drawW, drawH);

  // Right Column: Technical Specification Cards
  const rightX = 920;
  const fabricInfo = FABRIC_TYPES[snap.fabric] || FABRIC_TYPES.cotton;
  const unitPrice = calculateEstimatedPrice(snap);

  // Title Block
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 32px "Inter", sans-serif';
  ctx.fillText((snap.designName || 'ATELIER CUSTOM DROP').toUpperCase(), rightX, 195);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 16px "Inter", sans-serif';
  ctx.fillText(`Fit Profile: ${snap.fitType}   •   Sample Size: ${snap.selectedSize}`, rightX, 230);

  // Colorway Swatch Card
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(rightX, 265, 616, 130);
  ctx.strokeRect(rightX, 265, 616, 130);

  ctx.fillStyle = snap.color;
  ctx.fillRect(rightX + 24, 289, 82, 82);
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeRect(rightX + 24, 289, 82, 82);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '700 13px monospace';
  ctx.fillText('PRIMARY PANTONE / HEX COLORWAY', rightX + 130, 315);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 28px monospace';
  ctx.fillText(snap.color.toUpperCase(), rightX + 130, 355);

  // Fabric & Material Spec Card
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(rightX, 420, 616, 155);
  ctx.strokeRect(rightX, 420, 616, 155);

  ctx.fillStyle = '#F59E0B';
  ctx.font = '700 13px monospace';
  ctx.fillText('TEXTILE & PBR SURFACE MATERIAL', rightX + 24, 454);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 22px "Inter", sans-serif';
  ctx.fillText(fabricInfo.name, rightX + 24, 490);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 16px "Inter", sans-serif';
  ctx.fillText(`Spec Classification: ${fabricInfo.badge}`, rightX + 24, 522);
  ctx.fillText(
    `PBR Roughness: ${fabricInfo.roughness}  |  Metalness: ${fabricInfo.metalness}`,
    rightX + 24,
    550
  );

  // Active Print Zones Card
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(rightX, 600, 616, 175);
  ctx.strokeRect(rightX, 600, 616, 175);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 13px monospace';
  ctx.fillText('ACTIVE PRINT & DECAL ZONES', rightX + 24, 634);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '500 16px "Inter", sans-serif';
  ctx.fillText(
    `• Front Chest Graphic: ${snap.isLogoTexture ? `ACTIVE (Scale ${(snap.logoScale * 100).toFixed(0)}%)` : 'NONE'}`,
    rightX + 24,
    670
  );
  ctx.fillText(
    `• Back Jersey / Print: ${snap.isBackTexture ? `ACTIVE (Scale ${(snap.backScale * 100).toFixed(0)}%)` : 'NONE'}`,
    rightX + 24,
    705
  );
  ctx.fillText(
    `• All-Over Sublimation: ${snap.isFullTexture ? `ACTIVE (Repeat ${snap.textureRepeat}x)` : 'NONE'}`,
    rightX + 24,
    740
  );

  // Cost & Production Estimate Footer Card
  ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.fillRect(rightX, 800, 616, 132);
  ctx.strokeRect(rightX, 800, 616, 132);

  ctx.fillStyle = '#FBBF24';
  ctx.font = '700 14px monospace';
  ctx.fillText('ESTIMATED UNIT PRODUCTION COST (MOQ 1 PC)', rightX + 24, 838);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 44px "Inter", sans-serif';
  ctx.fillText(`$${unitPrice}.00 USD`, rightX + 24, 895);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 14px monospace';
  ctx.fillText('READY FOR DTG / SUBLIMATION MANUFACTURING', rightX + 260, 892);

  const link = document.createElement('a');
  link.href = sheet.toDataURL('image/png');
  link.download = `${(snap.designName || 'atelier-spec').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-techpack.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportDesignAsJson = () => {
  const data = createStateSnapshot();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(data.designName || 'atelier-design').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.atelier.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (err) => reject(err);
    fileReader.readAsDataURL(file);
  });

export const getContrastingColor = (color) => {
  if (!color || typeof color !== 'string') return 'white';
  const hex = color.replace('#', '');
  if (hex.length !== 6) return 'white';

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 135 ? '#0F172A' : '#FFFFFF';
};
