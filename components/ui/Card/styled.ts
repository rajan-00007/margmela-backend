import styled, { css } from 'styled-components';

export interface StyledCardProps {
  $glow?: boolean;
  $interactive?: boolean;
  $glass?: boolean;
}

export const StyledCard = styled.div<StyledCardProps>`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadows.card};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all ${props => props.theme.transitions.normal};
  
  ${props =>
    props.$glow &&
    css`
      border-color: ${props.theme.colors.borderFocus};
      box-shadow: ${props.theme.shadows.glow};
    `}

  ${props =>
    props.$glass &&
    css`
      background: rgba(18, 18, 21, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
    `}

  ${props =>
    props.$interactive &&
    css`
      cursor: pointer;
      
      &:hover {
        transform: translateY(-2px);
        border-color: ${props.theme.colors.textMuted};
        background-color: ${props.theme.colors.surfaceHover};
      }
    `}
`;

export const CardHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h3 {
    font-size: ${props => props.theme.typography.sizes.lg};
    font-weight: ${props => props.theme.typography.weights.bold};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const CardBody = styled.div`
  padding: 24px;
  flex: 1;
`;

export const CardFooter = styled.div`
  padding: 16px 24px;
  background-color: rgba(9, 9, 11, 0.4);
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;
