import type { Theme } from '@rainbow-me/rainbowkit';

/**
 * Custom WikiTruth Rainbow Kit theme
 * Adapt to dark theme, consistent with project overall style
 */
export const wikitruthTheme: Theme = {
  blurs: {
    modalOverlay: 'blur(8px)',
  },
  colors: {
    accentColor: '#8b5cf6', // Purple theme color
    accentColorForeground: 'white',
    actionButtonBorder: 'rgba(255, 255, 255, 0.1)',
    actionButtonBorderMobile: 'rgba(255, 255, 255, 0.1)',
    actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.05)',
    closeButton: 'rgba(255, 255, 255, 0.6)',
    closeButtonBackground: 'rgba(255, 255, 255, 0.1)',
    connectButtonBackground: '#1a1a1a',
    connectButtonBackgroundError: '#ff4444',
    connectButtonInnerBackground: 'linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
    connectButtonText: '#ffffff',
    connectButtonTextError: '#ffffff',
    connectionIndicator: '#10b981',
    error: '#ff4444',
    generalBorder: 'rgba(255, 255, 255, 0.1)',
    generalBorderDim: 'rgba(255, 255, 255, 0.05)',
    menuItemBackground: 'rgba(255, 255, 255, 0.05)',
    modalBackdrop: 'rgba(0, 0, 0, 0.7)',
    modalBackground: '#1a1a1a',
    modalBorder: 'rgba(255, 255, 255, 0.1)',
    modalText: '#ffffff',
    modalTextDim: 'rgba(255, 255, 255, 0.6)',
    modalTextSecondary: 'rgba(255, 255, 255, 0.8)',
    profileAction: 'rgba(255, 255, 255, 0.1)',
    profileActionHover: 'rgba(255, 255, 255, 0.15)',
    profileForeground: 'rgba(255, 255, 255, 0.05)',
    selectedOptionBorder: '#8b5cf6',
    standby: 'rgba(255, 255, 255, 0.4)',
    downloadBottomCardBackground: '#1a1a1a',
    downloadTopCardBackground: '#2a2a2a',
  },
  radii: {
    actionButton: '8px',
    connectButton: '10px',
    menuButton: '10px',
    modal: '16px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 2px 8px rgba(0, 0, 0, 0.3)',
    dialog: '0 8px 24px rgba(0, 0, 0, 0.5)',
    profileDetailsAction: '0 2px 4px rgba(0, 0, 0, 0.2)',
    selectedOption: '0 0 0 2px #8b5cf6',
    selectedWallet: '0 2px 8px rgba(0, 0, 0, 0.3)',
    walletLogo: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};

