'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../context/ApiContext';
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
  FormGroupWrapper,
  LabelText,
  TextArea,
  UploadContainer,
  PreviewImage,
  HighlightsListContainer,
  HighlightCard,
  CardThumbnail,
  CardDetails,
  CardTitle,
  CardMetaRow,
  MetaItem,
  CardDescription,
  CardActions,
  AlertBanner,
  EmptyState,
  LoadingState,
  SpinnerOverlay,
} from './styled';

interface Highlight {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  location: string | null;
  time: string | null;
  image_url: string | null;
  highlight_date: string;
  created_at: string;
  updated_at: string;
}

export default function HighlightsManager() {
  const { selectedEvent, apiFetch, token } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [highlightDate, setHighlightDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Set default date to today when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      const today = new Date().toISOString().split('T')[0];
      setHighlightDate(today);
      fetchHighlights();
    }
  }, [selectedEvent?.id]);

  const fetchHighlights = async () => {
    if (!selectedEvent) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/events/${selectedEvent.id}/highlights`);
      if (res && res.success) {
        setHighlights(res.data || []);
      } else {
        throw new Error('Failed to retrieve highlights');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch highlights list');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEvent) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiFetch(`/api/events/${selectedEvent.id}/highlights/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res && res.success && res.data?.imageUrl) {
        setImageUrl(res.data.imageUrl);
        setSuccess('Image uploaded successfully to MinIO!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Ensure MinIO is online.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setTime('');
    setImageUrl('');
    const today = new Date().toISOString().split('T')[0];
    setHighlightDate(today);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !title || !highlightDate) return;

    setFormLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      title,
      description: description || null,
      location: location || null,
      time: time || null,
      imageUrl: imageUrl || null,
      highlightDate,
    };

    try {
      if (editingId) {
        // Update highlight
        const res = await apiFetch(`/api/highlights/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res && res.success) {
          setSuccess(`Highlight "${title}" updated successfully!`);
          resetForm();
          await fetchHighlights();
        } else {
          throw new Error('Failed to update highlight');
        }
      } else {
        // Create highlight
        const res = await apiFetch(`/api/events/${selectedEvent.id}/highlights`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res && res.success) {
          setSuccess(`Highlight "${title}" created successfully!`);
          resetForm();
          await fetchHighlights();
        } else {
          throw new Error('Failed to create highlight');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save highlight');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (hl: Highlight) => {
    setEditingId(hl.id);
    setTitle(hl.title);
    setDescription(hl.description || '');
    setLocation(hl.location || '');
    setTime(hl.time || '');
    setImageUrl(hl.image_url || '');
    if (hl.highlight_date) {
      // Dates from Postgres might be full ISO strings or YYYY-MM-DD. Format to YYYY-MM-DD
      const dateOnly = hl.highlight_date.split('T')[0];
      setHighlightDate(dateOnly);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete highlight "${name}"?`)) return;

    setError('');
    setSuccess('');

    try {
      const res = await apiFetch(`/api/highlights/${id}`, {
        method: 'DELETE',
      });

      if (res && res.success) {
        setSuccess(`Highlight deleted successfully.`);
        await fetchHighlights();
      } else {
        throw new Error('Failed to delete highlight');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete highlight');
    }
  };

  // Helper to format date nicely
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
    } catch (_) {
      return dateStr;
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <PageTitle>Event Highlights Configurator</PageTitle>
        <PageSubtitle>
          Configure daily events, announcements, and scheduling highlights. These will render in the user frontend "Today's Highlights" feed.
        </PageSubtitle>
      </HeaderSection>

      {!selectedEvent ? (
        <AlertBanner $type="info">
          <span>⚠️</span>
          <div>
            <strong>No Event Selected:</strong> Please head to the <strong>Events Manager</strong> and select an active event to configure its highlights.
          </div>
        </AlertBanner>
      ) : (
        <GridContainer>
          {/* Create/Edit Form Card */}
          <Card $glow={!!editingId}>
            <Card.Header>
              <SectionHeader>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {editingId ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                {editingId ? 'Edit Highlight' : 'Create Highlight'}
              </SectionHeader>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Input
                  label="Highlight Title *"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Evening Grand Aarti"
                />

                <FormGroupWrapper>
                  <LabelText>Description</LabelText>
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about what happens in this highlight..."
                    rows={3}
                  />
                </FormGroupWrapper>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input
                    label="Scheduled Date *"
                    type="date"
                    required
                    value={highlightDate}
                    onChange={(e) => setHighlightDate(e.target.value)}
                    $fontMono
                  />
                  <Input
                    label="Scheduled Time"
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 6:30 PM"
                  />
                </div>

                <Input
                  label="Location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. South Gate Podium"
                />

                <FormGroupWrapper>
                  <LabelText>Highlight Image (MinIO upload)</LabelText>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {imageUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <PreviewImage src={imageUrl} alt="Highlight preview" />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button type="button" $variant="secondary" $size="sm" onClick={handleImageUploadClick} disabled={uploadingImage}>
                          Change Image
                        </Button>
                        <Button type="button" $variant="danger" $size="sm" onClick={() => setImageUrl('')}>
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <UploadContainer onClick={handleImageUploadClick}>
                      {uploadingImage ? (
                        <>
                          <SpinnerOverlay style={{ width: '20px', height: '20px' }} />
                          <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Uploading image to MinIO...</span>
                        </>
                      ) : (
                        <>
                          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ opacity: 0.5 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Click to select and upload an image</span>
                        </>
                      )}
                    </UploadContainer>
                  )}
                </FormGroupWrapper>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <Button
                    type="submit"
                    loading={formLoading}
                    disabled={formLoading || !title || !highlightDate}
                    $variant="primary"
                    style={{ flexGrow: 1 }}
                  >
                    {editingId ? 'Save Changes' : 'Create Highlight'}
                  </Button>
                  
                  {editingId && (
                    <Button type="button" $variant="secondary" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Highlights List Card */}
          <Card>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionHeader style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Configured Highlights ({highlights.length})
              </SectionHeader>
              <Button $variant="secondary" $size="sm" onClick={fetchHighlights} disabled={loading}>
                Refresh
              </Button>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <LoadingState>
                  <SpinnerOverlay />
                  <p>Fetching event highlights...</p>
                </LoadingState>
              ) : highlights.length === 0 ? (
                <EmptyState>
                  <p>No highlights scheduled for this event yet.</p>
                  <p className="subtext">Configure details and click save to populate the homepage highlights list.</p>
                </EmptyState>
              ) : (
                <HighlightsListContainer>
                  {highlights.map((hl) => (
                    <HighlightCard key={hl.id}>
                      {hl.image_url ? (
                        <CardThumbnail src={hl.image_url} alt={hl.title} />
                      ) : (
                        <div style={{ width: '120px', height: '80px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          📸
                        </div>
                      )}
                      
                      <CardDetails>
                        <CardTitle>{hl.title}</CardTitle>
                        
                        <CardMetaRow>
                          <MetaItem>
                            📅 {formatDateString(hl.highlight_date)}
                          </MetaItem>
                          {hl.time && (
                            <MetaItem>
                              ⏰ {hl.time}
                            </MetaItem>
                          )}
                          {hl.location && (
                            <MetaItem>
                              📍 {hl.location}
                            </MetaItem>
                          )}
                        </CardMetaRow>

                        {hl.description && (
                          <CardDescription>{hl.description}</CardDescription>
                        )}
                      </CardDetails>

                      <CardActions>
                        <Button $variant="secondary" $size="sm" onClick={() => handleEdit(hl)}>
                          Edit
                        </Button>
                        <Button $variant="danger" $size="sm" onClick={() => handleDelete(hl.id, hl.title)}>
                          Delete
                        </Button>
                      </CardActions>
                    </HighlightCard>
                  ))}
                </HighlightsListContainer>
              )}
            </Card.Body>
          </Card>
        </GridContainer>
      )}

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
