import styled, { css } from 'styled-components';

export const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
`;

export const Label = styled.label`
  font-family: ${props => props.theme.typography.families.sans};
  font-size: ${props => props.theme.typography.sizes.xs};
  font-weight: ${props => props.theme.typography.weights.semibold};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

export interface StyledInputElementProps {
  $hasError?: boolean;
  $fontMono?: boolean;
}

export const StyledInput = styled.input<StyledInputElementProps>`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => (props.$hasError ? props.theme.colors.danger : props.theme.colors.border)};
  border-radius: 12px;
  padding: 12px 16px;
  font-family: ${props => (props.$fontMono ? props.theme.typography.families.mono : props.theme.typography.families.sans)};
  font-size: ${props => props.theme.typography.sizes.sm};
  color: ${props => props.theme.colors.textPrimary};
  transition: all ${props => props.theme.transitions.fast};
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
    opacity: 0.6;
  }
  
  &:focus {
    border-color: ${props => (props.$hasError ? props.theme.colors.danger : props.theme.colors.borderFocus)};
    box-shadow: ${props => (props.$hasError ? '0 0 10px rgba(239, 68, 68, 0.15)' : props.theme.shadows.glowCyan)};
  }
  
  &:disabled {
    opacity: 0.5;
    background-color: ${props => props.theme.colors.surface};
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.span`
  font-family: ${props => props.theme.typography.families.sans};
  font-size: ${props => props.theme.typography.sizes.xs};
  color: ${props => props.theme.colors.danger};
  margin-top: 4px;
`;
