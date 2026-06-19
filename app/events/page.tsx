'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useEvents } from '../../features/events/hooks/useEvents';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import {
  PageContainer,
  HeaderSection,
  PageTitle,
  PageSubtitle,
  GridContainer,
  SectionHeader,
  Form,
  FormRow,
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
  BBoxHelperToggle,
  MapSection,
  BBoxInputsGrid,
  AlertBanner,
  FormGroupWrapper,
  LabelText,
  TextArea,
  LoadingState,
  SpinnerOverlay,
  EmptyState,
} from './styled';

// Dynamically import Leaflet map helper to avoid Next.js Server Hydration / SSR window compilation issues
const BBoxMap = dynamic(
  () => import('../../features/events/components/BBoxMap'),
  { ssr: false, loading: () => <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', borderRadius: '12px' }}>Loading Visual Map System...</div> }
);

export default function EventsManager() {
  const {
    events,
    loading,
    error,
    success,
    setError,
    setSuccess,
    selectedEvent,
    setSelectedEvent,
    
    // Create Event Form state/actions
    name,
    setName,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    logoUrl,
    setLogoUrl,
    visibilityRadius,
    setVisibilityRadius,
    formLoading,
    handleCreateEvent,
    
    // BBox Coordinates state/actions
    north,
    setNorth,
    south,
    setSouth,
    east,
    setEast,
    west,
    setWest,
    bboxLoading,
    showBboxMap,
    setShowBboxMap,
    handleUpdateBBox,
    captureBbox,
    fetchEvents,
  } = useEvents();

  return (
    <PageContainer>
      <HeaderSection>
        <PageTitle>Events Functionality Manager</PageTitle>
        <PageSubtitle>
          Create, select, and edit bounding boxes for events. Setting an active event carries it across other module testing interfaces.
        </PageSubtitle>
      </HeaderSection>

      <GridContainer>
        {/* Create Event Card */}
        <Card $glow>
          <Card.Header>
            <SectionHeader>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create Test Event
            </SectionHeader>
          </Card.Header>
          
          <Card.Body>
            <Form onSubmit={handleCreateEvent}>
              <Input
                label="Event Name *"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bali Jatra 2026"
              />

              <FormGroupWrapper>
                <LabelText>Description</LabelText>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief event overview..."
                  rows={2}
                />
              </FormGroupWrapper>

              <FormRow>
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  $fontMono
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  $fontMono
                />
              </FormRow>

              <Input
                label="Logo Image URL"
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                $fontMono
              />

              <Input
                label="Visibility Radius (KM) *"
                type="number"
                min="0"
                required
                value={visibilityRadius}
                onChange={(e) => setVisibilityRadius(e.target.value)}
                placeholder="0 for unlimited visibility"
                $fontMono
              />

              <Button
                type="submit"
                loading={formLoading}
                disabled={formLoading || !name}
                $variant="primary"
                $fullWidth
              >
                Add New Event
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Registered Events Card */}
        <Card>
          <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionHeader style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Registered Events ({events.length})
            </SectionHeader>
            <Button $variant="secondary" $size="sm" onClick={fetchEvents}>
              Refresh List
            </Button>
          </Card.Header>

          <Card.Body>
            {loading ? (
              <LoadingState>
                <SpinnerOverlay />
                <p>Fetching backend events...</p>
              </LoadingState>
            ) : events.length === 0 ? (
              <EmptyState>
                <p>No events found on this database.</p>
                <p className="subtext">Use the panel on the left to add one.</p>
              </EmptyState>
            ) : (
              <EventsListContainer>
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
      </GridContainer>

      {/* Active Event Bounding Box Limits Section */}
      <Card>
        <Card.Header>
          <SectionHeader>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Active Event Bounding Box Limits
          </SectionHeader>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#a1a1aa' }}>
            Define boundaries for event coordinates. These boundary values restrict map zooming and compile into the SQLite database bundle.
          </p>
        </Card.Header>

        <Card.Body>
          {selectedEvent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Map Helper Toggle Card */}
              <BBoxHelperToggle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f4f4f5' }}>
                    🗺️ Map-Based Bounds Visual Selector
                  </span>
                  <span style={{ fontSize: '11px', color: '#71717a' }}>
                    Prefer a visual drag-and-draw map option? Open our Leaflet helper to automatically calculate limits.
                  </span>
                </div>
                <Button
                  type="button"
                  $variant={showBboxMap ? 'secondary' : 'primary'}
                  $size="sm"
                  onClick={() => setShowBboxMap(!showBboxMap)}
                >
                  {showBboxMap ? '🔒 Hide Map Selector' : '🗺️ Open Map Selector'}
                </Button>
              </BBoxHelperToggle>

              {/* Visual Map Drawer */}
              {showBboxMap && (
                <MapSection>
                  <BBoxMap
                    north={north}
                    south={south}
                    east={east}
                    west={west}
                    onCapture={captureBbox}
                    selectedEvent={selectedEvent}
                    setError={(msg) => {
                      setError(msg);
                      setTimeout(() => setError(''), 4000);
                    }}
                    setSuccess={(msg) => {
                      setSuccess(msg);
                      setTimeout(() => setSuccess(''), 3000);
                    }}
                  />
                </MapSection>
              )}

              {/* Form Input Coordinate Fields */}
              <Form onSubmit={handleUpdateBBox}>
                <BBoxInputsGrid>
                  <Input
                    label="North Latitude"
                    type="number"
                    step="0.0000001"
                    required
                    value={north}
                    onChange={(e) => setNorth(e.target.value)}
                    placeholder="20.4900"
                    $fontMono
                  />
                  <Input
                    label="South Latitude"
                    type="number"
                    step="0.0000001"
                    required
                    value={south}
                    onChange={(e) => setSouth(e.target.value)}
                    placeholder="20.4700"
                    $fontMono
                  />
                  <Input
                    label="East Longitude"
                    type="number"
                    step="0.0000001"
                    required
                    value={east}
                    onChange={(e) => setEast(e.target.value)}
                    placeholder="85.9100"
                    $fontMono
                  />
                  <Input
                    label="West Longitude"
                    type="number"
                    step="0.0000001"
                    required
                    value={west}
                    onChange={(e) => setWest(e.target.value)}
                    placeholder="85.8900"
                    $fontMono
                  />
                  <Input
                    label="Visibility Radius (KM) *"
                    type="number"
                    min="0"
                    required
                    value={visibilityRadius}
                    onChange={(e) => setVisibilityRadius(e.target.value)}
                    placeholder="e.g. 50"
                    $fontMono
                  />
                  <Button
                    type="submit"
                    loading={bboxLoading}
                    disabled={bboxLoading}
                    $variant="warning"
                    style={{ marginBottom: '4px' }}
                  >
                    Update Event settings
                  </Button>
                </BBoxInputsGrid>
              </Form>
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', fontStyle: 'italic', color: '#71717a', border: '1px dashed #27272a', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
              ⚠️ Select an event in the list above to view and update its Bounding Box boundaries.
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Notifications banner */}
      {error && (
        <AlertBanner $type="error">
          <span>⚠️</span>
          <div>{error}</div>
        </AlertBanner>
      )}
      {success && (
        <AlertBanner $type="success">
          <span>✨</span>
          <div>{success}</div>
        </AlertBanner>
      )}
    </PageContainer>
  );
}


