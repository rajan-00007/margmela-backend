'use client';

import React from 'react';
import { useApi } from '../../../app/context/ApiContext';
import {
  HeaderContainer,
  StatusGroup,
  HamburgerButton,
  StatusItem,
  Label,
  DropdownWrapper,
  EventSelectorSelect,
  DropdownArrow,
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
  const { events, setSelectedEvent } = useApi();

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
          <DropdownWrapper>
            <EventSelectorSelect
              value={selectedEvent?.id || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  setSelectedEvent(null);
                } else {
                  const found = events.find((evt: any) => evt.id === val);
                  if (found) {
                    setSelectedEvent(found);
                  }
                }
              }}
            >
              <option value="">Select Event...</option>
              {events && events.map((evt: any) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name}
                </option>
              ))}
            </EventSelectorSelect>
            <DropdownArrow>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </DropdownArrow>
          </DropdownWrapper>
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
