import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state, { pushHistorySnapshot } from '../store';
import { generateProceduralArt, CURATED_GRAPHICS } from '../config/proceduralGenerator';

const PROMPT_CHIPS = [
  'Cyberpunk Neon Sun',
  'Luxury Gold Minimal',
  'Kanagawa Ocean Wave',
  'Topographic Contour',
  'Bauhaus Geometric',
  'Acid Toxic Rave',
];

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit, onApplyProcedural, onClose }) => {
  const snap = useSnapshot(state);
  const [engineMode, setEngineMode] = useState('procedural'); // 'procedural' | 'api'

  const handleInstantSynthesize = (targetZone) => {
    const activePrompt = (prompt || '').trim() || 'Cyberpunk Neon Studio';
    pushHistorySnapshot();
    const mode = targetZone === 'full' ? 'full' : 'logo';
    const dataUrl = generateProceduralArt(activePrompt, mode, snap.color);
    onApplyProcedural(targetZone, dataUrl);
  };

  const handleSelectCurated = (item) => {
    pushHistorySnapshot();
    setPrompt(item.prompt);
    const dataUrl = generateProceduralArt(item.prompt, item.category, snap.color);
    onApplyProcedural(item.category, dataUrl);
  };

  return (
    <div className="studio-panel w-[335px] max-h-[82vh] overflow-y-auto p-4 rounded-2xl flex flex-col gap-3.5 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-white">
            AI & Procedural Pattern Studio
          </h3>
          <p className="text-[11px] text-slate-400">
            Instant client-side generative art & seamless print engine
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

      {/* Engine Mode Switcher */}
      <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={() => setEngineMode('procedural')}
          className={`py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
            engineMode === 'procedural'
              ? 'bg-amber-400 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚡ Instant Procedural
        </button>
        <button
          type="button"
          onClick={() => setEngineMode('api')}
          className={`py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
            engineMode === 'api'
              ? 'bg-sky-400 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🌐 Remote DALL·E API
        </button>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="text-[11px] text-slate-400 block mb-1">
          Creative Prompt / Style Seed
        </label>
        <textarea
          placeholder="Describe style, e.g. 'Cyberpunk Neon Sun', 'Bauhaus Geometric', 'Topographic Contour'..."
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-xl bg-slate-900/90 border border-white/15 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
        />

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setPrompt(chip)}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-slate-300 cursor-pointer transition"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {engineMode === 'procedural' ? (
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleInstantSynthesize('logo')}
            className="py-2 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition cursor-pointer"
          >
            Front Crest
          </button>
          <button
            type="button"
            onClick={() => handleInstantSynthesize('back')}
            className="py-2 px-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-[11px] transition cursor-pointer"
          >
            Back Graphic
          </button>
          <button
            type="button"
            onClick={() => handleInstantSynthesize('full')}
            className="py-2 px-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-[11px] transition cursor-pointer"
          >
            Full Pattern
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={generatingImg}
            onClick={() => handleSubmit('logo')}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            {generatingImg ? 'Requesting...' : 'API Logo'}
          </button>
          <button
            type="button"
            disabled={generatingImg}
            onClick={() => handleSubmit('full')}
            className="py-2 px-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            {generatingImg ? 'Requesting...' : 'API Full Pattern'}
          </button>
        </div>
      )}

      {/* Curated Preset Library */}
      <div className="border-t border-white/10 pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-2">
          1-Click Studio Badges & All-Over Prints
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {CURATED_GRAPHICS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectCurated(item)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition cursor-pointer flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.previewColor }}
                />
                <span className="text-[9px] uppercase font-mono px-1 rounded bg-white/10 text-slate-300">
                  {item.category}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-100 leading-tight truncate">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPicker;
