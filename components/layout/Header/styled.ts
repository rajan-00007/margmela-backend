import styled, { keyframes } from 'styled-components';

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

export const HeaderContainer = styled.header`
  height: 64px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    padding: 0 16px;
  }
`;

export const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    gap: 12px;
  }
`;

export const HamburgerButton = styled.button`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: ${props => props.theme.colors.textPrimary};
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
    
    svg {
      height: 20px;
      width: 20px;
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;

  &.host-status {
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      display: none;
    }
  }

  .event-label {
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      display: none;
    }
  }
`;

export const Label = styled.span`
  color: ${props => props.theme.colors.textMuted};
  font-weight: 500;
`;

export const HostBadge = styled.span`
  font-family: ${props => props.theme.typography.families.mono};
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 3px 10px;
  border-radius: 6px;
`;

export const StatusDivider = styled.div`
  height: 16px;
  width: 1px;
  background: ${props => props.theme.colors.border};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const EventSelectorSelect = styled.select`
  appearance: none;
  background: rgba(20, 20, 23, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #818cf8;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 36px 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.05);
  }

  &:focus {
    border-color: #818cf8;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
  }

  option {
    background: #09090b;
    color: #a1a1aa;
    font-weight: 500;
    padding: 8px;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 11px;
    padding: 6px 28px 6px 8px;
    max-width: 140px;
  }
`;

export const DropdownArrow = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #818cf8;

  svg {
    height: 12px;
    width: 12px;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: 8px;
    svg {
      height: 10px;
      width: 10px;
    }
  }
`;

export const SessionGroup = styled.div`
  display: flex;
  align-items: center;
`;

interface SessionBadgeProps {
  $type: 'success' | 'warning';
}

export const SessionBadge = styled.span<SessionBadgeProps>`
  font-size: 11px;
  font-weight: 700;
  font-family: ${props => props.theme.typography.families.mono};
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid;
  white-space: nowrap;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3px 8px;
    font-size: 9px;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
  
  ${props => props.$type === 'success' ? `
    background: rgba(6, 182, 212, 0.08);
    border-color: rgba(6, 182, 212, 0.2);
    color: #22d3ee;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.1);
  ` : `
    background: rgba(245, 158, 11, 0.06);
    border-color: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
  `}
`;
