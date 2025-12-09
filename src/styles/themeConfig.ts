import { theme } from 'antd';

// 主题配置类型定义
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

// 默认紫色主题配置
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

// 默认主题配置
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

// 所有可用主题列表
export const availableThemes: CustomThemeConfig[] = [
  defaultTheme,
  purpleTheme
];

// 根据主题名称获取主题配置
export const getThemeByName = (name: string): CustomThemeConfig => {
  const foundTheme = availableThemes.find(t => t.name === name);
  return foundTheme || defaultTheme;
};
