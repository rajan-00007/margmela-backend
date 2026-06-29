import { useState, useEffect } from 'react';
import { useApi } from '../../../app/context/ApiContext';

export const useEvents = () => {
  const {
    apiFetch,
    selectedEvent,
    setSelectedEvent,
    events,
    eventsLoading: loading,
    fetchEvents,
    eventsError,
  } = useApi();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Event creation form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [visibilityRadius, setVisibilityRadius] = useState('0');
  const [formLoading, setFormLoading] = useState(false);

  // Bounding Box state
  const [north, setNorth] = useState('');
  const [south, setSouth] = useState('');
  const [east, setEast] = useState('');
  const [west, setWest] = useState('');
  const [bboxLoading, setBboxLoading] = useState(false);
  const [showBboxMap, setShowBboxMap] = useState(false);

  const handleFetchEvents = async () => {
    setError('');
    await fetchEvents();
  };

  // Load registered events list on mount
  useEffect(() => {
    handleFetchEvents();
  }, []);

  // Sync global eventsError to local error
  useEffect(() => {
    if (eventsError) {
      setError(eventsError);
    }
  }, [eventsError]);

  // Pre-fill bounding box fields when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setNorth(selectedEvent.north !== null ? String(selectedEvent.north) : '');
      setSouth(selectedEvent.south !== null ? String(selectedEvent.south) : '');
      setEast(selectedEvent.east !== null ? String(selectedEvent.east) : '');
      setWest(selectedEvent.west !== null ? String(selectedEvent.west) : '');
      
      const meta = selectedEvent.metadata || {};
      setVisibilityRadius(meta.visibility !== undefined ? String(meta.visibility) : '0');
    }
  }, [selectedEvent]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description: description || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          logo_url: logoUrl || undefined,
          metadata: {
            visibility: visibilityRadius !== '' ? Number(visibilityRadius) : 0
          }
        }),
      });

      if (response.success && response.data) {
        setSuccess(`Event "${response.data.name}" created successfully!`);
        setName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setLogoUrl('');
        setVisibilityRadius('0');
        
        await fetchEvents();
      } else {
        throw new Error('Server did not return the newly created event data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateBBox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setBboxLoading(true);
    setError('');
    setSuccess('');

    try {
      const existingMeta = selectedEvent.metadata || {};
      const response = await apiFetch(`/api/events/${selectedEvent.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          north: north !== '' ? Number(north) : null,
          south: south !== '' ? Number(south) : null,
          east: east !== '' ? Number(east) : null,
          west: west !== '' ? Number(west) : null,
          metadata: {
            ...existingMeta,
            visibility: visibilityRadius !== '' ? Number(visibilityRadius) : 0
          }
        }),
      });

      if (response.success && response.data) {
        setSuccess('Bounding Box coordinates & visibility radius updated successfully!');
        setSelectedEvent(response.data);
        await fetchEvents();
      } else {
        throw new Error('Server did not return the updated event data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update bounding box');
    } finally {
      setBboxLoading(false);
    }
  };

  const captureBbox = (s: string, n: string, w: string, e: string) => {
    setSouth(s);
    setNorth(n);
    setWest(w);
    setEast(e);
    setSuccess('Loaded Bounding Box coordinates successfully from map selection!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return {
    events,
    loading,
    error,
    success,
    setError,
    setSuccess,
    selectedEvent,
    setSelectedEvent,
    
    // Create Event Form
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
    
    // BBox Coordinates Form
    north,
    setNorth,
    south,
    setSouth,
    east,
    setEast,
    west,
    setWest,
    bboxLoading,
    setBboxLoading,
    showBboxMap,
    setShowBboxMap,
    handleUpdateBBox,
    captureBbox,
    fetchEvents: handleFetchEvents,
  };
};
