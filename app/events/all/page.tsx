'use client';

import React from 'react';
import Link from 'next/link';
import { useEvents } from '../../../features/events/hooks/useEvents';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

import {
  PageContainer,
  HeaderSection,
  PageTitle,
  PageSubtitle,
  EventsListContainer,
  EventCard,
  EventInfo,
  EventTitleRow,
  StatusDot,
  EventTitle,
  Badge,
  EventDescription,
  EventMetaRow,
  MetaItem,
  EventSelectBadge,
  LoadingState,
  SpinnerOverlay,
  EmptyState,
} from '../styled';

export default function AllEventsPage() {
  const {
    events,
    loading,
    error,
    success,
    selectedEvent,
    setSelectedEvent,
    fetchEvents,
  } = useEvents();

  return (
    <PageContainer>
      <HeaderSection style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <PageTitle>Registered System Events</PageTitle>
          <PageSubtitle>
            All registered events in the backend database. Select one to make it the active system event.
          </PageSubtitle>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button $variant="secondary" onClick={fetchEvents} loading={loading}>
            Refresh List
          </Button>
          <Link href="/events" passHref legacyBehavior>
            <Button $variant="primary">
              + Create & Configure BBox
            </Button>
          </Link>
        </div>
      </HeaderSection>

      <Card>
        <Card.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#f4f4f5' }}>
              Database Registry ({events.length} events)
            </span>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <LoadingState style={{ padding: '60px 0' }}>
              <SpinnerOverlay />
              <p>Fetching backend events...</p>
            </LoadingState>
          ) : events.length === 0 ? (
            <EmptyState style={{ padding: '60px 20px' }}>
              <p>No events found on this database.</p>
              <p className="subtext">Click the "+ Create & Configure BBox" button above to add one.</p>
            </EmptyState>
          ) : (
            <EventsListContainer style={{ maxHeight: 'none' }}>
              {events.map((evt) => {
                const isActive = selectedEvent?.id === evt.id;
                const radiusValue = evt.metadata?.visibility;
                return (
                  <EventCard
                    key={evt.id}
                    $isActive={isActive}
                    onClick={() => setSelectedEvent(evt)}
                  >
                    <EventInfo>
                      <EventTitleRow>
                        <StatusDot $published={evt.status === 'published'} />
                        <EventTitle>{evt.name}</EventTitle>
                        <Badge>{evt.status}</Badge>
                      </EventTitleRow>
                      
                      {evt.description && (
                        <EventDescription>{evt.description}</EventDescription>
                      )}

                      <EventMetaRow>
                        <MetaItem>
                          <strong>Slug:</strong> {evt.slug}
                        </MetaItem>
                        <MetaItem>
                          <strong>Ver:</strong> {evt.bundle_version || 0}
                        </MetaItem>
                        <MetaItem>
                          <strong>Route Map:</strong> {evt.has_route_graph ? '✅ Created' : '❌ Empty'}
                        </MetaItem>
                        <MetaItem>
                          <strong>Visibility:</strong> {radiusValue ? `📍 ${radiusValue} KM` : '🌍 Unlimited'}
                        </MetaItem>
                      </EventMetaRow>
                    </EventInfo>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <EventSelectBadge $isActive={isActive}>
                        {isActive ? '✨ Selected Active' : 'Select'}
                      </EventSelectBadge>
                    </div>
                  </EventCard>
                );
              })}
            </EventsListContainer>
          )}
        </Card.Body>
      </Card>

      {error && (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚠️</span>
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✨</span>
          <div>{success}</div>
        </div>
      )}
    </PageContainer>
  );
}
