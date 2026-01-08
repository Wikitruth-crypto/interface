import { theme } from 'antd';

// Theme configuration type definition
export interface CustomThemeConfig {
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

// Default purple theme configuration
export const purpleTheme: CustomThemeConfig = {
  name: 'purple',
  displayName: 'Purple Theme',
  token: {
    colorPrimary: "#c6a9fc",
    colorInfo: "#c6a9fc",
    colorPrimaryHover: '#bb9ee1',
    colorSuccess: '#c0fc29',
    colorError: '#f53a3d',
    colorLink: '#17bc93',
    wireframe: false,
    borderRadius: 8
  },
  algorithm: [
    theme.compactAlgorithm
  ]
};

// Default theme configuration
export const defaultTheme: CustomThemeConfig = {
  name: 'default',
  displayName: 'Default Theme',
  token: {
    colorPrimary: '#1677ff',
    colorInfo: '#1677ff',
    colorSuccess: '#52c41a',
    colorError: '#ff4d4f',
    colorLink: '#1677ff',
    wireframe: false,
    borderRadius: 6
  },
  algorithm: []
};

// List of all available themes
export const availableThemes: CustomThemeConfig[] = [
  defaultTheme,
  purpleTheme
];

// Get theme configuration by theme name
export const getThemeByName = (name: string): CustomThemeConfig => {
  const foundTheme = availableThemes.find(t => t.name === name);
  return foundTheme || defaultTheme;
};
