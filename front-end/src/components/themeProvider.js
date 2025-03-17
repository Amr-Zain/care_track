import React, { useEffect } from 'react';
import { theme } from '../config/theme';

const ThemeProvider = ({ children }) => {
  useEffect(() => {
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}-color`, value);
    });
  }, []);

  return children;
};

export default ThemeProvider;