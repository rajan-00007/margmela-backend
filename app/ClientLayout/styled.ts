import styled, { keyframes } from 'styled-components';

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingViewport = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #09090b;
  color: #f4f4f5;
  gap: 16px;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(99, 102, 241, 0.1);
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #a1a1aa;
  letter-spacing: 0.05em;
`;

export const StandaloneViewport = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #09090b;
  overflow: hidden;
`;

export const ShellWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #09090b;
  color: #f4f4f5;
  font-family: inherit;
  overflow: hidden;
`;

export const MainViewport = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #09090b;
`;

export const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background: radial-gradient(ellipse at top, rgba(99, 102, 241, 0.04) 0%, #09090b 80%, #09090b 100%);

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    padding: 16px;
  }

  /* Custom styling for standard nested scrollbars */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;
