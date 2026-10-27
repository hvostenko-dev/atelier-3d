import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state, {
  LOOKBOOK_PRESETS,
  PLACEMENT_PRESETS,
  pushHistorySnapshot,
  saveDesignToWardrobe,
  deleteDesignFromWardrobe,
  applySnapshot,
} from '../store';
import {
  generateProceduralArt,
  generateTextDecalTexture,
} from '../config/proceduralGenerator';

const LookbookDrawer = ({ onClose }) => {
  const snap = useSnapshot(state);
  const [customTitle, setCustomTitle] = useState('');

  const handleApplyLookbook = (preset) => {
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
    state.logoRotation = 0;

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
  };

  const handleSaveCurrent = (e) => {
    e.preventDefault();
    saveDesignToWardrobe(customTitle.trim() || state.designName);
    setCustomTitle('');
  };

  return (
    <div className="studio-panel w-[340px] max-h-[82vh] overflow-y-auto p-4 rounded-2xl flex flex-col gap-4 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-white">
            Lookbook & Saved Wardrobe
          </h3>
          <p className="text-[11px] text-slate-400">
            Load curated runway drops or save your custom builds
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        )}
      </div>

      {/* Curated Lookbook Presets */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block mb-2">
          Signature Lookbook Collections
        </span>
        <div className="flex flex-col gap-2">
          {LOOKBOOK_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyLookbook(preset)}
              className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-lg border border-white/25 shrink-0 shadow-inner"
                  style={{ backgroundColor: preset.color }}
                />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {preset.subtitle}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                Load
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Save to Personal Wardrobe */}
      <div className="border-t border-white/10 pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 block mb-2">
          My Local Wardrobe ({snap.savedWardrobe.length})
        </span>

        <form onSubmit={handleSaveCurrent} className="flex gap-1.5 mb-3">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Name current drop..."
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/15 text-xs text-white focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs cursor-pointer transition"
          >
            + Save
          </button>
        </form>

        {snap.savedWardrobe.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-3 bg-white/5 rounded-xl border border-white/5">
            No saved builds yet. Save your first custom drop above!
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
            {snap.savedWardrobe.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    pushHistorySnapshot();
                    applySnapshot(item.snapshot);
                  }}
                  className="flex items-center gap-2 text-left flex-1 cursor-pointer"
                >
                  <span
                    className="w-5 h-5 rounded border border-white/20 shrink-0"
                    style={{ backgroundColor: item.snapshot?.color || '#0F172A' }}
                  />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Saved at {item.createdAt}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteDesignFromWardrobe(item.id)}
                  className="text-slate-400 hover:text-rose-400 px-1.5 py-1 text-xs cursor-pointer"
                  title="Delete saved drop"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LookbookDrawer;
