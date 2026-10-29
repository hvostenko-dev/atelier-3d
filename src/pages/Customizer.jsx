import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state, {
  FABRIC_TYPES,
  calculateEstimatedPrice,
  pushHistorySnapshot,
  undoDesign,
  redoDesign,
} from '../store';
import { reader, downloadCanvasToImage } from '../config/helpers';
import {
  EditorTabs,
  FilterTabs,
  DecalTypes,
  CAMERA_VIEWS,
  CURATED_SWATCHES,
} from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import {
  generateProceduralArt,
  CURATED_GRAPHICS,
} from '../config/proceduralGenerator';

import {
  AIPicker,
  ColorPicker,
  FilePicker,
  Tab,
  TextStudio,
  DecalTransform,
  LookbookDrawer,
  TechPackModal,
} from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? '' : 'colorpicker'
  );
  const [isTechPackOpen, setIsTechPackOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleToggleEditorTab = (tabName) => {
    setActiveEditorTab((prev) => (prev === tabName ? '' : tabName));
  };

  const handleActiveFilterTab = (tabName) => {
    pushHistorySnapshot();
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !state.isLogoTexture;
        if (state.isLogoTexture) state.cameraView = 'front';
        break;
      case 'backShirt':
        state.isBackTexture = !state.isBackTexture;
        if (state.isBackTexture) state.cameraView = 'back';
        break;
      case 'stylishShirt':
        state.isFullTexture = !state.isFullTexture;
        break;
      case 'wireframeToggle':
        state.wireframe = !state.wireframe;
        break;
      case 'autoRotateToggle':
        state.autoRotate = !state.autoRotate;
        break;
      default:
        break;
    }
  };

  const isFilterTabActive = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        return snap.isLogoTexture;
      case 'backShirt':
        return snap.isBackTexture;
      case 'stylishShirt':
        return snap.isFullTexture;
      case 'wireframeToggle':
        return snap.wireframe;
      case 'autoRotateToggle':
        return snap.autoRotate;
      default:
        return false;
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    if (!decalType || !result) return;

    pushHistorySnapshot();
    state[decalType.stateProperty] = result;

    if (type === 'logo') {
      state.isLogoTexture = true;
      state.cameraView = 'front';
    } else if (type === 'back') {
      state.isBackTexture = true;
      state.cameraView = 'back';
    } else if (type === 'full') {
      state.isFullTexture = true;
    }

    showToast(`Applied ${type.toUpperCase()} graphic to garment`);
  };

  const handleSurpriseMe = () => {
    pushHistorySnapshot();
    const randomColor = CURATED_SWATCHES[Math.floor(Math.random() * CURATED_SWATCHES.length)];
    const fabricKeys = Object.keys(FABRIC_TYPES);
    const randomFabric = fabricKeys[Math.floor(Math.random() * fabricKeys.length)];
    const randomGraphic = CURATED_GRAPHICS[Math.floor(Math.random() * CURATED_GRAPHICS.length)];

    state.color = randomColor;
    state.fabric = randomFabric;
    const artUrl = generateProceduralArt(
      `${randomGraphic.prompt} ${Date.now()}`,
      'logo',
      randomColor
    );
    state.logoDecal = artUrl;
    state.isLogoTexture = true;
    state.cameraView = 'front';
    showToast(`Generated "${randomGraphic.name}" on ${FABRIC_TYPES[randomFabric].name.split(' (')[0]}`);
  };

  const handleSubmit = async (type) => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      showToast('Enter a prompt first');
      return;
    }

    try {
      setGeneratingImg(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });

      const data = await response.json();
      if (!response.ok || !data?.photo) {
        throw new Error(data?.message || 'Remote API unavailable, falling back to Procedural Engine');
      }

      handleDecals(type, `data:image/png;base64,${data.photo}`);
      setPrompt('');
    } catch {
      const fallbackUrl = generateProceduralArt(cleanPrompt, type === 'full' ? 'full' : 'logo', snap.color);
      handleDecals(type, fallbackUrl);
      showToast('Synthesized via built-in Procedural AI Engine');
    } finally {
      setGeneratingImg(false);
    }
  };

  const readFile = (type) => {
    if (!file) {
      showToast('Please select an image file first');
      return;
    }

    reader(file)
      .then((result) => {
        handleDecals(type, result);
      })
      .catch(() => {
        showToast('Could not read the selected file');
      });
  };

  useEffect(() => {
    if (snap.intro) return;

    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoDesign();
        showToast('Undo');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoDesign();
        showToast('Redo');
      } else if (e.key === 'Escape') {
        setActiveEditorTab('');
        setIsTechPackOpen(false);
      } else if (e.key.toLowerCase() === 'r') {
        state.autoRotate = !state.autoRotate;
        showToast(state.autoRotate ? '360° Turntable ON' : '360° Turntable OFF');
      } else if (e.key.toLowerCase() === 'w') {
        state.wireframe = !state.wireframe;
        showToast(state.wireframe ? 'Wireframe Mesh ON' : 'Wireframe Mesh OFF');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [snap.intro, showToast]);

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker onClose={() => setActiveEditorTab('')} />;
      case 'textstudio':
        return <TextStudio onClose={() => setActiveEditorTab('')} />;
      case 'aipicker':
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
            onApplyProcedural={(zone, dataUrl) => handleDecals(zone, dataUrl)}
            onClose={() => setActiveEditorTab('')}
          />
        );
      case 'decaltransform':
        return <DecalTransform onClose={() => setActiveEditorTab('')} />;
      case 'filepicker':
        return (
          <FilePicker
            file={file}
            setFile={setFile}
            readFile={readFile}
            onClose={() => setActiveEditorTab('')}
          />
        );
      case 'lookbook':
        return <LookbookDrawer onClose={() => setActiveEditorTab('')} />;
      default:
        return null;
    }
  };

  const unitPrice = calculateEstimatedPrice(snap);
  const fabricSpec = FABRIC_TYPES[snap.fabric] || FABRIC_TYPES.cotton;

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* BOUNDED FULL-VIEWPORT FLEX WORKSPACE (NEVER OVERLAPS ON LAPTOPS OR PHONES) */}
          <div className="fixed inset-0 z-20 flex flex-col justify-between p-2.5 sm:p-3 lg:p-4 pointer-events-none overflow-hidden">
            {/* ==================== 1. TOP HUD BAR ==================== */}
            <motion.header
              className="w-full shrink-0 pointer-events-none"
              {...fadeAnimation}
            >
              {/* DESKTOP & LAPTOP TOP BAR (md and up) */}
              <div className="hidden md:flex items-center justify-between gap-2 lg:gap-3 w-full">
                {/* Left: Brand & Editable SKU Title */}
                <div className="pointer-events-auto flex items-center gap-2 lg:gap-2.5 bg-slate-900/90 border border-white/15 backdrop-blur-xl px-2.5 lg:px-3.5 py-1.5 rounded-2xl shadow-xl min-w-0 max-w-[190px] lg:max-w-[250px] xl:max-w-xs">
                  <button
                    type="button"
                    onClick={() => {
                      state.intro = true;
                    }}
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center cursor-pointer hover:bg-amber-300 transition shrink-0"
                    title="Return to Landing Screen"
                  >
                    ←
                  </button>
                  <div className="min-w-0 truncate">
                    <div className="text-[9px] lg:text-[10px] font-mono uppercase tracking-widest text-amber-400 truncate">
                      {fabricSpec.name.split(' (')[0]}
                    </div>
                    <div className="text-[11px] lg:text-xs font-bold text-white tracking-wide truncate">
                      {snap.designName}
                    </div>
                  </div>
                </div>

                {/* Center: Camera View Angle Switcher */}
                <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 border border-white/15 backdrop-blur-xl p-1 rounded-2xl shadow-xl overflow-x-auto no-scrollbar max-w-full">
                  {CAMERA_VIEWS.map((view) => {
                    const active = !snap.autoRotate && snap.cameraView === view.id;
                    return (
                      <button
                        key={view.id}
                        type="button"
                        onClick={() => {
                          state.autoRotate = false;
                          state.cameraView = view.id;
                        }}
                        className={`px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-xl text-[11px] lg:text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-amber-400 text-slate-950 shadow'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {view.label}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Undo/Redo, Randomize & Tech-Pack Export */}
                <div className="pointer-events-auto flex items-center gap-1.5 lg:gap-2 shrink-0">
                  <div className="flex items-center bg-slate-900/90 border border-white/15 backdrop-blur-xl p-1 rounded-xl shadow-xl">
                    <button
                      type="button"
                      disabled={snap.historyIndex <= 0}
                      onClick={undoDesign}
                      title="Undo (Ctrl+Z)"
                      className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-35 cursor-pointer"
                    >
                      ↶
                    </button>
                    <button
                      type="button"
                      disabled={snap.historyIndex >= snap.history.length - 1}
                      onClick={redoDesign}
                      title="Redo (Ctrl+Y)"
                      className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-35 cursor-pointer"
                    >
                      ↷
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="px-2.5 lg:px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-100 text-xs font-bold backdrop-blur-xl transition cursor-pointer shadow-xl flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                    title="Generate random colorway, fabric & procedural emblem"
                  >
                    <span>🎲</span>
                    <span className="hidden xl:inline">Inspire Me</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTechPackOpen(true)}
                    className="px-3 lg:px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-xl shadow-amber-400/25 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                  >
                    <span>📐</span>
                    <span className="hidden lg:inline">Tech-Pack</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/15 font-mono">
                      ${unitPrice}
                    </span>
                  </button>
                </div>
              </div>

              {/* MOBILE TOP BAR (< md) */}
              <div className="flex flex-col gap-1.5 md:hidden">
                <div className="flex items-center justify-between w-full pointer-events-auto gap-2">
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-white/15 backdrop-blur-xl px-2.5 py-1.5 rounded-xl shadow-lg min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        state.intro = true;
                      }}
                      className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center cursor-pointer shrink-0"
                      title="Return to Landing Screen"
                    >
                      ←
                    </button>
                    <div className="truncate">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-amber-400 truncate">
                        {fabricSpec.name.split(' (')[0]}
                      </div>
                      <div className="text-[11px] font-bold text-white truncate max-w-[110px]">
                        {snap.designName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center bg-slate-900/90 border border-white/15 backdrop-blur-xl p-0.5 rounded-xl shadow-lg">
                      <button
                        type="button"
                        disabled={snap.historyIndex <= 0}
                        onClick={undoDesign}
                        title="Undo"
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-200 disabled:opacity-35 cursor-pointer"
                      >
                        ↶
                      </button>
                      <button
                        type="button"
                        disabled={snap.historyIndex >= snap.history.length - 1}
                        onClick={redoDesign}
                        title="Redo"
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-200 disabled:opacity-35 cursor-pointer"
                      >
                        ↷
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSurpriseMe}
                      className="w-8 h-8 rounded-xl bg-slate-900/90 border border-white/15 text-slate-100 text-sm flex items-center justify-center backdrop-blur-xl cursor-pointer shadow-lg active:scale-95 transition"
                      title="Inspire Me (Random Preset)"
                    >
                      🎲
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTechPackOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-400/25 flex items-center gap-1 shrink-0"
                    >
                      <span>📐</span>
                      <span className="font-mono">${unitPrice}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-row: Camera View Selector */}
                <div className="flex items-center justify-center pointer-events-auto">
                  <div className="flex items-center gap-1 bg-slate-900/85 border border-white/15 backdrop-blur-xl p-1 rounded-xl shadow-lg max-w-full overflow-x-auto no-scrollbar">
                    {CAMERA_VIEWS.map((view) => {
                      const active = !snap.autoRotate && snap.cameraView === view.id;
                      return (
                        <button
                          key={view.id}
                          type="button"
                          onClick={() => {
                            state.autoRotate = false;
                            state.cameraView = view.id;
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-amber-400 text-slate-950 shadow'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {view.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.header>

            {/* ==================== 2. MIDDLE WORKSPACE (LEFT DOCK + BOUNDED PANEL) ==================== */}
            <motion.div
              key="custom-dock-desktop"
              className="flex-1 min-h-0 w-full hidden md:flex items-center py-2.5 pointer-events-none"
              {...slideAnimation('left')}
            >
              <div className="pointer-events-auto relative flex items-center h-full max-h-full">
                <div className="editortabs-container max-h-full overflow-y-auto no-scrollbar shrink-0">
                  {EditorTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      isActiveTab={activeEditorTab === tab.name}
                      handleClick={() => handleToggleEditorTab(tab.name)}
                    />
                  ))}
                </div>

                {/* Active Floating Studio Panel (Bounded strictly to middle workspace height) */}
                {activeEditorTab && (
                  <div className="ml-2.5 lg:ml-3 h-full max-h-full flex items-center">
                    {generateTabContent()}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ==================== 3. BOTTOM FILTER & TOOLS DOCK ==================== */}
            <motion.div
              className="w-full shrink-0 pointer-events-none"
              {...slideAnimation('up')}
            >
              {/* DESKTOP & LAPTOP BOTTOM FILTER BAR (md and up) */}
              <div className="hidden md:flex items-center justify-center w-full">
                <div className="flex items-center gap-1.5 lg:gap-2 overflow-x-auto no-scrollbar max-w-full py-0.5 px-2 pointer-events-auto">
                  {FilterTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      isFilterTab
                      isActiveTab={isFilterTabActive(tab.name)}
                      handleClick={() => handleActiveFilterTab(tab.name)}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      downloadCanvasToImage('atelier-3d-snapshot.png');
                      showToast('Downloaded 3D Snapshot PNG');
                    }}
                    className="flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-xs font-semibold bg-slate-900/85 text-slate-200 border border-white/15 hover:border-amber-400/50 hover:text-amber-300 backdrop-blur-md transition cursor-pointer shrink-0 whitespace-nowrap"
                    title="Quick Download 3D Render PNG"
                  >
                    <span>📸 Snapshot</span>
                  </button>
                </div>
              </div>

              {/* MOBILE BOTTOM CONTROLS & DOCK (< md) */}
              <div className="flex flex-col items-center gap-2 md:hidden">
                {/* Upper Pill Bar: Layers & Camera Filter Toggles */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full px-2 py-1 pointer-events-auto bg-slate-900/85 border border-white/15 rounded-full backdrop-blur-md shadow-xl">
                  {FilterTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      isFilterTab
                      isActiveTab={isFilterTabActive(tab.name)}
                      handleClick={() => handleActiveFilterTab(tab.name)}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      downloadCanvasToImage('atelier-3d-snapshot.png');
                      showToast('Downloaded 3D Snapshot PNG');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-slate-900/85 text-slate-200 border border-white/10 hover:border-amber-400/50 hover:text-amber-300 backdrop-blur-md transition cursor-pointer shrink-0 whitespace-nowrap"
                    title="Quick Download 3D Render PNG"
                  >
                    <span>📸 Snapshot</span>
                  </button>
                </div>

                {/* Primary Lower Dock: Editor Tools */}
                <div className="flex items-center justify-around w-full max-w-sm pointer-events-auto bg-slate-900/90 border border-white/15 backdrop-blur-xl rounded-2xl py-1.5 px-2 shadow-2xl">
                  {EditorTabs.map((tab) => {
                    const isActive = activeEditorTab === tab.name;
                    return (
                      <Tab
                        key={tab.name}
                        tab={tab}
                        isActiveTab={isActive}
                        handleClick={() => handleToggleEditorTab(tab.name)}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* MOBILE BOTTOM SHEET FOR ACTIVE STUDIO PANEL */}
          <AnimatePresence>
            {activeEditorTab && (
              <>
                <motion.div
                  key="bottom-sheet-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveEditorTab('')}
                  className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-30 md:hidden"
                />

                <motion.div
                  key="bottom-sheet-panel"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="fixed inset-x-0 bottom-0 z-40 max-h-[78dvh] w-full bg-slate-900/95 border-t border-white/15 backdrop-blur-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden md:hidden"
                >
                  <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-2 shrink-0" />
                  <div className="flex-1 overflow-y-auto studio-scroll px-3 pb-5">
                    {generateTabContent()}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* TOAST NOTIFICATION */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-24 md:bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-2xl backdrop-blur-md whitespace-nowrap pointer-events-none"
              >
                ✨ {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* PRODUCTION TECH-PACK MODAL */}
          <TechPackModal
            isOpen={isTechPackOpen}
            onClose={() => setIsTechPackOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
