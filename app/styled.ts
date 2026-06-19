import styled, { keyframes, css } from 'styled-components';

export const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
`;

export const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoginPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #09090b;
  position: relative;
  overflow: hidden;
  padding: 24px;
`;

export const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 70%);
  z-index: 0;
  pointer-events: none;
`;

export const TopRightGlow = styled.div`
  position: absolute;
  top: -10%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.04) 0%, rgba(20, 184, 166, 0) 70%);
  z-index: 0;
  pointer-events: none;
`;

export const LoginCardWrapper = styled.div`
  width: 100%;
  max-width: 440px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BrandHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
`;

export const LogoIcon = styled.svg`
  width: 44px;
  height: 44px;
  color: #6366f1;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
  margin-bottom: 4px;
`;

export const BrandTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin: 0;
`;

export const BrandSubtitle = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #a1a1aa;
  text-transform: uppercase;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ResetOtpButton = styled.button`
  background: transparent;
  border: none;
  color: #a1a1aa;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  align-self: center;
  transition: color 0.2s ease;
  margin-top: -8px;

  &:hover {
    color: #ffffff;
  }
`;

export const ErrorBox = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #f87171;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 16px;
  font-family: inherit;
`;

export const SuccessBox = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 16px;
`;

export const AdvancedSection = styled.div`
  margin-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 16px;
`;

export const AdvancedTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  color: #71717a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;

  &:hover {
    color: #a1a1aa;
  }
`;

export const ChevronIcon = styled.svg<{ $rotated: boolean }>`
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
  ${props => props.$rotated && css`
    transform: rotate(180deg);
  `}
`;

export const AdvancedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

export interface StatusProps {
  $status: 'idle' | 'checking' | 'success' | 'failed';
}

export const ServerConnectionBadge = styled.div<StatusProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid;

  ${props => {
    switch (props.$status) {
      case 'success':
        return css`
          background: rgba(16, 185, 129, 0.02);
          border-color: rgba(16, 185, 129, 0.1);
          color: #34d399;
        `;
      case 'failed':
        return css`
          background: rgba(239, 68, 68, 0.02);
          border-color: rgba(239, 68, 68, 0.1);
          color: #f87171;
        `;
      case 'checking':
      default:
        return css`
          background: rgba(255, 255, 255, 0.01);
          border-color: rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
        `;
    }
  }}
`;

export const BadgeDot = styled.span<StatusProps>`
  height: 6px;
  width: 6px;
  border-radius: 50%;
  
  ${props => {
    switch (props.$status) {
      case 'success':
        return css`
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        `;
      case 'failed':
        return css`
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
        `;
      case 'checking':
      default:
        return css`
          background: #a1a1aa;
          box-shadow: 0 0 6px #a1a1aa;
          animation: ${pulseAnimation} 1.5s infinite ease-in-out;
        `;
    }
  }}
`;

export const BrandFooter = styled.p`
  font-size: 11px;
  color: #52525b;
  text-align: center;
  line-height: 1.6;
  margin: 0;
  padding: 0 16px;
`;

export const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  width: 100%;

  &:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
  }
`;

export const PhonePrefix = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  height: 46px;
  padding: 0 16px;
  user-select: none;
`;

export const PhoneInputField = styled.input`
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: monospace;
  font-size: 14px;
  outline: none;
  padding: 12px 16px;
  width: 100%;

  &::placeholder {
    color: #52525b;
    font-family: inherit;
  }
`;
