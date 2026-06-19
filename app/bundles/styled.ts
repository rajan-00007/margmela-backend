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
  max-width: 1000px;
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

export const NoEventContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  border-radius: 16px;
  border: 1px dashed ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;

  svg {
    color: ${props => props.theme.colors.textMuted};
    margin-bottom: 16px;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

export const NoEventTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

export const NoEventDesc = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;

  a {
    color: ${props => props.theme.colors.accent};
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      color: ${props => props.theme.colors.textPrimary};
    }
  }
`;

export const BundlesLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 2fr;
  }
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
`;

export const CardBodyWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TargetDetailsPanel = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  background-color: rgba(9, 9, 11, 0.4);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PanelHeaderLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textMuted};
  letter-spacing: 0.05em;
`;

export const EventName = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${props => props.theme.colors.textPrimary};
`;

export const EventIdMono = styled.div`
  font-family: ${props => props.theme.typography.families.mono};
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EventStatus = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};

  span {
    color: #fbbf24;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

export const EventVersion = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};

  strong {
    color: ${props => props.theme.colors.textPrimary};
    font-weight: 700;
  }
`;

export const HelpText = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0;
`;

export const LoadingCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 12px;
  text-align: center;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.03);
  border-top-color: ${props => props.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-bottom: 20px;
`;

export const LoadingTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

export const LoadingDesc = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textMuted};
  line-height: 1.6;
  max-width: 320px;
  margin: 0;
`;

export const EmptyConsoleState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  color: ${props => props.theme.colors.textMuted};
  font-style: italic;
  font-size: 13px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  text-align: center;
`;

export const ErrorConsoleBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #f87171;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 13px;
`;

export const ErrorMessage = styled.p`
  font-family: ${props => props.theme.typography.families.mono};
  font-size: 11px;
  line-height: 1.5;
  margin: 0;
`;

export const SuccessOutputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SuccessBanner = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatsOutputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const StatBox = styled.div`
  padding: 14px;
  background-color: rgba(9, 9, 11, 0.4);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StatLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textMuted};
  letter-spacing: 0.05em;
`;

export const StatValue = styled.div<{ $color: string }>`
  font-family: ${props => props.theme.typography.families.mono};
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$color};
`;

export const StorageTargetBox = styled.div`
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid ${props => props.theme.colors.border};
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StorageUrlMono = styled.div`
  font-family: ${props => props.theme.typography.families.mono};
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 10px;
  border-radius: 8px;
  word-break: break-all;
  user-select: all;
`;

export const DownloadActionArea = styled.div`
  display: flex;
  justify-content: flex-start;

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    background-color: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 600;
    transition: all ${props => props.theme.transitions.fast};
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);

    &:hover {
      border-color: ${props => props.theme.colors.textMuted};
      background-color: ${props => props.theme.colors.surfaceHover};
      transform: translateY(-1px);
    }

    svg {
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;
