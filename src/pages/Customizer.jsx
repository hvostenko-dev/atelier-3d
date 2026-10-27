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
  const [activeEditorTab, setActiveEditorTab] = useState('colorpicker');
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
      // Seamless automatic fallback to client-side Procedural Art Engine so it never fails!
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

  // Global keyboard shortcuts for power users / interview demo
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
          {/* TOP STUDIO HUD BAR */}
          <motion.header
            className="fixed top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none"
            {...fadeAnimation}
          >
            {/* Left: Brand & Editable SKU Title */}
            <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/85 border border-white/15 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl">
              <button
                type="button"
                onClick={() => {
                  state.intro = true;
                }}
                className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center cursor-pointer hover:bg-amber-300 transition"
                title="Return to Landing Screen"
              >
                ←
              </button>
              <div className="hidden sm:block">
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                  {fabricSpec.name}
                </div>
                <div className="text-xs font-bold text-white tracking-wide">
                  {snap.designName}
                </div>
              </div>
            </div>

            {/* Center: Camera View Angle Switcher */}
            <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/85 border border-white/15 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
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
            <div className="pointer-events-auto flex items-center gap-2">
              <div className="flex items-center bg-slate-900/85 border border-white/15 backdrop-blur-xl p-1 rounded-xl shadow-xl">
                <button
                  type="button"
                  disabled={snap.historyIndex <= 0}
                  onClick={undoDesign}
                  title="Undo (Ctrl+Z)"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-35 cursor-pointer"
                >
                  ↶
                </button>
                <button
                  type="button"
                  disabled={snap.historyIndex >= snap.history.length - 1}
                  onClick={redoDesign}
                  title="Redo (Ctrl+Y)"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-35 cursor-pointer"
                >
                  ↷
                </button>
              </div>

              <button
                type="button"
                onClick={handleSurpriseMe}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-slate-100 text-xs font-bold backdrop-blur-xl transition cursor-pointer shadow-xl flex items-center gap-1.5"
                title="Generate random colorway, fabric & procedural emblem"
              >
                <span>🎲</span>
                <span className="hidden md:inline">Inspire Me</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTechPackOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-xl shadow-amber-400/25 flex items-center gap-2"
              >
                <span>📐 Tech-Pack</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-950/15 font-mono">
                  ${unitPrice}
                </span>
              </button>
            </div>
          </motion.header>

          {/* LEFT VERTICAL STUDIO DOCK */}
          <motion.div
            key="custom-dock"
            className="fixed top-0 left-3 z-20 h-screen flex items-center pointer-events-none"
            {...slideAnimation('left')}
          >
            <div className="pointer-events-auto relative flex items-center">
              <div className="editortabs-container">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    isActiveTab={activeEditorTab === tab.name}
                    handleClick={() => handleToggleEditorTab(tab.name)}
                  />
                ))}
              </div>

              {/* Active Floating Studio Panel */}
              {activeEditorTab && (
                <div className="ml-3">
                  {generateTabContent()}
                </div>
              )}
            </div>
          </motion.div>

          {/* TOAST NOTIFICATION */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-slate-900/95 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-2xl backdrop-blur-md"
              >
                ✨ {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTTOM FILTER & LAYER TOGGLE DOCK */}
          <motion.div
            className="filtertabs-container"
            {...slideAnimation('up')}
          >
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-200 border border-white/10 hover:border-amber-400/50 hover:text-amber-300 backdrop-blur-md transition cursor-pointer"
              title="Quick Download 3D Render PNG"
            >
              <span>📸 Snapshot</span>
            </button>
          </motion.div>

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
