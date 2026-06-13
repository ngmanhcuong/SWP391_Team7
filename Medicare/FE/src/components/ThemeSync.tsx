import React, { useEffect } from 'react';
import { applyThemeToDocument, useThemeStore } from '../store/themeStore';

const ThemeSync: React.FC = () => {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    applyThemeToDocument(mode);
  }, [mode]);

  return null;
};

export default ThemeSync;
