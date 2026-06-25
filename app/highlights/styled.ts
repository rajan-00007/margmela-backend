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

export const FormGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(9, 9, 11, 0.5);
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textPrimary};
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 1px ${props => props.theme.colors.primary};
    background: rgba(9, 9, 11, 0.8);
  }
`;

export const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  background: rgba(20, 20, 23, 0.2);
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  text-align: center;
  gap: 12px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(20, 20, 23, 0.4);
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const HighlightsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;

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
`;

export const HighlightCard = styled.div`
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.3);
  display: flex;
  gap: 20px;
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.textMuted};
    background: rgba(20, 20, 23, 0.5);
  }
`;

export const CardThumbnail = styled.img`
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
`;

export const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
  min-width: 0;
`;

export const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardMetaRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CardDescription = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
`;

export const AlertBanner = styled.div<{ $type?: 'error' | 'success' | 'info' }>`
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.5;

  ${props => props.$type === 'error' && css`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #fca5a5;
  `}

  ${props => props.$type === 'success' && css`
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: #a7f3d0;
  `}

  ${props => (!props.$type || props.$type === 'info') && css`
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #93c5fd;
  `}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.01);
  color: ${props => props.theme.colors.textSecondary};

  .subtext {
    font-size: 12px;
    color: ${props => props.theme.colors.textMuted};
    margin-top: 4px;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: ${props => props.theme.colors.textSecondary};
  gap: 16px;
`;

export const SpinnerOverlay = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
