import React from 'react';
import { StyledButton, Spinner, StyledButtonProps } from './styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, StyledButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  icon,
  $variant = 'primary',
  $size = 'md',
  $fullWidth = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={$variant}
      $size={$size}
      $fullWidth={$fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && icon && <span style={{ marginRight: '8px', display: 'inline-flex' }}>{icon}</span>}
      {children}
    </StyledButton>
  );
};

export default Button;
