import React from 'react';
import { useSnapshot } from 'valtio';

import state, { pushHistorySnapshot } from '../store';
import { generateTextDecalTexture } from '../config/proceduralGenerator';

const FONT_OPTIONS = [
  { label: 'Varsity Impact', value: 'Impact, "Arial Black", sans-serif' },
  { label: 'Modern Geometric', value: '"Inter", system-ui, sans-serif' },
  { label: 'Cyber Monospace', value: '"Courier New", monospace' },
  { label: 'Luxury Editorial', value: 'Georgia, "Times New Roman", serif' },
];

const BG_STYLES = [
  { id: 'box', label: 'Street Box' },
  { id: 'jersey', label: 'Jersey #99' },
  { id: 'arched', label: 'Collegiate Arc' },
  { id: 'badge', label: 'Hex Crest' },
  { id: 'circle', label: 'Seal Stamp' },
  { id: 'none', label: 'Clean Type' },
];

const TextStudio = ({ onClose }) => {
  const snap = useSnapshot(state);
  const tc = snap.textConfig;

  const updateField = (key, value) => {
    state.textConfig[key] = value;
  };

  const applyTypographyToGarment = (zone = tc.targetZone) => {
    pushHistorySnapshot();
    const dataUrl = generateTextDecalTexture({
      text: tc.text,
      subtext: tc.subtext,
      numberText: tc.numberText,
      fontFamily: tc.fontFamily,
      textColor: tc.textColor,
      accentColor: tc.accentColor,
      bgStyle: tc.bgStyle,
      strokeWidth: tc.strokeWidth,
      strokeColor: tc.strokeColor,
      letterSpacing: tc.letterSpacing,
      fontSize: tc.fontSize,
    });

    if (zone === 'back') {
      state.backDecal = dataUrl;
      state.isBackTexture = true;
      state.cameraView = 'back';
    } else {
      state.logoDecal = dataUrl;
      state.isLogoTexture = true;
      state.cameraView = 'front';
    }
  };

  return (
    <div className="studio-panel w-[330px] max-h-[82vh] overflow-y-auto p-4 rounded-2xl flex flex-col gap-3.5 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-white">
            Typography & Jersey Studio
          </h3>
          <p className="text-[11px] text-slate-400">
            Generate box logos, varsity arches & back numbers
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

      {/* Style Mode Selector */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
          Layout Template
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {BG_STYLES.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => updateField('bgStyle', st.id)}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                tc.bgStyle === st.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Inputs */}
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">
            Primary Headline / Player Name
          </label>
          <input
            type="text"
            maxLength={18}
            value={tc.text}
            onChange={(e) => updateField('text', e.target.value)}
            placeholder="ATELIER"
            className="w-full px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/15 text-xs text-white font-bold tracking-wider focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="text-[11px] text-slate-400 block mb-1">
              Subtext / Edition Tag
            </label>
            <input
              type="text"
              maxLength={26}
              value={tc.subtext}
              onChange={(e) => updateField('subtext', e.target.value)}
              placeholder="EST. 2026 // STUDIO"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Jersey #
            </label>
            <input
              type="text"
              maxLength={3}
              value={tc.numberText}
              onChange={(e) => updateField('numberText', e.target.value)}
              placeholder="26"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/15 text-xs text-amber-400 font-mono font-bold text-center focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-[11px] text-slate-400 block mb-1">
          Typeface Family
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => updateField('fontFamily', f.value)}
              className={`py-1.5 px-2 rounded-lg text-[11px] border transition cursor-pointer truncate ${
                tc.fontFamily === f.value
                  ? 'bg-white/15 border-amber-400 text-white font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
              style={{ fontFamily: f.value }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors & Sliders */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <label className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
          <span className="text-slate-300">Text Ink</span>
          <input
            type="color"
            value={tc.textColor}
            onChange={(e) => updateField('textColor', e.target.value)}
            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
          />
        </label>
        <label className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
          <span className="text-slate-300">Badge / Accent</span>
          <input
            type="color"
            value={tc.accentColor}
            onChange={(e) => updateField('accentColor', e.target.value)}
            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Font Size ({tc.fontSize}px)</span>
          <input
            type="range"
            min="60"
            max="150"
            value={tc.fontSize}
            onChange={(e) => updateField('fontSize', Number(e.target.value))}
            className="w-36 accent-amber-400 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Outline Stroke ({tc.strokeWidth}px)</span>
          <input
            type="range"
            min="0"
            max="10"
            value={tc.strokeWidth}
            onChange={(e) => updateField('strokeWidth', Number(e.target.value))}
            className="w-36 accent-amber-400 cursor-pointer"
          />
        </label>
      </div>

      {/* Target Zone Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => applyTypographyToGarment('front')}
          className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-amber-400/20"
        >
          Apply to Front
        </button>
        <button
          type="button"
          onClick={() => applyTypographyToGarment('back')}
          className="py-2 px-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-sky-400/20"
        >
          Apply to Back
        </button>
      </div>
    </div>
  );
};

export default TextStudio;
