import React, { createContext, useState, useEffect } from 'react';

// Membuat context untuk theme
export const ThemeContext = createContext();

// ThemeProvider akan mengatur tema dan memberikan akses ke seluruh aplikasi
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // Default ke light

  useEffect(() => {
    // Paksa light mode dengan menghapus class "dark"
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light'); // Selalu tambahkan class light
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
