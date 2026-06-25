import styled, { css, keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  height: calc(100vh - 80px);

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
  text-align: center;
  gap: 12px;

  h4 {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
    max-width: 400px;
  }
`;

export const WorkspaceLayout = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  height: calc(100% - 100px);
  overflow: hidden;

  @media (min-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: 360px 1fr;
  }
`;

export const SidebarPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  height: 100%;
  padding-right: 4px;
`;

export const MapPanel = styled.div`
  position: relative;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: #141416;
  overflow: hidden;
  height: 100%;
  min-height: 450px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

export const FloatingToolbar = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(20, 20, 23, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

interface ToolbarButtonProps {
  $active?: boolean;
}

export const ToolbarButton = styled.button<ToolbarButtonProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? '#10b981' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#a1a1aa'};

  &:hover {
    background: ${props => props.$active ? '#10b981' : 'rgba(255, 255, 255, 0.06)'};
    color: #ffffff;
  }
`;

export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TextareaField = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px 12px;
  color: #ffffff;
  font-size: 13px;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #10b981;
  }
`;

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 4px 0;
`;

export const CheckboxLabel = styled.label<{ $checked?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${props => props.$checked ? 'rgba(16, 185, 129, 0.3)' : props.theme.colors.border};
  background: ${props => props.$checked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0, 0, 0, 0.15)'};
  color: ${props => props.$checked ? '#34d399' : '#a1a1aa'};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(16, 185, 129, 0.05);
  }

  input {
    display: none;
  }
`;

export const InfoBar = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #93c5fd;
  font-size: 11px;
  line-height: 1.4;
`;

export const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 8px;

  h3 {
    font-size: 14px;
    font-weight: 800;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }
`;

export const ZonesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  min-height: 0;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const ZoneCard = styled.div<{ $selected?: boolean }>`
  padding: 12px 14px;
  background: ${props => props.$selected ? 'rgba(16, 185, 129, 0.05)' : 'rgba(25, 25, 28, 0.4)'};
  border: 1px solid ${props => props.$selected ? 'rgba(16, 185, 129, 0.4)' : props.theme.colors.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: ${props => props.$selected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.15)'};
    background: ${props => props.$selected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(25, 25, 28, 0.6)'};
    transform: translateY(-1px);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .title {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .color-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
    }
  }

  .advisory {
    font-size: 11px;
    color: #a1a1aa;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .rules {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    color: #a1a1aa;

    .rule-item {
      display: flex;
      align-items: center;
      gap: 3px;

      &.allowed {
        color: #34d399;
      }
      &.restricted {
        color: #f87171;
        text-decoration: line-through;
        opacity: 0.7;
      }
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    padding-top: 8px;

    .stat-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 600;
      color: #d4d4d8;
      background: rgba(255, 255, 255, 0.03);
      padding: 4px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    padding-top: 8px;
  }
`;

export const TextButton = styled.button<{ $color?: string }>`
  background: transparent;
  border: none;
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.$color || '#a1a1aa'};
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: ${props => props.$color ? props.$color : '#ffffff'};
  }
`;

export const FloatingStatusOverlay = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 280px;
  background: rgba(20, 20, 23, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  color: #ffffff;
`;
