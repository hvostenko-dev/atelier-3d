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
    <div className="studio-panel studio-scroll w-full md:w-[310px] lg:w-[330px] max-h-[72dvh] md:max-h-full overflow-y-auto p-3.5 rounded-2xl flex flex-col gap-3 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
        <div>
          <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white">
            AI & Procedural Pattern Studio
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400">
            Instant client-side generative art & seamless print engine
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

      {/* Engine Mode Switcher */}
      <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10 shrink-0">
        <button
          type="button"
          onClick={() => setEngineMode('procedural')}
          className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer ${
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
          className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer ${
            engineMode === 'api'
              ? 'bg-sky-400 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🌐 Remote DALL·E API
        </button>
      </div>

      {/* Prompt Input */}
      <div className="shrink-0">
        <label className="text-[11px] text-slate-400 block mb-1">
          Creative Prompt / Style Seed
        </label>
        <textarea
          placeholder="Describe style, e.g. 'Cyberpunk Neon Sun', 'Bauhaus Geometric'..."
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-xl bg-slate-900/90 border border-white/15 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
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
        <div className="grid grid-cols-3 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleInstantSynthesize('logo')}
            className="py-2 px-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] sm:text-[11px] transition cursor-pointer text-center whitespace-nowrap"
          >
            Front Crest
          </button>
          <button
            type="button"
            onClick={() => handleInstantSynthesize('back')}
            className="py-2 px-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-[10px] sm:text-[11px] transition cursor-pointer text-center whitespace-nowrap"
          >
            Back Graphic
          </button>
          <button
            type="button"
            onClick={() => handleInstantSynthesize('full')}
            className="py-2 px-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-[10px] sm:text-[11px] transition cursor-pointer text-center whitespace-nowrap"
          >
            Full Pattern
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <button
            type="button"
            disabled={generatingImg}
            onClick={() => handleSubmit('logo')}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {generatingImg ? 'Requesting...' : 'API Logo'}
          </button>
          <button
            type="button"
            disabled={generatingImg}
            onClick={() => handleSubmit('full')}
            className="py-2 px-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {generatingImg ? 'Requesting...' : 'API Full'}
          </button>
        </div>
      )}

      {/* Curated Preset Library */}
      <div className="border-t border-white/10 pt-2.5 shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
          1-Click Badges & All-Over Prints
        </span>
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5">
          {CURATED_GRAPHICS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectCurated(item)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition cursor-pointer flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.previewColor }}
                />
                <span className="text-[9px] uppercase font-mono px-1 rounded bg-white/10 text-slate-300 truncate">
                  {item.category}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-100 leading-tight truncate">
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
