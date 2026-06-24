'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import {
  PageContainer,
  HeaderSection,
  HeaderTitles,
  PageTitle,
  PageSubtitle,
  WorkspaceLayout,
  LotsListSection,
  SectionHeader,
  LotsGrid,
  LotCard,
  LotHeader,
  LotTitle,
  Badge,
  LotMeta,
  MetaItem,
  LotActions,
  ActionButton,
  EmptyState,
  AlertBanner,
} from './styled';

export default function ParkingLotsManager() {
  const { apiFetch, selectedEvent } = useApi();
  const activeEventId = selectedEvent?.id;

  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Slots and Price counter/editor states
  const [editedSpots, setEditedSpots] = useState<Record<string, number>>({});
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  const [savingLotId, setSavingLotId] = useState<string | null>(null);

  // Fetch parking lots
  const fetchParkingLots = async () => {
    if (!activeEventId) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/parking/events/${activeEventId}/parking`);
      if (res && res.success) {
        setParkingLots(res.data || []);
      } else {
        throw new Error(res.error || 'Failed to fetch parking lots');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load parking lots');
    } finally {
      setLoading(false);
    }
  };

  // Load lots on event selection
  useEffect(() => {
    if (activeEventId) {
      fetchParkingLots();
    } else {
      setParkingLots([]);
    }
    setEditedSpots({});
    setEditedPrices({});
  }, [activeEventId]);

  const handleIncrement = (lotId: string, currentVal: number) => {
    setEditedSpots(prev => ({
      ...prev,
      [lotId]: currentVal + 1
    }));
  };

  const handleDecrement = (lotId: string, currentVal: number) => {
    if (currentVal > 1) {
      setEditedSpots(prev => ({
        ...prev,
        [lotId]: currentVal - 1
      }));
    }
  };

  const handleSaveLotSettings = async (lot: any) => {
    const newSpots = editedSpots[lot.id] !== undefined ? editedSpots[lot.id] : lot.total_spots;
    const newPrice = editedPrices[lot.id] !== undefined ? editedPrices[lot.id] : lot.price_per_hour;

    if (newSpots === lot.total_spots && newPrice === lot.price_per_hour) return;
    if (newSpots < 1 || newPrice < 0) return;

    setSavingLotId(lot.id);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: lot.name,
        latitude: Number(lot.latitude),
        longitude: Number(lot.longitude),
        total_spots: Number(newSpots),
        price_per_hour: Number(newPrice),
        landmark: lot.landmark || undefined,
        is_active: lot.is_active
      };

      const res = await apiFetch(`/api/parking/${lot.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      if (res && res.success) {
        setSuccess(`Successfully updated settings for ${lot.name}!`);
        setEditedSpots(prev => {
          const updated = { ...prev };
          delete updated[lot.id];
          return updated;
        });
        setEditedPrices(prev => {
          const updated = { ...prev };
          delete updated[lot.id];
          return updated;
        });
        fetchParkingLots();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(res.error || 'Failed to update slots');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving');
    } finally {
      setSavingLotId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this parking lot?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await apiFetch(`/api/parking/${id}`, {
        method: 'DELETE'
      });
      if (res && res.success) {
        setSuccess('Parking lot deleted successfully!');
        fetchParkingLots();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(res.error || 'Failed to delete parking lot');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred during deletion');
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderTitles>
          <PageTitle>Parking Lots Manager</PageTitle>
          <PageSubtitle>
            Manage slots capacity, hourly pricing, and activation status for registered parking lots.
          </PageSubtitle>
        </HeaderTitles>
      </HeaderSection>

      {!activeEventId ? (
        <AlertBanner $type="warning">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <strong>No active event selected.</strong> Please go to the <strong>Events Manager</strong> tab and select an event to configure its parking lots.
          </div>
        </AlertBanner>
      ) : (
        <WorkspaceLayout>
          {error && (
            <div style={{ color: '#f87171', fontSize: '13px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '10px 14px', width: '100%', marginBottom: '4px' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ color: '#34d399', fontSize: '13px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '10px 14px', width: '100%', marginBottom: '4px' }}>
              {success}
            </div>
          )}

          {/* Parking Lots list */}
          <LotsListSection style={{ width: '100%' }}>
            <Card>
              <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SectionHeader style={{ border: 'none', margin: 0, padding: 0 }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Registered Parking Lots ({parkingLots.length})
                </SectionHeader>
                <Button $variant="secondary" $size="sm" onClick={fetchParkingLots} loading={loading}>
                  Refresh List
                </Button>
              </Card.Header>

              <Card.Body>
                {loading && parkingLots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#71717a' }}>Loading parking lots...</div>
                ) : parkingLots.length === 0 ? (
                  <EmptyState>
                    <h4>No Parking Lots Found</h4>
                    <p>Mark parking points on the route map page first, then use this page to manage their slot capacities.</p>
                  </EmptyState>
                ) : (
                  <LotsGrid>
                    {parkingLots.map((lot) => {
                      const spotsValue = editedSpots[lot.id] !== undefined ? editedSpots[lot.id] : lot.total_spots;
                      const priceValue = editedPrices[lot.id] !== undefined ? editedPrices[lot.id] : lot.price_per_hour;

                      const hasChanges = (editedSpots[lot.id] !== undefined && editedSpots[lot.id] !== lot.total_spots) ||
                                         (editedPrices[lot.id] !== undefined && editedPrices[lot.id] !== lot.price_per_hour);

                      return (
                        <LotCard key={lot.id} $isActive={hasChanges}>
                          <LotHeader>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <LotTitle>{lot.name}</LotTitle>
                              {lot.landmark && (
                                <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                                  Landmark: <strong>{lot.landmark}</strong>
                                </span>
                              )}
                            </div>
                            <Badge $variant={lot.is_active ? 'success' : 'secondary'}>
                              {lot.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </LotHeader>

                          <LotMeta>
                            <MetaItem>
                              Available: <span>{lot.available_spots} left</span>
                            </MetaItem>
                            <MetaItem>
                              Current Price: <span>{Number(lot.price_per_hour) > 0 ? `₹${lot.price_per_hour}/hr` : 'Free'}</span>
                            </MetaItem>
                          </LotMeta>

                          {/* Inline Slot & Price Editor */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '12px', 
                            padding: '12px 16px', 
                            background: 'rgba(9, 9, 11, 0.3)', 
                            borderRadius: '8px', 
                            border: '1px solid rgba(255, 255, 255, 0.05)', 
                            marginTop: '8px' 
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              {/* Slot Capacity Edit */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '600' }}>Slot Capacity</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(9, 9, 11, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden', height: '32px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleDecrement(lot.id, spotsValue)}
                                      disabled={spotsValue <= 1 || savingLotId === lot.id}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a1a1aa',
                                        width: '32px',
                                        height: '100%',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background 0.2s',
                                      }}
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      value={spotsValue === 0 ? '' : spotsValue}
                                      min="1"
                                      disabled={savingLotId === lot.id}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (!isNaN(val) && val >= 1) {
                                          setEditedSpots(prev => ({ ...prev, [lot.id]: val }));
                                        } else if (e.target.value === '') {
                                          setEditedSpots(prev => ({ ...prev, [lot.id]: 0 }));
                                        }
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        width: '50px',
                                        height: '100%',
                                        textAlign: 'center',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        outline: 'none',
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleIncrement(lot.id, spotsValue)}
                                      disabled={savingLotId === lot.id}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a1a1aa',
                                        width: '32px',
                                        height: '100%',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background 0.2s',
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span style={{ fontSize: '11px', color: '#71717a' }}>Saved: {lot.total_spots}</span>
                                </div>
                              </div>

                              {/* Price Edit */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '600' }}>Price per Hour (₹)</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(9, 9, 11, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden', height: '32px', padding: '0 8px' }}>
                                    <span style={{ fontSize: '13px', color: '#71717a', marginRight: '4px' }}>₹</span>
                                    <input
                                      type="number"
                                      value={priceValue === 0 && editedPrices[lot.id] === undefined ? 0 : priceValue}
                                      min="0"
                                      step="1"
                                      disabled={savingLotId === lot.id}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (!isNaN(val) && val >= 0) {
                                          setEditedPrices(prev => ({ ...prev, [lot.id]: val }));
                                        } else if (e.target.value === '') {
                                          setEditedPrices(prev => ({ ...prev, [lot.id]: 0 }));
                                        }
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        width: '70px',
                                        height: '100%',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        outline: 'none',
                                      }}
                                    />
                                  </div>
                                  <span style={{ fontSize: '11px', color: '#71717a' }}>Saved: {Number(lot.price_per_hour) > 0 ? `₹${lot.price_per_hour}` : 'Free'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Save Button Row */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                              <Button
                                $variant="primary"
                                $size="sm"
                                disabled={!hasChanges || spotsValue < 1 || priceValue < 0 || savingLotId === lot.id}
                                loading={savingLotId === lot.id}
                                onClick={() => handleSaveLotSettings(lot)}
                                style={{ height: '30px', padding: '0 16px', fontSize: '12px' }}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>
                              Lat: {lot.latitude} | Lng: {lot.longitude}
                            </span>
                            <LotActions>
                              <ActionButton $danger onClick={() => handleDelete(lot.id)}>
                                Delete
                              </ActionButton>
                            </LotActions>
                          </div>
                        </LotCard>
                      );
                    })}
                  </LotsGrid>
                )}
              </Card.Body>
            </Card>
          </LotsListSection>
        </WorkspaceLayout>
      )}
    </PageContainer>
  );
}
