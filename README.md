# ATELIER 3D — Interactive WebGL Apparel Studio & PBR Configurator

**ATELIER 3D** is an interactive 3D apparel customization engine, procedural pattern studio, and production tech-pack generator built with **React 19**, **Three.js**, **React Three Fiber (R3F)**, **Drei**, **Valtio**, **Framer Motion**, and **Tailwind CSS**.

Designed as a production-ready showcase of modern real-time 3D web graphics, client-side procedural texture synthesis, and state-driven CAD/e-commerce workflows.

---

## ✨ Key Engineering Highlights & Features

### 1. Real-Time PBR Textile & Weave Simulation
- **6 Physically-Based Fabric Profiles**:
  - *Heavyweight Cotton (320 GSM)* — Matte organic knit weave
  - *Pro Breathable Jersey Mesh* — Micro-perforated athletic bump map
  - *Luxury Mulberry Silk-Satin* — Low-roughness lustrous sheen
  - *Vintage Raw Twill Weave* — Diagonal 400 GSM denim twill surface
  - *Ballistic Tech-Weave* — Interlocking carbon/aramid matrix
  - *Cyber Chrome Foil* — High-metalness reflective PVD finish
- **Procedural Bump Map Synthesis**: Generates tileable `THREE.CanvasTexture` micro-surface bump maps dynamically on the client without external texture asset overhead.
- **Mesh Wireframe Inspector**: Toggle real-time 3D geometry wireframe overlay to inspect UV layout and polygon topology.

### 2. Multi-Zone Decal & Sublimation Engine
- **3 Independent Print Layers**:
  - **Front Graphic Zone**: Supports quick-placement presets (*Center Chest*, *Left Pocket Crest*, *Right Chest Badge*, *Oversized Street Graphic*, *Lower Belly Tag*) plus fine-grained **X/Y UV coordinate sliders, scale (6%–32%), and rotation (-180° to +180°)**.
  - **Back Jersey / Graphic Zone**: Dedicated back-print projection with vertical offset and scale controls.
  - **All-Over Cut & Sew Sublimation Pattern**: Full-garment seamless texture wrapping (`THREE.RepeatWrapping`) with adjustable tiling density (`1x`–`6x`).

### 3. Live Typography, Box Logo & Esports Jersey Studio
- Synthesizes high-DPI (`1024×1024`) transparent typography decals in real time:
  - **Streetwear Box Logo Mode**
  - **Athletic / Esports Jersey Mode** (Player Name + Giant Back Number `00`–`99`)
  - **Collegiate Arched Text Mode** (Trigonometric character-by-character arc rendering)
  - **Hexagonal Crest & Circular Seal Stamp Modes**
- Full control over typeface family, ink color, badge color, font size, letter spacing, and outline stroke.

### 4. Dual-Mode AI & Procedural Art Engine
- **Instant Client-Side Procedural Engine**: Synthesizes high-resolution vector/canvas emblems and all-over patterns (*Cyberpunk Neon Sun*, *Topographic Contour*, *Bauhaus Geometric*, *Cyber Matrix Grid*, *Kanagawa Wave*) in `<50ms` with deterministic seeded randomness—zero API keys or backend required.
- **Remote API Integration**: Supports optional connection to a custom DALL·E / image generation endpoint with automatic fallback to the procedural engine.

### 5. Studio Camera Rig, HDRI Lighting & Time-Travel State
- **5 Camera Angle Presets** (*Front*, *Back*, *Left Side*, *Right Side*, *Chest Detail*) + **360° Turntable Auto-Rotate** with smooth `maath` spring damping.
- **5 HDRI Environment Rigs** (*City Studio*, *Warm Sunset*, *Soft Dawn*, *Cyber Night*, *Loft Warehouse*) with adjustable key-light intensity.
- **Undo / Redo History Stack** (`Ctrl+Z` / `Ctrl+Y`) tracking up to 30 snapshots.
- **Lookbook Collections & LocalStorage Wardrobe**: 1-click designer presets, personal saved drops in `localStorage`, and `.atelier.json` project file export/import.

### 6. Manufacturing Tech-Pack & BOM Spec Sheet Generator
- Live unit cost calculator based on base textile GSM and active print zones.
- **1-Click Production Tech-Pack Export**: Renders a composite `1600×1000` engineering blueprint PNG combining the live 3D viewport capture, Pantone/HEX swatch, PBR fabric specification, active print zone manifest, size grading (`XS`–`XXL`), and itemized Bill of Materials (BOM).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | Undo last design modification |
| `Ctrl + Y` / `Cmd + Y` | Redo design modification |
| `R` | Toggle 360° Turntable Auto-Rotation |
| `W` | Toggle 3D Mesh Wireframe Inspector |
| `Esc` | Close active studio drawer or modal |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 🏗️ Architecture Overview

```text
src/
├── canvas/
│   ├── index.jsx          # R3F Canvas, HDRI Environment & ContactShadows
│   ├── Shirt.jsx          # Multi-Decal Mesh + Procedural PBR Fabric Bump Maps
│   ├── CameraRig.jsx      # Damped Camera Angle Presets & 360° Turntable Rig
│   └── Backdrop.jsx       # Dynamic AccumulativeShadows Plane
├── components/
│   ├── ColorPicker.jsx    # Colorway Swatches, PBR Fabric & HDRI Lighting Studio
│   ├── TextStudio.jsx     # Box Logo, Arched Varsity & Esports Jersey Builder
│   ├── AIPicker.jsx       # Dual-Mode Procedural Art & Seamless Pattern Studio
│   ├── DecalTransform.jsx # UV Coordinate, Scale, Rotation & Tiling Controls
│   ├── FilePicker.jsx     # Custom Image Upload & .atelier.json Project I/O
│   ├── LookbookDrawer.jsx # Curated Runway Presets & LocalStorage Wardrobe
│   └── TechPackModal.jsx  # BOM Cost Estimator & Composite Blueprint PNG Exporter
├── config/
│   ├── proceduralGenerator.js # HTML5 Offscreen Canvas Art, Typography & PBR Weave Engine
│   ├── constants.js       # Studio Tabs, Camera Views, Swatches & HDRI Presets
│   ├── helpers.js         # Tech-Pack Blueprint Composer & File Utilities
│   └── motion.js          # Framer Motion Spring Transitions
├── pages/
│   ├── Home.jsx           # Interactive Hero Landing with Live Swatches & Quick Drops
│   └── Customizer.jsx     # Full Studio HUD, Docks, Shortcuts & Modal Orchestrator
└── store/
    └── index.js           # Valtio Reactive State, History Stack & Pricing Engine
```
