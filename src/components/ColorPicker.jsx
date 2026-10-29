import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';

import state, { FABRIC_TYPES, pushHistorySnapshot } from '../store';
import { CURATED_SWATCHES, STUDIO_ENVIRONMENTS } from '../config/constants';

const ColorPicker = ({ onClose }) => {
  const snap = useSnapshot(state);
  const [showSpectrum, setShowSpectrum] = useState(false);

  const handleSelectColor = (hex) => {
    pushHistorySnapshot();
    state.color = hex;
  };

  const handleSelectFabric = (fabricId) => {
    pushHistorySnapshot();
    state.fabric = fabricId;
  };

  return (
    <div className="studio-panel studio-scroll w-full md:w-[305px] lg:w-[325px] max-h-[72dvh] md:max-h-full overflow-y-auto p-3.5 rounded-2xl flex flex-col gap-3 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
        <div>
          <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white">
            Colorway & Textile PBR
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400">
            Configure garment pigment, weave & studio lighting
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      {/* Curated Swatches */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Atelier Palette
          </span>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            {snap.color.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {CURATED_SWATCHES.map((hex) => {
            const isSelected = snap.color.toLowerCase() === hex.toLowerCase();
            return (
              <button
                key={hex}
                type="button"
                title={hex}
                onClick={() => handleSelectColor(hex)}
                className={`w-6 h-6 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-lg transition-transform cursor-pointer border ${
                  isSelected
                    ? 'scale-110 ring-2 ring-amber-400 border-white'
                    : 'border-white/20 hover:scale-105'
                }`}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowSpectrum(!showSpectrum)}
          className="mt-2 w-full py-1.5 px-3 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 flex items-center justify-between cursor-pointer transition"
        >
          <span>{showSpectrum ? 'Hide Custom Spectrum Picker' : 'Open Custom HEX / RGB Spectrum'}</span>
          <span className="text-amber-400">{showSpectrum ? '▲' : '▼'}</span>
        </button>

        {showSpectrum && (
          <div className="mt-2 flex justify-center w-full overflow-x-hidden">
            <SketchPicker
              color={snap.color}
              disableAlpha
              onChange={(color) => {
                state.color = color.hex;
              }}
              onChangeComplete={() => pushHistorySnapshot()}
            />
          </div>
        )}
      </div>

      {/* PBR Fabric Selector */}
      <div className="border-t border-white/10 pt-2.5 shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
          PBR Material & Weave Simulation
        </span>
        <div className="flex flex-col gap-1.5">
          {Object.values(FABRIC_TYPES).map((fab) => {
            const active = snap.fabric === fab.id;
            return (
              <button
                key={fab.id}
                type="button"
                onClick={() => handleSelectFabric(fab.id)}
                className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between shrink-0 ${
                  active
                    ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold truncate">
                    {fab.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {fab.badge} • Roughness {fab.roughness}
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                  ${fab.basePrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Studio Environment & Lighting */}
      <div className="border-t border-white/10 pt-2.5 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            HDRI Studio Rig
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {Math.round((snap.lightIntensity || 0.65) * 100)}% Lux
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {STUDIO_ENVIRONMENTS.map((env) => (
            <button
              key={env.id}
              type="button"
              onClick={() => {
                state.envPreset = env.id;
              }}
              className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-medium border transition cursor-pointer truncate ${
                snap.envPreset === env.id
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {env.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="shrink-0">Key Light</span>
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.05"
            value={snap.lightIntensity || 0.65}
            onChange={(e) => {
              state.lightIntensity = parseFloat(e.target.value);
            }}
            className="flex-1 accent-amber-400 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

export default ColorPicker;
