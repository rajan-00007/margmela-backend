import { createGlobalStyle } from 'styled-components';
import { theme } from './themes';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    background-color: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    font-family: ${theme.typography.families.sans};
    font-size: 16px;
    line-height: ${theme.typography.lineHeights.normal};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    position: relative;
    min-height: 100vh;
  }

  /* Form Element Resets */
  input, button, textarea, select {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    outline: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }

  /* Smooth Custom Scrollbar for Obsidian Aesthetics */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;
    border: 2px solid ${theme.colors.background};
    
    &:hover {
      background: ${theme.colors.textMuted};
    }
  }

  /* Leaflet Style Overrides to match Obsidian Dark theme */
  .leaflet-container {
    background-color: ${theme.colors.background} !important;
    font-family: ${theme.typography.families.sans} !important;
  }

  .leaflet-bar {
    border: 1px solid ${theme.colors.border} !important;
    box-shadow: ${theme.shadows.card} !important;
    
    a {
      background-color: ${theme.colors.surface} !important;
      color: ${theme.colors.textPrimary} !important;
      border-bottom: 1px solid ${theme.colors.border} !important;
      transition: all 0.2s ease !important;
      
      &:hover {
        background-color: ${theme.colors.surfaceHover} !important;
        color: ${theme.colors.accent} !important;
      }
    }
  }

  .leaflet-popup-content-wrapper {
    background: ${theme.colors.surface} !important;
    color: ${theme.colors.textPrimary} !important;
    border: 1px solid ${theme.colors.border} !important;
    box-shadow: ${theme.shadows.card} !important;
    border-radius: 12px !important;
    padding: 4px !important;
  }

  .leaflet-popup-tip {
    background: ${theme.colors.surface} !important;
    border: 1px solid ${theme.colors.border} !important;
  }

  /* Smooth Page Transitions */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
