import React, { useState } from 'react';
import { applySnapshot, pushHistorySnapshot } from '../store';
import { exportDesignAsJson } from '../config/helpers';

const FilePicker = ({ file, setFile, readFile, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileSelect = (selected) => {
    if (!selected) return;
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleImportJson = (e) => {
    const jsonFile = e.target.files?.[0];
    if (!jsonFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        pushHistorySnapshot();
        applySnapshot(parsed);
        if (onClose) onClose();
      } catch {
        alert('Invalid .atelier.json project file');
      }
    };
    reader.readAsText(jsonFile);
  };

  return (
    <div className="studio-panel studio-scroll w-full md:w-[305px] lg:w-[320px] max-h-[72dvh] md:max-h-full overflow-y-auto p-3.5 rounded-2xl flex flex-col gap-3 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
        <div>
          <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white">
            Asset Upload & Project I/O
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400">
            Import high-res PNG/SVG decals or save project JSON
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

      {/* Image Dropzone */}
      <div className="border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-xl p-3 flex flex-col items-center justify-center text-center transition bg-white/5 shrink-0">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />
        <label
          htmlFor="file-upload"
          className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer transition shadow-md"
        >
          Choose Artwork File
        </label>

        <p className="mt-2 text-slate-300 text-xs truncate max-w-[240px]">
          {!file ? 'Supports PNG, SVG, WEBP, JPG' : file.name}
        </p>

        {previewUrl && (
          <div className="mt-2.5 w-20 h-20 rounded-lg border border-white/15 bg-slate-900/80 p-1.5 flex items-center justify-center overflow-hidden">
            <img
              src={previewUrl}
              alt="Artwork Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Target Zone Application */}
      <div className="shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
          Apply Uploaded Texture To:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => readFile('logo')}
            className="py-2 px-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] sm:text-[11px] transition cursor-pointer text-center whitespace-nowrap"
          >
            Front Logo
          </button>
          <button
            type="button"
            onClick={() => readFile('back')}
            className="py-2 px-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-[10px] sm:text-[11px] transition cursor-pointer text-center whitespace-nowrap"
          >
            Back Print
          </button>
          <button
            type="button"
            onClick={() => readFile('full')}
            className="py-2 px-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-[10px] sm:text-[11px] transition cursor-pointer text-center whitespace-nowrap"
          >
            Full Pattern
          </button>
        </div>
      </div>

      {/* Project JSON Backup / Restore */}
      <div className="border-t border-white/10 pt-2.5 flex flex-col gap-1.5 shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          Project File (.atelier.json)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={exportDesignAsJson}
            className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white cursor-pointer transition text-center whitespace-nowrap"
          >
            ⬇ Export JSON
          </button>

          <label
            htmlFor="json-project-import"
            className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white text-center cursor-pointer transition whitespace-nowrap"
          >
            ⬆ Import JSON
          </label>
          <input
            id="json-project-import"
            type="file"
            accept=".json,application/json"
            onChange={handleImportJson}
          />
        </div>
      </div>
    </div>
  );
};

export default FilePicker;
