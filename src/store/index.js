import { proxy } from 'valtio';

export const FABRIC_TYPES = {
  cotton: {
    id: 'cotton',
    name: 'Heavyweight Cotton (320 GSM)',
    roughness: 0.88,
    metalness: 0.02,
    bumpScale: 0.012,
    basePrice: 48,
    badge: '100% Organic Combed',
  },
  mesh: {
    id: 'mesh',
    name: 'Pro Breathable Jersey Mesh',
    roughness: 0.62,
    metalness: 0.08,
    bumpScale: 0.02,
    basePrice: 56,
    badge: 'Moisture-Wicking Aero',
  },
  satin: {
    id: 'satin',
    name: 'Luxury Mulberry Silk-Satin',
    roughness: 0.24,
    metalness: 0.22,
    bumpScale: 0.002,
    basePrice: 78,
    badge: 'Lustrous Soft Drape',
  },
  denim: {
    id: 'denim',
    name: 'Vintage Raw Twill Weave',
    roughness: 0.92,
    metalness: 0.04,
    bumpScale: 0.018,
    basePrice: 64,
    badge: '400 GSM Indigo Loom',
  },
  carbon: {
    id: 'carbon',
    name: 'Ballistic Tech-Weave',
    roughness: 0.42,
    metalness: 0.38,
    bumpScale: 0.016,
    basePrice: 84,
    badge: 'Aramid Tactical Matrix',
  },
  metallic: {
    id: 'metallic',
    name: 'Cyber Chrome Foil',
    roughness: 0.16,
    metalness: 0.82,
    bumpScale: 0.004,
    basePrice: 95,
    badge: 'Reflective PVD Finish',
  },
};

export const PLACEMENT_PRESETS = {
  center: {
    id: 'center',
    label: 'Center Chest',
    position: [0, 0.04, 0.15],
    scale: 0.15,
  },
  leftChest: {
    id: 'leftChest',
    label: 'Left Pocket Crest',
    position: [0.075, 0.085, 0.14],
    scale: 0.085,
  },
  rightChest: {
    id: 'rightChest',
    label: 'Right Chest Badge',
    position: [-0.075, 0.085, 0.14],
    scale: 0.085,
  },
  oversized: {
    id: 'oversized',
    label: 'Oversized Street Graphic',
    position: [0, -0.01, 0.15],
    scale: 0.25,
  },
  lowerHem: {
    id: 'lowerHem',
    label: 'Lower Belly Tag',
    position: [0, -0.14, 0.15],
    scale: 0.12,
  },
};

export const LOOKBOOK_PRESETS = [
  {
    id: 'neo-tokyo',
    name: 'Neo-Tokyo Cyber 2026',
    subtitle: 'Ballistic Tech-Weave + Neon Crest',
    color: '#0F172A',
    fabric: 'carbon',
    isLogoTexture: true,
    isBackTexture: true,
    isFullTexture: false,
    placementPreset: 'oversized',
    logoPrompt: 'Cyberpunk Neon Sun Studio',
    backTextConfig: {
      text: 'KINETIX',
      subtext: 'TOKYO // SECTOR 09',
      numberText: '88',
      bgStyle: 'jersey',
      textColor: '#00F5D4',
      accentColor: '#FF007F',
    },
  },
  {
    id: 'minimal-atelier',
    name: 'Atelier Gold Edition',
    subtitle: 'Mulberry Silk-Satin + Pocket Crest',
    color: '#18181B',
    fabric: 'satin',
    isLogoTexture: true,
    isBackTexture: false,
    isFullTexture: false,
    placementPreset: 'leftChest',
    logoPrompt: 'Luxury Gold Minimalist Crest',
  },
  {
    id: 'varsity-apex',
    name: 'Apex Esports Pro Jersey',
    subtitle: 'Breathable Mesh + Back Number 07',
    color: '#991B1B',
    fabric: 'mesh',
    isLogoTexture: true,
    isBackTexture: true,
    isFullTexture: false,
    placementPreset: 'center',
    logoPrompt: 'Fire Sunset Mars Flare',
    backTextConfig: {
      text: 'VALKYRIE',
      subtext: 'WORLD FINALS EDITION',
      numberText: '07',
      bgStyle: 'jersey',
      textColor: '#FFFFFF',
      accentColor: '#FBBF24',
    },
  },
  {
    id: 'topo-expedition',
    name: 'Alpine Topo All-Over',
    subtitle: 'Heavyweight Cotton + Contour Print',
    color: '#064E3B',
    fabric: 'cotton',
    isLogoTexture: true,
    isBackTexture: false,
    isFullTexture: true,
    placementPreset: 'leftChest',
    logoPrompt: 'Acid Toxic Rave Green',
    fullPrompt: 'Topographic Contour Wave Neon',
  },
  {
    id: 'chrome-future',
    name: 'Liquid Chrome Runway',
    subtitle: 'Cyber Chrome Foil + Bauhaus',
    color: '#CBD5E1',
    fabric: 'metallic',
    isLogoTexture: true,
    isBackTexture: false,
    isFullTexture: false,
    placementPreset: 'center',
    logoPrompt: 'Ocean Wave Japan Blue',
  },
];

