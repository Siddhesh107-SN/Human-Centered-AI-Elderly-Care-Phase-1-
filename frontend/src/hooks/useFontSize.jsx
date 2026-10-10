import { useState, useEffect, createContext, useContext } from 'react';

const FontSizeContext = createContext();

export function FontSizeProvider({ children }) {
  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem('carepulse_font_scale');
    return saved ? parseFloat(saved) : 1.0;
  });

  const changeFontSize = (newScale) => {
    const val = parseFloat(newScale);
    setScale(val);
    localStorage.setItem('carepulse_font_scale', val.toString());
    document.documentElement.style.fontSize = `${val * 16}px`;
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale * 16}px`;
  }, [scale]);

  return (
    <FontSizeContext.Provider value={{ scale, changeFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}
