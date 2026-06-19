'use client';

import React from 'react';
import {
  HeaderContainer,
  StatusGroup,
  HamburgerButton,
  StatusItem,
  Label,
  EventBadge,
  EventIndicator,
  NoEventText,
  SessionGroup,
  SessionBadge,
} from './styled';

interface HeaderProps {
  backendUrl: string;
  selectedEvent: any;
  token: string | null;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ backendUrl, selectedEvent, token, onToggleSidebar }) => {
  return (
    <HeaderContainer>
      <StatusGroup>
        <HamburgerButton onClick={onToggleSidebar} title="Open Menu">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </HamburgerButton>

        <StatusItem>
          <Label className="event-label">Active:</Label>
          {selectedEvent ? (
            <EventBadge>
              <EventIndicator />
              <span>{selectedEvent.name}</span>
            </EventBadge>
          ) : (
            <NoEventText>None selected</NoEventText>
          )}
        </StatusItem>
      </StatusGroup>

      <SessionGroup>
        {token ? (
          <SessionBadge $type="success">
            Admin Active
          </SessionBadge>
        ) : (
          <SessionBadge $type="warning">
            ⚠️ Anon Mode
          </SessionBadge>
        )}
      </SessionGroup>
    </HeaderContainer>
  );
};

export default Header;
