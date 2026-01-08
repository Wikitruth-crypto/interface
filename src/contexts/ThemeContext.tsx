import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { getThemeByName, availableThemes } from '../styles/themeConfig';

// Theme configuration type definition
interface CustomThemeConfig {
  name: string;
  displayName: string;
  token?: {
    colorPrimary?: string;
    colorInfo?: string;
    colorPrimaryHover?: string;
    colorSuccess?: string;
    colorError?: string;
    colorLink?: string;
    wireframe?: boolean;
    borderRadius?: number;
    [key: string]: any;
  };
  algorithm?: any[];
  [key: string]: any;
}

// Theme context type definition
interface ThemeContextType {
  currentTheme: CustomThemeConfig;
  setTheme: (themeName: string) => void;
  availableThemes: CustomThemeConfig[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component properties
interface ThemeProviderProps {
  children: ReactNode;
  currentThemeName?: string;
  isDarkMode?: boolean;
}

// Theme provider component
const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  currentThemeName: propThemeName, 
  isDarkMode: propIsDarkMode 
}) => {
  // Get the saved theme from localStorage, default is purple theme
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => {
    return propThemeName || localStorage.getItem('selectedTheme') || 'purple';
  });

  // Get the dark mode state from localStorage, default is false
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return propIsDarkMode !== undefined ? propIsDarkMode : localStorage.getItem('isDarkMode') === 'true';
  });

  // Get the current theme configuration
  const currentTheme = getThemeByName(currentThemeName);

  // Switch theme method
  const setTheme = (themeName: string) => {
    setCurrentThemeName(themeName);
    localStorage.setItem('selectedTheme', themeName);
  };

  // Switch dark mode method
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', newDarkMode.toString());
  };

  // Dynamically generate the final theme configuration
  const finalTheme = {
    ...currentTheme,
    algorithm: isDarkMode 
      ? [...(currentTheme.algorithm || []), theme.darkAlgorithm]
      : currentTheme.algorithm || []
  };

  // Theme context value
  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={finalTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Use theme context hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
