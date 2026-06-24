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
    grid-template-columns: 350px 1fr;
  }
`;

export const SidebarPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: 100%;
  padding-right: 4px;
`;

export const MapPanel = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.4);
  position: relative;
  overflow: hidden;
  height: 500px;

  @media (min-width: ${props => props.theme.breakpoints.laptop}) {
    height: 100%;
  }
`;

export const MapWrapper = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
`;

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background: #09090b;
`;

export const FloatingToolbar = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1000;
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 4px;
  display: flex;
  gap: 4px;
`;

export const ToolbarButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(34, 211, 238, 0.15)' : 'transparent'};
  color: ${props => props.$active ? '#22d3ee' : '#cbd5e1'};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background: ${props => props.$active ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

export const FloatingTools = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ActionButton = styled.button`
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: #cbd5e1;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: #3f3f46;
    background: #18181b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TextareaField = styled.textarea`
  width: 100%;
  background: #09090b;
  border: 1px solid ${props => props.theme.colors.border};
  color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #22d3ee;
  }
`;

export const InfoBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: rgba(34, 211, 238, 0.05);
  border: 1px solid rgba(34, 211, 238, 0.15);
  border-radius: 8px;
  color: #22d3ee;
  font-size: 11px;
  line-height: 1.4;

  svg {
    flex-shrink: 0;
  }
`;

export const SelectorPillGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const SelectorPill = styled.div<{ $selected: boolean; $color?: string }>`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${props => props.$selected ? (props.$color || '#22d3ee') : props.theme.colors.border};
  background: ${props => props.$selected ? `${props.$color || '#22d3ee'}1a` : '#18181b'};
  color: ${props => props.$selected ? (props.$color || '#22d3ee') : props.theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.$color || '#22d3ee'};
  }

  .clear-btn {
    border: none;
    background: transparent;
    color: inherit;
    font-size: 12px;
    padding: 0;
    cursor: pointer;
    &:hover {
      color: #ffffff;
    }
  }
`;

export const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 16px;

  h3 {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }
`;

export const AdvisoriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AdvisoryCard = styled.div<{ $active: boolean }>`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: rgba(20, 20, 23, 0.4);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  transition: all 0.2s;

  &:hover {
    border-color: #3f3f46;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;

    .title {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .meta {
      font-size: 10px;
      color: ${props => props.theme.colors.textSecondary};
    }
  }

  .desc {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.4;
    margin: 0;
  }

  .stats {
    display: flex;
    gap: 10px;
    font-size: 10px;

    .stat-badge {
      padding: 2px 6px;
      border-radius: 4px;
      background: #18181b;
      color: #e4e4e7;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    border-top: 1px solid ${props => props.theme.colors.border};
    padding-top: 8px;
    margin-top: 4px;
  }
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #10b981;
  }

  &:checked + span:before {
    transform: translateX(14px);
  }
`;

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #3f3f46;
  transition: .2s;
  border-radius: 18px;

  &:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .2s;
    border-radius: 50%;
  }
`;

export const TextButton = styled.button<{ $color?: string }>`
  border: none;
  background: transparent;
  color: ${props => props.$color || props.theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #ffffff;
  }
`;

export const TemplateGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
`;

export const TemplateChip = styled.button`
  background: #18181b;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 600;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: #3f3f46;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;
  }
`;
