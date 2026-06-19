import styled, { keyframes, css } from 'styled-components';

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
`;

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

export const PageDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

export const AnonymousRestrictionBanner = styled.div`
  padding: 16px;
  border-radius: 16px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  backdrop-filter: blur(10px);
`;

export const BannerTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 4px 0;
`;

export const BannerText = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;

  code {
    font-family: ${props => props.theme.typography.families.mono};
    background: rgba(9, 9, 11, 0.5);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.textPrimary};
  }

  strong {
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const NotificationLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const PanelHeaderTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
`;

export const LoadingEventsText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textMuted};
`;

export const DropdownSelect = styled.select`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  outline: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.borderFocus};
    box-shadow: ${props => props.theme.shadows.glowCyan};
  }
`;

export const CardBodyWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TemplateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textMuted};
  letter-spacing: 0.05em;
`;

export const TemplatesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const TemplateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.textMuted};
    background-color: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const TemplateDot = styled.span<{ $color: string }>`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

export const ComposeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

export const TextareaField = styled.textarea`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  font-family: inherit;
  font-size: 14px;
  color: ${props => props.theme.colors.textPrimary};
  resize: none;
  transition: all ${props => props.theme.transitions.fast};

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
    opacity: 0.6;
  }

  &:focus {
    border-color: ${props => props.theme.colors.borderFocus};
    box-shadow: ${props => props.theme.shadows.glowCyan};
  }
`;

export const CoordinatesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }

  & > div {
    margin-bottom: 0;
  }
`;

export const EmergencyCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background-color: rgba(9, 9, 11, 0.4);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

export const CheckboxInput = styled.input`
  height: 18px;
  width: 18px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  cursor: pointer;
  accent-color: #ef4444;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  cursor: pointer;
  user-select: none;
`;

export const PulseDot = styled.span<{ $color: string }>`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
  box-shadow: 0 0 8px ${props => props.$color};
  animation: ${pulse} 1.8s infinite ease-in-out;
`;

export const SyncButton = styled.button`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    border-color: ${props => props.theme.colors.textMuted};
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

export const HistoryLoadingBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textMuted};
  font-size: 12px;
  gap: 8px;
`;

export const HistorySpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.03);
  border-top-color: ${props => props.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const HistoryEmptyBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 16px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.textMuted};
  font-size: 12px;
  gap: 4px;

  p.sub-desc {
    font-size: 10px;
  }
`;

export const HistoryListScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

export const HistoryItem = styled.div<{ $color: string }>`
  padding: 12px 16px;
  background-color: rgba(9, 9, 11, 0.4);
  border: 1px solid ${props => props.theme.colors.border};
  border-left: 3px solid ${props => props.$color};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
`;

export const HistoryItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HistoryItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textPrimary};
  letter-spacing: 0.02em;
`;

export const HistoryItemDot = styled.span<{ $color: string }>`
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: ${props => props.$color};
  box-shadow: 0 0 6px ${props => props.$color};
`;

export const HistoryItemTime = styled.span`
  font-family: ${props => props.theme.typography.families.mono};
  font-size: 9px;
  color: ${props => props.theme.colors.textMuted};
`;

export const HistoryItemMessage = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
  margin: 0;
`;

export const HistoryGeotarget = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${props => props.theme.typography.families.mono};
  font-size: 10px;
  color: ${props => props.theme.colors.accent};

  svg {
    color: ${props => props.theme.colors.accent};
  }
`;

export const ErrorOverlayBanner = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.95);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  z-index: 9999;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export const SuccessOverlayBanner = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.95);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  z-index: 9999;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
