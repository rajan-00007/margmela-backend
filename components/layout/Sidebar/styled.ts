import styled, { css, keyframes } from 'styled-components';

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
`;

export const SidebarContainer = styled.aside<{ $isOpen?: boolean }>`
  width: 260px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.4);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  height: 100%;

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1001;
    background: rgba(15, 15, 18, 0.95);
    backdrop-filter: blur(20px);
    transition: transform 0.3s ease-in-out;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? '5px 0 25px rgba(0, 0, 0, 0.8)' : 'none'};
  }
`;

export const Backdrop = styled.div`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
  }
`;

export const MobileCloseButton = styled.button`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 20px;
    right: 16px;
    background: transparent;
    border: none;
    color: ${props => props.theme.colors.textSecondary};
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.02);
    z-index: 10;
    
    svg {
      height: 18px;
      width: 18px;
    }
    
    &:hover {
      color: ${props => props.theme.colors.textPrimary};
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

export const BrandHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BrandLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BrandIndicator = styled.span`
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.4);
  animation: ${pulse} 2s infinite ease-in-out;
`;

export const BrandTitle = styled.h1`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #22d3ee 0%, #a7f3d0 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

export const BrandBadge = styled.span`
  font-size: 9px;
  font-family: ${props => props.theme.typography.families.mono};
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(34, 34, 38, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    display: none;
  }
`;

export const NavScrollArea = styled.nav`
  flex: 1;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

interface NavLinkProps {
  $active: boolean;
}

export const NavLink = styled.a<NavLinkProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  border: 1px solid transparent;

  svg {
    height: 18px;
    width: 18px;
    transition: transform 0.2s ease;
  }

  ${props => props.$active ? css`
    background: linear-gradient(90deg, rgba(6, 182, 212, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%);
    border-color: rgba(6, 182, 212, 0.25);
    color: #22d3ee;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.03), 
                0 4px 12px rgba(6, 182, 212, 0.05);

    svg {
      color: #22d3ee;
      transform: scale(1.05);
    }
  ` : css`
    color: ${props.theme.colors.textSecondary};

    svg {
      color: ${props.theme.colors.textMuted};
    }

    &:hover {
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 255, 255, 0.04);
      color: ${props.theme.colors.textPrimary};
      
      svg {
        color: ${props.theme.colors.textSecondary};
      }
    }
  `}
`;

export const ExternalNavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  border: 1px solid transparent;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    height: 18px;
    width: 18px;
    color: #10b981;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.04);
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const FooterContainer = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: rgba(9, 9, 11, 0.3);
`;

export const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  svg {
    height: 14px;
    width: 14px;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
  }
`;

export const RestrictedWrapper = styled.div`
  text-align: center;
  padding: 8px;
  font-size: 11px;
  font-weight: 700;
  color: #f59e0b;
  font-style: italic;
`;
