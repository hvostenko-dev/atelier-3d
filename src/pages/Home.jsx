import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state, {
  FABRIC_TYPES,
  LOOKBOOK_PRESETS,
  PLACEMENT_PRESETS,
  pushHistorySnapshot,
} from '../store';
import {
  generateProceduralArt,
  generateTextDecalTexture,
} from '../config/proceduralGenerator';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
} from '../config/motion';

const HERO_SWATCHES = ['#0F172A', '#EFBD48', '#DC2626', '#059669', '#2563EB', '#7C3AED'];

const Home = () => {
  const snap = useSnapshot(state);
  const currentFabric = FABRIC_TYPES[snap.fabric] || FABRIC_TYPES.cotton;

  const handleQuickPresetLaunch = (preset) => {
    pushHistorySnapshot();
    state.designName = preset.name.toUpperCase();
    state.color = preset.color;
    state.fabric = preset.fabric;
    state.isLogoTexture = preset.isLogoTexture;
    state.isBackTexture = preset.isBackTexture;
    state.isFullTexture = preset.isFullTexture;

    const placement = PLACEMENT_PRESETS[preset.placementPreset] || PLACEMENT_PRESETS.center;
    state.logoPlacementPreset = placement.id;
    state.logoPosition = [...placement.position];
    state.logoScale = placement.scale;

    if (preset.logoPrompt) {
      state.logoDecal = generateProceduralArt(preset.logoPrompt, 'logo', preset.color);
    }
    if (preset.fullPrompt) {
      state.fullDecal = generateProceduralArt(preset.fullPrompt, 'full', preset.color);
    }
    if (preset.backTextConfig) {
      state.backDecal = generateTextDecalTexture({
        ...state.textConfig,
        ...preset.backTextConfig,
      });
    }
    state.intro = false;
  };

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          {/* Top Brand Header */}
          <motion.header
            className="flex items-center justify-between w-full max-w-xl"
            {...slideAnimation('down')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shadow-amber-400/25">
                A3
              </div>
              <div>
                <div className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
                  <span>ATELIER 3D</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    v2.0 STUDIO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Real-Time WebGL Apparel & PBR Textile Engine
                </p>
              </div>
            </div>
          </motion.header>

          {/* Hero Main Content */}
          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 text-xs font-medium mb-4 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>PBR Shaders • Procedural AI Art • Tech-Pack Export</span>
              </div>
              <h1 className="head-text">
                CRAFT <br className="xl:block hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500">
                  FUTURE
                </span>{' '}
                <br className="xl:block hidden" />
                APPAREL.
              </h1>
            </motion.div>

            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-5 max-w-lg"
            >
              <p className="font-normal text-slate-300 text-sm sm:text-base leading-relaxed">
                Engineer custom streetwear, esports jerseys, and luxury essentials in real-time 3D.
                Simulate <strong>6 physical textile weaves</strong>, synthesize{' '}
                <strong>procedural graphics & typography</strong> on front & back zones, and export
                manufacturing-ready <strong>production tech-packs</strong>.
              </p>

              {/* Live Interactive Swatch Bar on Hero */}
              <div className="flex items-center gap-3 bg-slate-900/75 border border-white/10 px-3.5 py-2.5 rounded-2xl w-fit backdrop-blur-md">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Live Dye:
                </span>
                <div className="flex items-center gap-1.5">
                  {HERO_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => {
                        state.color = hex;
                      }}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                        snap.color.toLowerCase() === hex.toLowerCase()
                          ? 'scale-125 ring-2 ring-amber-400 border-white'
                          : 'border-white/25 hover:scale-110'
                      }`}
                      style={{ backgroundColor: hex }}
                      title={`Preview ${hex}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-slate-400 border-l border-white/10 pl-3 hidden sm:inline">
                  {currentFabric.name.split(' (')[0]}
                </span>
              </div>

              {/* Primary CTA & Quick Lookbook Starters */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    pushHistorySnapshot();
                    state.intro = false;
                  }}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-wide uppercase transition-all cursor-pointer shadow-xl shadow-amber-400/25 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  <span>Enter 3D Design Studio</span>
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPresetLaunch(LOOKBOOK_PRESETS[0])}
                  className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-100 font-semibold text-xs uppercase tracking-wider transition cursor-pointer backdrop-blur-md"
                >
                  ⚡ Load Cyber Drop
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPresetLaunch(LOOKBOOK_PRESETS[2])}
                  className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-100 font-semibold text-xs uppercase tracking-wider transition cursor-pointer backdrop-blur-md"
                >
                  🏆 Esports Jersey #07
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Home;
