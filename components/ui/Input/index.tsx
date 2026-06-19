import React from 'react';
import { FormGroup, Label, StyledInput, ErrorText, StyledInputElementProps } from './styled';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, StyledInputElementProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  $fontMono = false,
  id,
  ...props
}) => {
  return (
    <FormGroup $fullWidth={fullWidth}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput
        id={id}
        $hasError={!!error}
        $fontMono={$fontMono}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </FormGroup>
  );
};

export default Input;
