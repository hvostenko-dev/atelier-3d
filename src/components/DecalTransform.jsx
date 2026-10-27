import React from 'react';
import { useSnapshot } from 'valtio';

import state, { PLACEMENT_PRESETS, pushHistorySnapshot } from '../store';

const DecalTransform = ({ onClose }) => {
  const snap = useSnapshot(state);

  const applyPlacementPreset = (presetKey) => {
    const preset = PLACEMENT_PRESETS[presetKey];
    if (!preset) return;
    pushHistorySnapshot();
    state.logoPlacementPreset = presetKey;
    state.logoPosition = [...preset.position];
    state.logoScale = preset.scale;
    state.logoRotation = 0;
    state.isLogoTexture = true;
    state.cameraView = 'front';
  };

  const updateFrontCoord = (index, val) => {
    const next = [...snap.logoPosition];
    next[index] = val;
    state.logoPosition = next;
  };

  const updateBackCoord = (index, val) => {
    const next = [...snap.backPosition];
    next[index] = val;
    state.backPosition = next;
  };

  return (
    <div className="studio-panel w-[330px] max-h-[82vh] overflow-y-auto p-4 rounded-2xl flex flex-col gap-4 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-white">
            Precision Decal Placement
          </h3>
          <p className="text-[11px] text-slate-400">
            Adjust UV coordinates, scale, rotation & tiling
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

      {/* Front Placement Presets */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-2">
          Front Print Zone Presets
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.values(PLACEMENT_PRESETS).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPlacementPreset(preset.id)}
              className={`py-1.5 px-2.5 rounded-lg text-[11px] font-medium border text-left transition cursor-pointer ${
                snap.logoPlacementPreset === preset.id
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Front Decal Fine-Tuning */}
      <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Front Graphic Transform
          </span>
          <button
            type="button"
            onClick={() => applyPlacementPreset('center')}
            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Reset Front
          </button>
        </div>

        <label className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Horizontal X ({snap.logoPosition[0].toFixed(2)})</span>
          <input
            type="range"
            min="-0.12"
            max="0.12"
            step="0.005"
            value={snap.logoPosition[0]}
            onChange={(e) => updateFrontCoord(0, parseFloat(e.target.value))}
            className="w-36 accent-amber-400 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Vertical Y ({snap.logoPosition[1].toFixed(2)})</span>
          <input
            type="range"
            min="-0.22"
            max="0.14"
            step="0.005"
            value={snap.logoPosition[1]}
            onChange={(e) => updateFrontCoord(1, parseFloat(e.target.value))}
            className="w-36 accent-amber-400 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Graphic Scale ({Math.round(snap.logoScale * 100)}%)</span>
          <input
            type="range"
            min="0.06"
            max="0.32"
            step="0.005"
            value={snap.logoScale}
            onChange={(e) => {
              state.logoScale = parseFloat(e.target.value);
            }}
            className="w-36 accent-amber-400 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Rotation ({Math.round((snap.logoRotation * 180) / Math.PI)}°)</span>
          <input
            type="range"
            min="-3.14"
            max="3.14"
            step="0.05"
            value={snap.logoRotation}
            onChange={(e) => {
              state.logoRotation = parseFloat(e.target.value);
            }}
            className="w-36 accent-amber-400 cursor-pointer"
          />
        </label>
      </div>

      {/* Back Decal Fine-Tuning */}
      <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            Back Jersey / Print Transform
          </span>
          <button
            type="button"
            onClick={() => {
              state.isBackTexture = true;
              state.cameraView = 'back';
            }}
            className="text-[10px] text-sky-300 hover:text-white underline cursor-pointer"
          >
            Focus Back View
          </button>
        </div>

        <label className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Back Vertical Y ({snap.backPosition[1].toFixed(2)})</span>
          <input
            type="range"
            min="-0.20"
            max="0.14"
            step="0.005"
            value={snap.backPosition[1]}
            onChange={(e) => updateBackCoord(1, parseFloat(e.target.value))}
            className="w-36 accent-sky-400 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Back Scale ({Math.round(snap.backScale * 100)}%)</span>
          <input
            type="range"
            min="0.08"
            max="0.34"
            step="0.005"
            value={snap.backScale}
            onChange={(e) => {
              state.backScale = parseFloat(e.target.value);
            }}
            className="w-36 accent-sky-400 cursor-pointer"
          />
        </label>
      </div>

      {/* All-Over Sublimation Pattern Tiling */}
      <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          All-Over Pattern Tiling
        </span>
        <label className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Pattern Density ({snap.textureRepeat}x Repeat)</span>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={snap.textureRepeat}
            onChange={(e) => {
              state.textureRepeat = Number(e.target.value);
              state.isFullTexture = true;
            }}
            className="w-36 accent-emerald-400 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

export default DecalTransform;
