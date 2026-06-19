import styled, { css, keyframes } from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  height: calc(100vh - 80px); /* Fill space in shell view */

  @media (max-width: calc(${props => props.theme.breakpoints.laptop} - 1px)) {
    height: auto;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const MobileTabToggle = styled.div`
  display: none;
  background: rgba(20, 20, 23, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 4px;
  gap: 4px;

  @media (max-width: calc(${props => props.theme.breakpoints.laptop} - 1px)) {
    display: flex;
    width: 100%;
  }
`;

export const TabToggleOption = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: ${props => props.$active ? 'rgba(34, 211, 238, 0.15)' : 'transparent'};
  color: ${props => props.$active ? '#22d3ee' : props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.$active ? '#22d3ee' : props.theme.colors.textPrimary};
  }
`;

export const EmptyStateWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  border-radius: 16px;
  border: 1px dashed ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.2);
  backdrop-blur-xl: 12px;
  text-align: center;
  gap: 16px;

  h4 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.textPrimary};
    margin: 0;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
    max-width: 320px;
    line-height: 1.5;
  }

  a {
    color: #22d3ee;
    font-weight: 600;
    text-decoration: underline;
    
    &:hover {
      color: #06b6d4;
    }
  }
`;

export const WorkspaceLayout = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  overflow: hidden;
  height: 100%;

  @media (max-width: calc(${props => props.theme.breakpoints.laptop} - 1px)) {
    height: auto;
    overflow: visible;
  }

  @media (min-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const MapPanel = styled.div<{ $visible?: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.3);
  padding: 16px;
  box-shadow: ${props => props.theme.shadows.card};
  position: relative;
  overflow: hidden;
  height: 100%;

  @media (max-width: calc(${props => props.theme.breakpoints.laptop} - 1px)) {
    display: ${props => props.$visible ? 'flex' : 'none'};
    height: 60vh;
  }
`;

export const MapWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #09090b;
`;

export const FloatingToolbar = styled.div`
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  background: rgba(9, 9, 11, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  gap: 4px;

  @media (max-width: 768px) {
    top: 12px;
    width: max-content;
    max-width: calc(100% - 24px);
  }
`;

interface ToolbarButtonProps {
  $active: boolean;
  $mode: 'draw' | 'connect' | 'delete';
}

export const ToolbarButton = styled.button<ToolbarButtonProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  transition: all ${props => props.theme.transitions.fast};

  ${props => {
    if (props.$active) {
      let color = '#22d3ee';
      if (props.$mode === 'connect') color = '#eab308';
      if (props.$mode === 'delete') color = '#ef4444';
      
      return css`
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.08);
        color: ${color};
        box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.03);
      `;
    } else {
      return css`
        color: ${props.theme.colors.textSecondary};
        
        &:hover {
          color: ${props.theme.colors.textPrimary};
        }
      `;
    }
  }}

  .btn-text {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

export const FloatingActions = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;

  @media (max-width: 768px) {
    top: auto;
    bottom: 12px;
    right: 12px;
    gap: 6px;
  }
`;

interface ToggleButtonProps {
  $active: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid;
  backdrop-filter: blur(12px);
  transition: all ${props => props.theme.transitions.fast};

  ${props => props.$active ? css`
    background: rgba(34, 211, 238, 0.1);
    border-color: rgba(34, 211, 238, 0.3);
    color: #22d3ee;
  ` : css`
    background: rgba(9, 9, 11, 0.95);
    border-color: rgba(255,255,255,0.08);
    color: ${props.theme.colors.textSecondary};
    
    &:hover {
      border-color: rgba(255,255,255,0.15);
      color: ${props.theme.colors.textPrimary};
    }
  `}

  .btn-text {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

export const FloatingButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(9, 9, 11, 0.95);
  backdrop-filter: blur(12px);
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: rgba(255,255,255,0.15);
    color: ${props => props.theme.colors.textPrimary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-text {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

export const SidebarPanel = styled.div<{ $visible?: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.3);
  padding: 20px;
  box-shadow: ${props => props.theme.shadows.card};
  overflow: hidden;
  height: 100%;

  @media (max-width: calc(${props => props.theme.breakpoints.laptop} - 1px)) {
    display: ${props => props.$visible ? 'flex' : 'none'};
    height: auto;
  }
`;

export const FooterSummaryRow = styled.div`
  margin-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: rgba(9, 9, 11, 0.4);
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.02);

  .stat {
    display: flex;
    flex-direction: column;
    
    .lbl {
      font-size: 9px;
      color: ${props => props.theme.colors.textMuted};
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    
    .val {
      font-family: ${props => props.theme.typography.families.mono};
      font-size: 12px;
      font-weight: 700;
      margin-top: 2px;
    }
  }
`;

export const AlertBanner = styled.div<{ $type: 'error' | 'success' }>`
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid;
  line-height: 1.5;
  
  ${props => props.$type === 'error' ? css`
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
    color: #f87171;
  ` : css`
    background: rgba(16, 185, 129, 0.08);
    border-color: rgba(16, 185, 129, 0.2);
    color: #34d399;
  `}
`;

const pulseRed = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const pulseCyan = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.5); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 211, 238, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
`;

const slideUp = keyframes`
  from { transform: translate(-50%, 20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

export const WalkDrawButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid;
  backdrop-filter: blur(12px);
  transition: all ${props => props.theme.transitions.fast};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);

  ${props => props.$active ? css`
    background: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
    color: #f87171;
    animation: ${pulseRed} 2s infinite ease-in-out;
    
    &:hover {
      background: rgba(239, 68, 68, 0.3);
    }
  ` : css`
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%);
    border-color: rgba(34, 211, 238, 0.3);
    color: #22d3ee;
    
    &:hover:not(:disabled) {
      border-color: #22d3ee;
      background: linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%);
      box-shadow: 0 4px 20px rgba(34, 211, 238, 0.25);
    }
  `}

  .btn-text {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

export const WalkStatusOverlay = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: 90%;
  max-width: 480px;
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 18px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${slideUp} 0.3s ease-out;

  @media (max-width: 768px) {
    bottom: 12px;
    padding: 10px 14px;
  }
`;

export const WalkStatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 8px;

  .title {
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-badge {
    background: rgba(34, 211, 238, 0.1);
    border: 1px solid rgba(34, 211, 238, 0.2);
    color: #22d3ee;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    animation: ${pulseCyan} 2s infinite ease-in-out;
  }
`;

export const WalkStatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  .metric-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
    padding: 8px 6px;
    border: 1px solid rgba(255, 255, 255, 0.02);

    .label {
      font-size: 9px;
      color: ${props => props.theme.colors.textMuted};
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .value {
      font-family: ${props => props.theme.typography.families.mono};
      font-size: 14px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 4px;
    }

    .accuracy-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 700;
      margin-top: 4px;

      &.excellent { color: #10b981; }
      &.moderate { color: #f59e0b; }
      &.poor { color: #ef4444; }
    }
  }
`;

export const ThresholdControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(9, 9, 11, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 14px;
  width: 100%;
  margin-top: 4px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 10px;
      font-weight: 700;
      color: ${props => props.theme.colors.textSecondary};
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .val {
      font-size: 10px;
      font-weight: 800;
      color: #22d3ee;
      font-family: ${props => props.theme.typography.families.mono};
    }
  }

  .slider {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    -webkit-appearance: none;
    accent-color: #22d3ee;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #22d3ee;
      box-shadow: 0 0 10px #22d3ee;
      cursor: pointer;
    }
  }
`;