const initialSavedDesigns = () => {
  try {
    const raw = localStorage.getItem('atelier_3d_wardrobe_v2');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const state = proxy({
  intro: true,
  designName: 'ATELIER-01 // SIGNATURE DROP',
  color: '#0F172A',
  fabric: 'cotton',
  wireframe: false,

  // Front Decal
  isLogoTexture: true,
  logoDecal: './threejs.png',
  logoPosition: [0, 0.04, 0.15],
  logoScale: 0.15,
  logoRotation: 0,
  logoPlacementPreset: 'center',

  // Back Decal
  isBackTexture: false,
  backDecal: './threejs.png',
  backPosition: [0, 0.04, -0.15],
  backScale: 0.22,
  backRotation: 0,

  // Full Sublimation Pattern
  isFullTexture: false,
  fullDecal: './threejs.png',
  fullScale: 1,
  textureRepeat: 1,

  // Live Typography Studio state
  textConfig: {
    text: 'ATELIER',
    subtext: 'EST. 2026 // STUDIO',
    numberText: '26',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    textColor: '#FFFFFF',
    accentColor: '#EFBD48',
    bgStyle: 'box',
    strokeWidth: 0,
    strokeColor: '#000000',
    letterSpacing: 4,
    fontSize: 105,
    targetZone: 'front', // 'front' | 'back'
  },

  // Camera & Studio Environment
  cameraView: 'front', // 'front' | 'back' | 'left' | 'right' | 'closeup'
  autoRotate: false,
  rotateSpeed: 1.6,
  envPreset: 'city', // 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'studio'
  lightIntensity: 0.65,
  studioTheme: 'dark', // 'dark' | 'light' | 'cyber'

  // Sizing & Tech-Pack
  selectedSize: 'L',
  fitType: 'Oversized Boxy',

  // Undo / Redo History
  history: [],
  historyIndex: -1,

  // Saved Wardrobe Designs
  savedWardrobe: initialSavedDesigns(),
});

// Snapshot keys tracked in Undo/Redo
const SNAPSHOT_KEYS = [
  'color',
  'fabric',
  'wireframe',
  'isLogoTexture',
  'logoDecal',
  'logoPosition',
  'logoScale',
  'logoRotation',
  'logoPlacementPreset',
  'isBackTexture',
  'backDecal',
  'backPosition',
  'backScale',
  'backRotation',
  'isFullTexture',
  'fullDecal',
  'fullScale',
  'textureRepeat',
  'designName',
];

export const createStateSnapshot = () => {
  const snap = {};
  for (const key of SNAPSHOT_KEYS) {
    const val = state[key];
    snap[key] = Array.isArray(val) ? [...val] : val;
  }
  return snap;
};

export const pushHistorySnapshot = () => {
  const current = createStateSnapshot();
  const sliced = state.history.slice(0, state.historyIndex + 1);
  sliced.push(current);
  if (sliced.length > 30) sliced.shift();
  state.history = sliced;
  state.historyIndex = sliced.length - 1;
};

export const applySnapshot = (snap) => {
  if (!snap) return;
  for (const key of SNAPSHOT_KEYS) {
    if (snap[key] !== undefined) {
      state[key] = Array.isArray(snap[key]) ? [...snap[key]] : snap[key];
    }
  }
};

export const undoDesign = () => {
  if (state.historyIndex > 0) {
    state.historyIndex -= 1;
    applySnapshot(state.history[state.historyIndex]);
  }
};

export const redoDesign = () => {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex += 1;
    applySnapshot(state.history[state.historyIndex]);
  }
};

export const saveDesignToWardrobe = (customTitle) => {
  const item = {
    id: `design-${Date.now()}`,
    title: customTitle || state.designName || `Drop #${state.savedWardrobe.length + 1}`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    snapshot: createStateSnapshot(),
  };
  const next = [item, ...state.savedWardrobe].slice(0, 12);
  state.savedWardrobe = next;
  try {
    localStorage.setItem('atelier_3d_wardrobe_v2', JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
  return item;
};

export const deleteDesignFromWardrobe = (id) => {
  const next = state.savedWardrobe.filter((d) => d.id !== id);
  state.savedWardrobe = next;
  try {
    localStorage.setItem('atelier_3d_wardrobe_v2', JSON.stringify(next));
  } catch {
    // ignore
  }
};

export const calculateEstimatedPrice = (snap) => {
  const fabricInfo = FABRIC_TYPES[snap.fabric] || FABRIC_TYPES.cotton;
  let total = fabricInfo.basePrice;
  if (snap.isLogoTexture) total += 12;
  if (snap.isBackTexture) total += 16;
  if (snap.isFullTexture) total += 24;
  return total;
};

export default state;
