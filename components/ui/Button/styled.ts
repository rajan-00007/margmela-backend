import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export interface StyledButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning';
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}

export const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  display: inline-block;
  margin-right: 8px;
`;

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.typography.families.sans};
  font-weight: ${props => props.theme.typography.weights.semibold};
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Width */
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};

  /* Sizes */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return css`
          padding: 6px 12px;
          font-size: ${props.theme.typography.sizes.xs};
        `;
      case 'lg':
        return css`
          padding: 12px 24px;
          font-size: ${props.theme.typography.sizes.lg};
        `;
      case 'md':
      default:
        return css`
          padding: 10px 18px;
          font-size: ${props.theme.typography.sizes.sm};
        `;
    }
  }}

  /* Variants */
  ${props => {
    const { colors, gradients, shadows } = props.theme;
    switch (props.$variant) {
      case 'secondary':
        return css`
          background-color: ${colors.surface};
          border-color: ${colors.border};
          color: ${colors.textPrimary};
          
          &:hover:not(:disabled) {
            background-color: ${colors.surfaceHover};
            border-color: ${colors.textMuted};
          }
        `;
      case 'danger':
        return css`
          background-color: ${colors.danger};
          color: #ffffff;
          
          &:hover:not(:disabled) {
            background-color: #dc2626;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          }
        `;
      case 'success':
        return css`
          background-color: ${colors.success};
          color: #ffffff;
          
          &:hover:not(:disabled) {
            background-color: #059669;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          }
        `;
      case 'warning':
        return css`
          background-color: ${colors.warning};
          color: ${colors.textDark};
          
          &:hover:not(:disabled) {
            background-color: #d97706;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${colors.textSecondary};
          
          &:hover:not(:disabled) {
            background-color: ${colors.surface};
            color: ${colors.textPrimary};
          }
        `;
      case 'primary':
      default:
        return css`
          background: ${gradients.primary};
          color: #ffffff;
          box-shadow: ${shadows.button};
          
          &:hover:not(:disabled) {
            opacity: 0.95;
            box-shadow: 0 4px 15px rgba(0, 82, 247, 0.4);
          }
        `;
    }
  }}
`;
