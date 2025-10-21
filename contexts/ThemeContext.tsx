import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Carrega o tema do localStorage quando o componente é montado
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  // Atualiza o localStorage e as classes do HTML quando o tema muda
  const handleThemeChange = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove as classes de tema anteriores
    root.classList.remove('light', 'dark', 'blue');
    
    // Adiciona a nova classe de tema
    root.classList.add(newTheme);
    
    // Salva no localStorage
    localStorage.setItem('theme', newTheme);
    
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}