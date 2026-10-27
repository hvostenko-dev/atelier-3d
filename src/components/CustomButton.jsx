import React from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { getContrastingColor } from '../config/helpers';

const CustomButton = ({ type, title, customStyles = '', handleClick, disabled = false, icon = null }) => {
  const snap = useSnapshot(state);

  const generateStyle = (btnType) => {
    if (btnType === 'filled') {
      const bg = snap.color === '#0F172A' || snap.color === '#18181B' ? '#F59E0B' : snap.color;
      return {
        backgroundColor: bg,
        color: getContrastingColor(bg),
      };
    } else if (btnType === 'outline') {
      return {
        borderWidth: '1px',
        borderColor: 'rgba(255,255,255,0.22)',
        color: '#F8FAFC',
      };
    }
    return {};
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

export default CustomButton;
