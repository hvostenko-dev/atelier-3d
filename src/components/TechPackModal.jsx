import React from 'react';
import { useSnapshot } from 'valtio';

import state, { FABRIC_TYPES, calculateEstimatedPrice } from '../store';
import { downloadCanvasToImage, downloadTechPackSpecSheet } from '../config/helpers';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FITS = ['Oversized Boxy', 'Regular Athletic', 'Relaxed Drop-Shoulder'];

const TechPackModal = ({ isOpen, onClose }) => {
  const snap = useSnapshot(state);
  if (!isOpen) return null;

  const fabricSpec = FABRIC_TYPES[snap.fabric] || FABRIC_TYPES.cotton;
  const totalUnitPrice = calculateEstimatedPrice(snap);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="studio-panel w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl p-4 sm:p-6 border border-white/15 text-slate-100 shadow-2xl flex flex-col gap-3.5 sm:gap-5 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
              Manufacturing Ready // BOM & Spec Sheet
            </span>
            <h2 className="text-base sm:text-xl font-black tracking-tight text-white mt-1.5">
              Production Tech-Pack & Export Studio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        {/* Design Name & Fit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Collection / SKU Title
            </label>
            <input
              type="text"
              value={snap.designName}
              onChange={(e) => {
                state.designName = e.target.value;
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Garment Silhouette Cut
            </label>
            <select
              value={snap.fitType}
              onChange={(e) => {
                state.fitType = e.target.value;
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {FITS.map((fit) => (
                <option key={fit} value={fit}>
                  {fit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Size Grading Matrix */}
        <div>
          <label className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">
            Sample Size Grading
          </label>
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => {
                  state.selectedSize = sz;
                }}
                className={`py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition cursor-pointer text-center ${
                  snap.selectedSize === sz
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Bill of Materials (BOM) Breakdown */}
        <div className="rounded-xl bg-slate-900/90 border border-white/10 p-3 sm:p-4 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Base Garment ({fabricSpec.name})</span>
            <span className="font-mono font-bold text-white">${fabricSpec.basePrice}.00</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Primary Pigment Swatch ({snap.color.toUpperCase()})</span>
            <span className="font-mono text-emerald-400">INCLUDED</span>
          </div>
          {snap.isLogoTexture && (
            <div className="flex items-center justify-between text-slate-300">
              <span>Front High-Density DTG Print</span>
              <span className="font-mono font-bold text-white">+$12.00</span>
            </div>
          )}
          {snap.isBackTexture && (
            <div className="flex items-center justify-between text-slate-300">
              <span>Back Jersey / Graphic Print</span>
              <span className="font-mono font-bold text-white">+$16.00</span>
            </div>
          )}
          {snap.isFullTexture && (
            <div className="flex items-center justify-between text-slate-300">
              <span>All-Over Sublimation ({snap.textureRepeat}x)</span>
              <span className="font-mono font-bold text-white">+$24.00</span>
            </div>
          )}

          <div className="border-t border-white/10 pt-2.5 mt-1 flex items-center justify-between text-xs sm:text-sm font-black text-amber-400">
            <span>ESTIMATED UNIT COST</span>
            <span className="font-mono text-base sm:text-lg">${totalUnitPrice}.00 USD</span>
          </div>
        </div>

        {/* Export Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              downloadTechPackSpecSheet(snap);
              onClose();
            }}
            className="py-2.5 sm:py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2"
          >
            <span>📐 Full Tech-Pack PNG</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadCanvasToImage('atelier-3d-viewport.png');
              onClose();
            }}
            className="py-2.5 sm:py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📸 3D Viewport PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechPackModal;
