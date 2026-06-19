'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  PageWrapper,
  HeaderSection,
  PageTitle,
  PageDescription,
  AnonymousRestrictionBanner,
  BannerTitle,
  BannerText,
  NotificationLayoutGrid,
  PanelHeaderTitleWrapper,
  LoadingEventsText,
  DropdownSelect,
  CardBodyWrapper,
  TemplateSection,
  SectionLabel,
  TemplatesList,
  TemplateButton,
  TemplateDot,
  ComposeForm,
  FormGroup,
  Label,
  TextareaField,
  CoordinatesGrid,
  EmergencyCheckboxWrapper,
  CheckboxInput,
  CheckboxLabel,
  PulseDot,
  SyncButton,
  HistoryLoadingBox,
  HistorySpinner,
  HistoryEmptyBox,
  HistoryListScrollArea,
  HistoryItem,
  HistoryItemHeader,
  HistoryItemTitle,
  HistoryItemDot,
  HistoryItemTime,
  HistoryItemMessage,
  HistoryGeotarget,
  ErrorOverlayBanner,
  SuccessOverlayBanner,
} from './styled';
import {
  AlertTriangle,
  CheckCircle2,
  History,
  Radio,
  Megaphone,
  MapPin
} from 'lucide-react';


export default function SendNotificationPage() {
  const { apiFetch, selectedEvent, setSelectedEvent, token } = useApi();

  const [events, setEvents] = useState<any[]>([]);
  const [targetEventId, setTargetEventId] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Execution states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Notification history state
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Quick compose templates
  const templates = [
    {
      color: '#ef4444',
      label: 'Route Change',
      title: 'ROUTE CHANGE',
      message: 'Bada Danda near Gate 3 is now closed due to crowd surge. Use alternate path via Lion\'s Gate sector.',
      isEmergency: true,
      lat: '20.294120',
      lng: '85.892340'
    },
    {
      color: '#10b981',
      label: 'Service Update',
      title: 'SERVICE UPDATE',
      message: 'Drinking water tankers now available near Swargadwara Ghat. 2 tankers operational.',
      isEmergency: false,
      lat: '20.283120',
      lng: '85.908230'
    },
    {
      color: '#f59e0b',
      label: 'Crowd Advisory',
      title: 'CROWD ADVISORY',
      message: 'Singhadwara (Main Temple Gate) is very crowded. Expected wait 45-60 min. Darshan via east gate is faster today.',
      isEmergency: false,
      lat: '20.301540',
      lng: '85.885610'
    }
  ];

  // Fetch all registered events
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoadingEvents(true);
        const res = await apiFetch('/api/events');
        if (res && res.success) {
          const list = res.data || [];
          setEvents(list);
          // Set initial target to active context event if valid
          if (selectedEvent && list.some((e: any) => e.id === selectedEvent.id)) {
            setTargetEventId(selectedEvent.id);
          } else if (list.length > 0) {
            setTargetEventId(list[0].id);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events list');
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, [selectedEvent]);

  // Synchronize dynamic history logs when selected target event changes
  useEffect(() => {
    if (targetEventId) {
      fetchHistory();
      
      // Update global context active event if changed in dropdown to keep sidebar in sync
      const matchingEvent = events.find(e => e.id === targetEventId);
      if (matchingEvent && (!selectedEvent || selectedEvent.id !== targetEventId)) {
        setSelectedEvent(matchingEvent);
      }
    }
  }, [targetEventId, events]);

  const fetchHistory = async () => {
    if (!targetEventId) return;
    try {
      setLoadingHistory(true);
      const res = await apiFetch(`/api/notifications/events/${targetEventId}`);
      if (res && res.success) {
        setHistory(res.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load alert history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const applyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setMessage(tpl.message);
    setIsEmergency(tpl.isEmergency);
    setLatitude(tpl.lat);
    setLongitude(tpl.lng);
    setSuccess('Template pre-filled successfully!');
    setTimeout(() => setSuccess(''), 2500);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEventId) {
      setError('Please select a target event for broadcast.');
      return;
    }
    if (!title.trim() || !message.trim()) {
      setError('Title and Message content are required.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const payload: any = {
        eventId: targetEventId,
        title: title.trim(),
        message: message.trim(),
        isEmergency,
      };

      if (latitude.trim() && longitude.trim()) {
        payload.latitude = parseFloat(latitude);
        payload.longitude = parseFloat(longitude);
        if (isNaN(payload.latitude) || isNaN(payload.longitude)) {
          throw new Error('Coordinates must be valid decimals');
        }
      }

      const res = await apiFetch('/api/notifications/send', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res && res.success) {
        setSuccess('Alert broadcast processed successfully and logged to database!');
        // Reset form
        setTitle('');
        setMessage('');
        setIsEmergency(false);
        setLatitude('');
        setLongitude('');
        
        // Refresh feed list
        fetchHistory();
      } else {
        throw new Error(res.message || 'Notification broadcast failed');
      }
    } catch (err: any) {
      setError(err.message || 'Server error broadcasting notification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper className="fade-in">
      <HeaderSection>
        <PageTitle>Notification Broadcast Console</PageTitle>
        <PageDescription>
          Compose and instantly stream emergency alerts, route updates, or crowd notices directly to offline user mobile client devices.
        </PageDescription>
      </HeaderSection>

      {!token && (
        <AnonymousRestrictionBanner>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <BannerTitle>Anonymous Mode Restriction</BannerTitle>
            <BannerText>
              You are currently operating in <strong>Anonymous Mode</strong>. Since notification broadcasting requires verified admin permissions, the <code>/api/notifications/send</code> API will reject unauthorized calls. Please authenticate with your phone number and OTP code first.
            </BannerText>
          </div>
        </AnonymousRestrictionBanner>
      )}

      {/* Main Grid split */}
      <NotificationLayoutGrid>
        
        {/* Form Panel */}
        <Card>
          <Card.Header>
            <PanelHeaderTitleWrapper>
              <Megaphone className="w-5 h-5" style={{ color: '#22d3ee' }} />
              <span>Compose Live Broadcast</span>
            </PanelHeaderTitleWrapper>

            {loadingEvents ? (
              <LoadingEventsText>Loading events...</LoadingEventsText>
            ) : (
              <DropdownSelect
                value={targetEventId}
                onChange={(e) => setTargetEventId(e.target.value)}
              >
                <option value="">-- Choose Target Event --</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </DropdownSelect>
            )}
          </Card.Header>
          <CardBodyWrapper>
            {/* Quick compose helper banner */}
            <TemplateSection>
              <SectionLabel>Quick Templates</SectionLabel>
              <TemplatesList>
                {templates.map((tpl, i) => (
                  <TemplateButton
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                  >
                    <TemplateDot $color={tpl.color} />
                    <span>{tpl.label}</span>
                  </TemplateButton>
                ))}
              </TemplatesList>
            </TemplateSection>

            <ComposeForm onSubmit={handleBroadcast}>
              <Input
                label="Alert Title *"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ROUTE CHANGE, SERVICE UPDATE, CROWD ADVISORY"
                style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}
              />

              <FormGroup>
                <Label>Detailed Message Description *</Label>
                <TextareaField
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write clear instructions for crowd safety..."
                  rows={4}
                />
              </FormGroup>

              {/* Geotarget */}
              <CoordinatesGrid>
                <Input
                  label="Map Latitude (Optional)"
                  type="number"
                  step="0.000001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="20.29412"
                  $fontMono
                />
                <Input
                  label="Map Longitude (Optional)"
                  type="number"
                  step="0.000001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="85.89234"
                  $fontMono
                />
              </CoordinatesGrid>

              {/* Emergency Checkbox Toggle */}
              <EmergencyCheckboxWrapper>
                <CheckboxInput
                  type="checkbox"
                  id="emergency"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                />
                <CheckboxLabel htmlFor="emergency">
                  <PulseDot $color="#ef4444" />
                  <span>Flag as Emergency Chariot / Route Incident</span>
                </CheckboxLabel>
              </EmergencyCheckboxWrapper>

              <Button
                type="submit"
                $variant="primary"
                $fullWidth
                disabled={submitting || !title || !message}
                icon={!submitting && <Radio className="w-4 h-4" />}
                loading={submitting}
              >
                Broadcast Alert Now
              </Button>
            </ComposeForm>
          </CardBodyWrapper>
        </Card>

        {/* Live Broadcast Feed Logs */}
        <Card style={{ maxHeight: '640px', display: 'flex', flexDirection: 'column' }}>
          <Card.Header>
            <PanelHeaderTitleWrapper>
              <History className="w-4 h-4" style={{ color: '#a1a1aa' }} />
              <span>Broadcast Log</span>
            </PanelHeaderTitleWrapper>
            <SyncButton onClick={fetchHistory}>
              Sync
            </SyncButton>
          </Card.Header>
          <CardBodyWrapper style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {loadingHistory ? (
              <HistoryLoadingBox>
                <HistorySpinner />
                <p>Fetching feed list...</p>
              </HistoryLoadingBox>
            ) : history.length === 0 ? (
              <HistoryEmptyBox>
                <p>No logged broadcasts for this event yet.</p>
                <p className="sub-desc">Submit the composer form to broadcast.</p>
              </HistoryEmptyBox>
            ) : (
              <HistoryListScrollArea>
                {history.map((h) => {
                  let indicatorColor = '#22d3ee'; // default cyan
                  if (h.is_emergency) {
                    indicatorColor = '#ef4444'; // red
                  } else if (h.title.includes('SERVICE')) {
                    indicatorColor = '#10b981'; // green
                  } else if (h.title.includes('ADVISORY')) {
                    indicatorColor = '#f59e0b'; // amber
                  }

                  return (
                    <HistoryItem key={h.id} $color={indicatorColor}>
                      <HistoryItemHeader>
                        <HistoryItemTitle>
                          <HistoryItemDot $color={indicatorColor} />
                          <span>{h.title}</span>
                        </HistoryItemTitle>
                        <HistoryItemTime>
                          {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </HistoryItemTime>
                      </HistoryItemHeader>

                      <HistoryItemMessage>{h.message}</HistoryItemMessage>

                      {h.latitude && h.longitude && (
                        <HistoryGeotarget>
                          <MapPin className="w-2.5 h-2.5" />
                          <span>Geotarget: {Number(h.latitude).toFixed(5)}, {Number(h.longitude).toFixed(5)}</span>
                        </HistoryGeotarget>
                      )}
                    </HistoryItem>
                  );
                })}
              </HistoryListScrollArea>
            )}
          </CardBodyWrapper>
        </Card>
      </NotificationLayoutGrid>

      {/* Global alert feedback overlay banners */}
      {error && (
        <ErrorOverlayBanner>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </ErrorOverlayBanner>
      )}
      {success && (
        <SuccessOverlayBanner>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </SuccessOverlayBanner>
      )}
    </PageWrapper>
  );
}


