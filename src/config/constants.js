import { swatch, fileIcon, ai, logoShirt, stylishShirt, download } from '../assets';

export const EditorTabs = [
  {
    name: 'colorpicker',
    label: 'Color & Fabric',
    shortcut: '1',
    icon: swatch,
    svgType: 'palette',
  },
  {
    name: 'textstudio',
    label: 'Typography & Jersey',
    shortcut: '2',
    icon: logoShirt,
    svgType: 'type',
  },
  {
    name: 'aipicker',
    label: 'AI & Pattern Studio',
    shortcut: '3',
    icon: ai,
    svgType: 'sparkles',
  },
  {
    name: 'decaltransform',
    label: 'Placement & Scale',
    shortcut: '4',
    icon: stylishShirt,
    svgType: 'sliders',
  },
  {
    name: 'filepicker',
    label: 'Upload & Project',
    shortcut: '5',
    icon: fileIcon,
    svgType: 'upload',
  },
  {
    name: 'lookbook',
    label: 'Lookbook & Wardrobe',
    shortcut: '6',
    icon: download,
    svgType: 'bookmark',
  },
];

export const FilterTabs = [
  {
    name: 'logoShirt',
    label: 'Front Graphic',
    icon: logoShirt,
    svgType: 'front',
  },
  {
    name: 'backShirt',
    label: 'Back Print',
    icon: logoShirt,
    svgType: 'back',
  },
  {
    name: 'stylishShirt',
    label: 'All-Over Pattern',
    icon: stylishShirt,
    svgType: 'pattern',
  },
  {
    name: 'wireframeToggle',
    label: 'Mesh Wireframe',
    icon: swatch,
    svgType: 'wireframe',
  },
  {
    name: 'autoRotateToggle',
    label: '360° Turntable',
    icon: ai,
    svgType: 'rotate',
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: 'logoDecal',
    filterTab: 'logoShirt',
  },
  back: {
    stateProperty: 'backDecal',
    filterTab: 'backShirt',
  },
  full: {
    stateProperty: 'fullDecal',
    filterTab: 'stylishShirt',
  },
};

export const CAMERA_VIEWS = [
  { id: 'front', label: 'Front', angle: [0, 0, 0], camPos: [0, 0, 2] },
  { id: 'back', label: 'Back', angle: [0, Math.PI, 0], camPos: [0, 0, 2] },
  { id: 'left', label: 'Left Side', angle: [0, Math.PI / 2.2, 0], camPos: [0, 0, 2.15] },
  { id: 'right', label: 'Right Side', angle: [0, -Math.PI / 2.2, 0], camPos: [0, 0, 2.15] },
  { id: 'closeup', label: 'Chest Detail', angle: [0.05, 0, 0], camPos: [0, 0.08, 1.25] },
];

export const STUDIO_ENVIRONMENTS = [
  { id: 'city', label: 'City Studio' },
  { id: 'sunset', label: 'Warm Sunset' },
  { id: 'dawn', label: 'Soft Dawn' },
  { id: 'night', label: 'Cyber Night' },
  { id: 'warehouse', label: 'Loft Warehouse' },
];

export const CURATED_SWATCHES = [
  '#0F172A', // Obsidian Navy
  '#18181B', // Carbon Black
  '#F8FAFC', // Crisp Chalk White
  '#E2E8F0', // Heather Ash Grey
  '#EFBD48', // Atelier Amber Gold
  '#DC2626', // Crimson Varsity
  '#2563EB', // Cobalt Electric
  '#059669', // Alpine Emerald
  '#7C3AED', // Ultra Violet
  '#DB2777', // Cyber Magenta
  '#EA580C', // Solar Tangerine
  '#0D9488', // Deep Teal
  '#4F46E5', // Indigo Night
  '#65A30D', // Acid Moss
  '#78350F', // Vintage Espresso
  '#94A3B8', // Liquid Titanium
];
