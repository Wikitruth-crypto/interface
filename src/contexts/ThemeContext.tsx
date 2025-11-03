import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { getThemeByName, availableThemes } from '../styles/themeConfig';

// 主题配置类型定义
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

// 主题上下文类型定义
interface ThemeContextType {
  currentTheme: CustomThemeConfig;
  setTheme: (themeName: string) => void;
  availableThemes: CustomThemeConfig[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件属性
interface ThemeProviderProps {
  children: ReactNode;
  currentThemeName?: string;
  isDarkMode?: boolean;
}

// 主题提供者组件
const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  currentThemeName: propThemeName, 
  isDarkMode: propIsDarkMode 
}) => {
  // 从localStorage获取保存的主题，默认为紫色主题
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => {
    return propThemeName || localStorage.getItem('selectedTheme') || 'purple';
  });

  // 从localStorage获取暗黑模式状态，默认为false
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return propIsDarkMode !== undefined ? propIsDarkMode : localStorage.getItem('isDarkMode') === 'true';
  });

  // 获取当前主题配置
  const currentTheme = getThemeByName(currentThemeName);

  // 切换主题方法
  const setTheme = (themeName: string) => {
    setCurrentThemeName(themeName);
    localStorage.setItem('selectedTheme', themeName);
  };

  // 切换暗黑模式方法
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', newDarkMode.toString());
  };

  // 动态生成最终主题配置
  const finalTheme = {
    ...currentTheme,
    algorithm: isDarkMode 
      ? [...(currentTheme.algorithm || []), theme.darkAlgorithm]
      : currentTheme.algorithm || []
  };

  // 主题上下文值
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

// 使用主题上下文的Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
