import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * ==================== 应用全局设置管理 ====================
 * 
 * 功能说明：
 * - 管理应用级别的全局设置和用户偏好
 * - 这些设置不按账户隔离，而是全局共享的
 * - 支持持久化到 localStorage，关闭浏览器后仍保留
 * 
 * 职责范围：
 * 1. **用户偏好**：语言、主题、货币、通知等
 * 2. **应用配置**：Gas 费偏好、默认网络设置等
 * 3. **UI 状态**：侧边栏展开、引导完成状态等（可选）
 */

// ==================== 类型定义 ====================

/**
 * 用户偏好设置
 */
export interface UserPreferences {
    language: 'zh-CN' | 'en-US';
    theme: 'light' | 'dark' | 'system';
    currency: 'USD' | 'CNY' | 'EUR';
    notificationsEnabled: boolean;
    autoSignPermissions: boolean; // 是否允许自动签名
    gasPreference: 'fast' | 'medium' | 'slow'; // Gas 费偏好
}

/**
 * 应用配置
 */
export interface AppConfig {
    defaultChainId: number | null; // 默认链 ID
    showWelcomeBanner: boolean; // 是否显示欢迎横幅
    enableAnalytics: boolean; // 是否启用分析（可选）
}

/**
 * UI 状态（可选，根据需要添加）
 */
export interface UIState {
    sidebarCollapsed: boolean; // 侧边栏是否折叠
    onboardingCompleted: boolean; // 是否完成引导
}

/**
 * Store 状态
 */
export interface DappStoreState {
    // 用户偏好
    preferences: UserPreferences;
    
    // 应用配置
    config: AppConfig;
    
    // UI 状态（可选）
    ui: UIState;
}

/**
 * Store 操作方法
 */
export interface DappStoreMethods {
    // === 用户偏好 ===
    setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
    setPreferences: (preferences: Partial<UserPreferences>) => void;
    getPreferences: () => UserPreferences;
    resetPreferences: () => void;
    
    // === 应用配置 ===
    setConfig: <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => void;
    setConfigs: (configs: Partial<AppConfig>) => void;
    getConfig: () => AppConfig;
    resetConfig: () => void;
    
    // === UI 状态 ===
    setUIState: <K extends keyof UIState>(key: K, value: UIState[K]) => void;
    setUIStates: (states: Partial<UIState>) => void;
    getUIState: () => UIState;
    resetUIState: () => void;
    
    // === 工具方法 ===
    resetAll: () => void;
}

// ==================== 默认值 ====================

const DEFAULT_PREFERENCES: UserPreferences = {
    language: 'zh-CN',
    theme: 'system',
    currency: 'USD',
    notificationsEnabled: true,
    autoSignPermissions: false,
    gasPreference: 'medium',
};

const DEFAULT_CONFIG: AppConfig = {
    defaultChainId: null,
    showWelcomeBanner: true,
    enableAnalytics: false,
};

const DEFAULT_UI_STATE: UIState = {
    sidebarCollapsed: false,
    onboardingCompleted: false,
};

// ==================== Store 实现 ====================

type DappStore = DappStoreState & DappStoreMethods;

export const useDappStore = create<DappStore>()(
    devtools(
        persist(
            (set, get) => ({
                // === 初始状态 ===
                preferences: DEFAULT_PREFERENCES,
                config: DEFAULT_CONFIG,
                ui: DEFAULT_UI_STATE,

                // === 用户偏好 ===
                setPreference: (key, value) => {
                    set((state) => ({
                        preferences: {
                            ...state.preferences,
                            [key]: value,
                        },
                    }));
                },

                setPreferences: (preferences) => {
                    set((state) => ({
                        preferences: {
                            ...state.preferences,
                            ...preferences,
                        },
                    }));
                },

                getPreferences: () => {
                    return get().preferences;
                },

                resetPreferences: () => {
                    set({ preferences: { ...DEFAULT_PREFERENCES } });
                },

                // === 应用配置 ===
                setConfig: (key, value) => {
                    set((state) => ({
                        config: {
                            ...state.config,
                            [key]: value,
                        },
                    }));
                },

                setConfigs: (configs) => {
                    set((state) => ({
                        config: {
                            ...state.config,
                            ...configs,
                        },
                    }));
                },

                getConfig: () => {
                    return get().config;
                },

                resetConfig: () => {
                    set({ config: { ...DEFAULT_CONFIG } });
                },

                // === UI 状态 ===
                setUIState: (key, value) => {
                    set((state) => ({
                        ui: {
                            ...state.ui,
                            [key]: value,
                        },
                    }));
                },

                setUIStates: (states) => {
                    set((state) => ({
                        ui: {
                            ...state.ui,
                            ...states,
                        },
                    }));
                },

                getUIState: () => {
                    return get().ui;
                },

                resetUIState: () => {
                    set({ ui: { ...DEFAULT_UI_STATE } });
                },

                // === 工具方法 ===
                resetAll: () => {
                    set({
                        preferences: { ...DEFAULT_PREFERENCES },
                        config: { ...DEFAULT_CONFIG },
                        ui: { ...DEFAULT_UI_STATE },
                    });
                },
            }),
            {
                name: 'dapp-store', // localStorage key
                partialize: (state) => ({
                    // 只持久化需要的部分，UI 状态可能不需要持久化
                    preferences: state.preferences,
                    config: state.config,
                    ui: {
                        // 只持久化部分 UI 状态
                        onboardingCompleted: state.ui.onboardingCompleted,
                        sidebarCollapsed: state.ui.sidebarCollapsed,
                    },
                }),
            }
        ),
        { name: 'DappStore' }
    )
);
