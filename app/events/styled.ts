import styled, { css, keyframes } from 'styled-components';

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h2`
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: 1fr 2fr;
  }
`;

export const SectionHeader = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 16px;
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 14px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const EventsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 520px;
  overflow-y: auto;
  padding-right: 8px;

  /* Custom Scrollbar for sleek premium look */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textMuted};
  }
`;

export interface EventCardProps {
  $isActive: boolean;
}

export const EventCard = styled.div<EventCardProps>`
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all ${props => props.theme.transitions.normal};
  
  ${props => props.$isActive ? css`
    background: linear-gradient(135deg, rgba(0, 82, 247, 0.08) 0%, rgba(99, 102, 241, 0.03) 100%);
    box-shadow: 0 0 25px rgba(0, 82, 247, 0.15);
  ` : css`
    background: rgba(20, 20, 23, 0.3);
    
    &:hover {
      border-color: ${props.theme.colors.textMuted};
      background: rgba(20, 20, 23, 0.5);
    }
  `}

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const EventTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const StatusDot = styled.span<{ $published: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$published ? props.theme.colors.success : props.theme.colors.warning};
  box-shadow: 0 0 8px ${props => props.$published ? props.theme.colors.success : props.theme.colors.warning};
`;

export const EventTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

export const Badge = styled.span`
  font-size: 10px;
  font-family: ${props => props.theme.typography.families.mono};
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`;

export const EventDescription = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  max-width: 480px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

export const EventMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 11px;
  font-family: ${props => props.theme.typography.families.mono};
  color: ${props => props.theme.colors.textMuted};
`;

export const MetaItem = styled.div`
  strong {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const EventSelectBadge = styled.span<{ $isActive: boolean }>`
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all ${props => props.theme.transitions.fast};

  ${props => props.$isActive ? css`
    color: ${props.theme.colors.primary};
    background: rgba(0, 82, 247, 0.15);
    border: 1px solid rgba(0, 82, 247, 0.3);
  ` : css`
    color: ${props.theme.colors.textMuted};
    
    &:hover {
      color: ${props.theme.colors.textPrimary};
    }
  `}
`;

export const BBoxHelperToggle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(255, 255, 255, 0.01);

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const MapSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(9, 9, 11, 0.4);
`;

export const MapWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(9, 9, 11, 0.7);
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
`;

export const BBoxInputsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: flex-end;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr) auto;
  }
`;

export const AlertBanner = styled.div<{ $type: 'error' | 'success' }>`
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid;
  
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

/* Local layout styled tags from page.tsx */
export const FormGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const LabelText = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TextArea = styled.textarea`
  width: 100%;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 10px 14px;
  color: ${props => props.theme.colors.textPrimary};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  gap: 16px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

export const SpinnerOverlay = styled.div`
  width: 32px;
  height: 32px;
  border: 4px solid rgba(255, 255, 255, 0.05);
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;

  .subtext {
    font-size: 12px;
    color: ${props => props.theme.colors.textMuted};
    margin-top: 4px;
  }
`;
