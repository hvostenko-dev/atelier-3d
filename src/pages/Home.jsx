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
        <motion.section className="home studio-scroll" {...slideAnimation('left')}>
          {/* Top Brand Header */}
          <motion.header
            className="flex items-center justify-between w-full max-w-xl shrink-0"
            {...slideAnimation('down')}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-950/55 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none px-3 py-2 lg:p-0 rounded-2xl border border-white/10 lg:border-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm sm:text-base lg:text-lg shadow-lg shadow-amber-400/25 shrink-0">
                A3
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black tracking-widest uppercase text-white flex items-center gap-1.5 sm:gap-2">
                  <span>ATELIER 3D</span>
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    v2.0 STUDIO
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate sm:whitespace-normal">
                  Real-Time WebGL Apparel & PBR Textile Engine
                </p>
              </div>
            </div>
          </motion.header>

          {/* Hero Main Content */}
          <motion.div
            className="home-content w-full max-w-xl bg-slate-950/60 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 sm:p-5 lg:p-0 rounded-3xl border border-white/10 lg:border-0 mt-auto lg:my-auto"
            {...headContainerAnimation}
          >
            <motion.div {...headTextAnimation}>
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 backdrop-blur-md max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="truncate">PBR Shaders • Procedural AI Art • Tech-Pack Export</span>
              </div>
              <h1 className="head-text">
                CRAFT <br className="lg:block hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500">
                  FUTURE
                </span>{' '}
                <br className="lg:block hidden" />
                APPAREL.
              </h1>
            </motion.div>

            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-3 sm:gap-3.5 lg:gap-4 max-w-xl"
            >
              <p className="font-normal text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                Engineer custom streetwear, esports jerseys, and luxury essentials in real-time 3D.
                Simulate <strong>6 physical textile weaves</strong>, synthesize{' '}
                <strong>procedural graphics & typography</strong> on front & back zones, and export
                manufacturing-ready <strong>production tech-packs</strong>.
              </p>

              {/* Live Interactive Swatch Bar on Hero */}
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 border border-white/15 px-3 py-2 rounded-2xl w-fit backdrop-blur-md max-w-full">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
                  Live Dye:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
                  {HERO_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => {
                        state.color = hex;
                      }}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform cursor-pointer border shrink-0 ${
                        snap.color.toLowerCase() === hex.toLowerCase()
                          ? 'scale-110 ring-2 ring-amber-400 border-white'
                          : 'border-white/25 hover:scale-110'
                      }`}
                      style={{ backgroundColor: hex }}
                      title={`Preview ${hex}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 border-l border-white/10 pl-2.5 hidden sm:inline shrink-0">
                  {currentFabric.name.split(' (')[0]}
                </span>
              </div>

              {/* Primary CTA & Quick Lookbook Starters */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 w-full pt-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    pushHistorySnapshot();
                    state.intro = false;
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide uppercase transition-all cursor-pointer shadow-xl shadow-amber-400/25 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <span>Enter 3D Design Studio</span>
                  <span>→</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuickPresetLaunch(LOOKBOOK_PRESETS[0])}
                    className="flex-1 sm:flex-initial px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition cursor-pointer backdrop-blur-md text-center whitespace-nowrap"
                  >
                    ⚡ Cyber Drop
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPresetLaunch(LOOKBOOK_PRESETS[2])}
                    className="flex-1 sm:flex-initial px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition cursor-pointer backdrop-blur-md text-center whitespace-nowrap"
                  >
                    🏆 Jersey #07
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom spacer for clean flex-between balance on tall screens */}
          <div className="hidden lg:block h-1 shrink-0" />
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Home;
