'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useApi } from '../context/ApiContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Map, 
  MapPin, 
  Undo2, 
  Car, 
  Layers,
  ChevronRight,
  Route,
  Navigation
} from 'lucide-react';
import {
  PageContainer,
  HeaderSection,
  HeaderTitles,
  PageTitle,
  PageSubtitle,
  EmptyStateWrapper,
  WorkspaceLayout,
  SidebarPanel,
  MapPanel,
  MapWrapper,
  FloatingToolbar,
  ToolbarButton,
  FormSection,
  FormGroup,
  Label,
  TextareaField,
  CheckboxGroup,
  CheckboxLabel,
  InfoBar,
  PanelTitleRow,
  ZonesList,
  ZoneCard,
  TextButton
} from './styled';

import { ZoneItem, ZONE_COLORS } from './ZonesMap';

// Dynamically import Leaflet Map to avoid SSR compilation errors
const ZonesMap = dynamic(
  () => import('./ZonesMap'),
  { ssr: false }
);

export default function ZonesManagerPage() {
  const { apiFetch, selectedEvent } = useApi();

  // Core Data States
  const [zones, setZones] = useState<any[]>([]);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  
  // Drawing States
  const [drawMode, setDrawMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<{ lat: number; lng: number }[]>([]);

  // Form Fields
  const [name, setName] = useState('');
  const [allowPedestrians, setAllowPedestrians] = useState(true);
  const [allow2wheelers, setAllow2wheelers] = useState(true);
  const [allowCars, setAllowCars] = useState(true);
  const [advisory, setAdvisory] = useState('');

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch zones for the active event
  useEffect(() => {
    if (selectedEvent) {
      loadZones();
      handleClearDrawing();
    } else {
      setZones([]);
      setActiveZoneId(null);
    }
  }, [selectedEvent]);

  const loadZones = async () => {
    if (!selectedEvent) return;
    try {
      setLoading(true);
      setError('');
      
      // Fetch zones with asset counts (?stats=true)
      const res = await apiFetch(`/api/events/${selectedEvent.id}/zones?stats=true`);
      if (res && res.success) {
        setZones(res.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading zones');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDrawing = () => {
    setDrawMode(true);
    setDrawnPoints([]);
    setActiveZoneId(null);
    setName('');
    setAllowPedestrians(true);
    setAllow2wheelers(true);
    setAllowCars(true);
    setAdvisory('');
    setSuccess('Draw Mode Activated! Click points on the map to define the zone polygon.');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleUndoPoint = () => {
    if (drawnPoints.length === 0) return;
    setDrawnPoints((prev) => prev.slice(0, -1));
  };

  const handleClearDrawing = () => {
    setDrawMode(false);
    setDrawnPoints([]);
    setName('');
    setAllowPedestrians(true);
    setAllow2wheelers(true);
    setAllowCars(true);
    setAdvisory('');
  };

  const handleSelectZone = (id: string) => {
    setActiveZoneId(id);
    setDrawMode(false);
    
    const zone = zones.find((z) => z.id === id);
    if (zone) {
      setName(zone.name);
      setAllowPedestrians(zone.allow_pedestrians);
      setAllow2wheelers(zone.allow_2wheelers);
      setAllowCars(zone.allow_cars);
      setAdvisory(zone.advisory || '');
    }
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!name.trim()) {
      setError('Zone Name is required.');
      return;
    }

    if (drawnPoints.length < 3) {
      setError('A zone polygon must contain at least 3 points. Click on the map to draw.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await apiFetch(`/api/events/${selectedEvent.id}/zones`, {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          boundary: drawnPoints,
          allow_pedestrians: allowPedestrians,
          allow_2wheelers: allow2wheelers,
          allow_cars: allowCars,
          advisory: advisory.trim() || null
        })
      });

      if (res && res.success) {
        setSuccess('Zone created and saved successfully! Existing event POIs and waypoints have been aligned.');
        handleClearDrawing();
        loadZones();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save zone');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this zone? All linked assets (POIs, Waypoints) will be unlinked (set to null).')) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await apiFetch(`/api/events/${selectedEvent.id}/zones/${id}`, {
        method: 'DELETE'
      });

      if (res && res.success) {
        setSuccess('Zone deleted successfully!');
        setActiveZoneId(null);
        handleClearDrawing();
        loadZones();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete zone');
    } finally {
      setLoading(false);
    }
  };

  const checkIsOutsideBBox = (points: { lat: number; lng: number }[]) => {
    if (!selectedEvent || points.length === 0) return false;
    const { north, south, east, west } = selectedEvent;
    if (north === null || south === null || east === null || west === null) return false;

    return points.some(p => 
      p.lat > Number(north) || 
      p.lat < Number(south) || 
      p.lng > Number(east) || 
      p.lng < Number(west)
    );
  };

  const isOutsideBounds = checkIsOutsideBBox(drawnPoints);

  if (!selectedEvent) {
    return (
      <PageContainer>
        <HeaderSection>
          <HeaderTitles>
            <PageTitle>Zones Manager</PageTitle>
            <PageSubtitle>Divide physical event area into segments, restrict transport vehicles, and issue advisories.</PageSubtitle>
          </HeaderTitles>
        </HeaderSection>
        <EmptyStateWrapper>
          <AlertTriangle size={32} style={{ color: '#fbbf24' }} />
          <h4>No Event Selected</h4>
          <p>Please select an active event in the main header to access the zones manager workspace.</p>
        </EmptyStateWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderTitles>
          <PageTitle>Zones Manager</PageTitle>
          <PageSubtitle>
            Event: <strong>{selectedEvent.name}</strong> • Divide map into physical zones, define rules, and target advisories.
          </PageSubtitle>
        </HeaderTitles>
      </HeaderSection>

      {error && (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '13px' }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34d399', fontSize: '13px' }}>
          ✅ {success}
        </div>
      )}

      <WorkspaceLayout>
        {/* Left Control Panel */}
        <SidebarPanel>
          {/* Section A: Create / Edit Zone Form */}
          <Card style={{ padding: '16px' }}>
            <FormSection onSubmit={handleSaveZone}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  {drawMode ? 'Draw New Zone' : activeZoneId ? 'Zone Specifications' : 'Configure Zones'}
                </h3>
                {!drawMode && !activeZoneId && (
                  <Button type="button" $variant="primary" onClick={handleStartDrawing} style={{ padding: '6px 12px', fontSize: '11px' }}>
                    <Plus size={12} style={{ marginRight: '4px' }} /> Draw Zone
                  </Button>
                )}
              </div>

              {drawMode ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
                    <Input
                      label="Zone Name *"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zone A, VIP Enclosure"
                      required
                    />

                    <FormGroup>
                      <Label>Allowed Transportation Modes</Label>
                      <CheckboxGroup>
                        <CheckboxLabel $checked={allowPedestrians}>
                          <input
                            type="checkbox"
                            checked={allowPedestrians}
                            onChange={(e) => setAllowPedestrians(e.target.checked)}
                          />
                          <span>🚶 Pedestrians</span>
                        </CheckboxLabel>
                        <CheckboxLabel $checked={allow2wheelers}>
                          <input
                            type="checkbox"
                            checked={allow2wheelers}
                            onChange={(e) => setAllow2wheelers(e.target.checked)}
                          />
                          <span>🏍️ 2-Wheelers</span>
                        </CheckboxLabel>
                        <CheckboxLabel $checked={allowCars}>
                          <input
                            type="checkbox"
                            checked={allowCars}
                            onChange={(e) => setAllowCars(e.target.checked)}
                          />
                          <span>🚗 Cars</span>
                        </CheckboxLabel>
                      </CheckboxGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label>Zone Advisory Message (Optional)</Label>
                      <TextareaField
                        value={advisory}
                        onChange={(e) => setAdvisory(e.target.value)}
                        placeholder="e.g. High congestion expected between 4 PM to 8 PM. Pedestrian traffic only."
                        rows={3}
                      />
                    </FormGroup>

                    <InfoBar>
                      <span>
                        Click on the map to place boundary points. Plotted: <strong>{drawnPoints.length}</strong> points. (Need at least 3).
                      </span>
                    </InfoBar>

                    {isOutsideBounds && (
                      <div style={{ padding: '8px 10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', color: '#fbbf24', fontSize: '11.5px', lineHeight: '1.4' }}>
                        ⚠️ Warning: Some coordinates of this zone lie outside the event area boundary. Admins should review.
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <Button type="button" $variant="secondary" onClick={handleClearDrawing} style={{ flex: 1 }}>
                      Cancel
                    </Button> 
                    <Button type="submit" $variant="success" style={{ flex: 2 }} disabled={loading || drawnPoints.length < 3 || !name.trim()}>
                      {loading ? 'Saving...' : 'Save Zone'}
                    </Button>
                  </div>
                </>
              ) : activeZoneId ? (
                // View Mode
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', maxHeight: '280px', overflowY: 'auto', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#71717a', fontWeight: '700', textTransform: 'uppercase' }}>Zone Name</span>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>{name}</div>
                    </div>

                    <div>
                      <span style={{ fontSize: '10px', color: '#71717a', fontWeight: '700', textTransform: 'uppercase' }}>Allowed Vehicles</span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '11px', padding: '3px 8px', background: allowPedestrians ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: allowPedestrians ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: allowPedestrians ? '#34d399' : '#f87171' }}>
                          🚶 Pedestrians
                        </span>
                        <span style={{ fontSize: '11px', padding: '3px 8px', background: allow2wheelers ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: allow2wheelers ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: allow2wheelers ? '#34d399' : '#f87171' }}>
                          🏍️ 2-Wheelers
                        </span>
                        <span style={{ fontSize: '11px', padding: '3px 8px', background: allowCars ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: allowCars ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: allowCars ? '#34d399' : '#f87171' }}>
                          🚗 Cars
                        </span>
                      </div>
                    </div>

                    {advisory && (
                      <div>
                        <span style={{ fontSize: '10px', color: '#71717a', fontWeight: '700', textTransform: 'uppercase' }}>Active Advisory</span>
                        <div style={{ fontSize: '12px', color: '#e4e4e7', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '3px solid #f59e0b', padding: '6px 8px', borderRadius: '4px', marginTop: '4px', lineHeight: '1.4' }}>
                          {advisory}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <Button type="button" $variant="secondary" onClick={() => setActiveZoneId(null)} style={{ flex: 1 }}>
                      Close Specs
                    </Button>
                    <Button type="button" $variant="danger" onClick={() => handleDeleteZone(activeZoneId)} style={{ flex: 1 }} disabled={loading}>
                      <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete Zone
                    </Button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', gap: '8px', color: '#a1a1aa', fontSize: '12px', padding: '16px 8px', textAlign: 'center' }}>
                  Select a zone shape on the map or from the list below to manage. Or click "Draw Zone" to create a new one.
                </div>
              )}
            </FormSection>
          </Card>

          {/* Section B: Existing Zones List */}
          <PanelTitleRow>
            <h3>Zones Catalog</h3>
            <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '600' }}>{zones.length} Zones</span>
          </PanelTitleRow>

          <ZonesList>
            {zones.length === 0 ? (
              <div style={{ color: '#71717a', fontSize: '12px', padding: '24px', border: '1px dashed #27272a', borderRadius: '12px', textAlign: 'center' }}>
                No zones drawn for this event yet.
              </div>
            ) : (
              zones.map((zone, index) => {
                const color = ZONE_COLORS[index % ZONE_COLORS.length];
                const isSelected = zone.id === activeZoneId;
                
                return (
                  <ZoneCard 
                    key={zone.id} 
                    $selected={isSelected}
                    onClick={() => handleSelectZone(zone.id)}
                  >
                    <div className="header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="color-dot" style={{ backgroundColor: color }}></span>
                        <h4 className="title">{zone.name}</h4>
                      </div>
                      <ChevronRight size={14} style={{ color: isSelected ? '#34d399' : '#52525b' }} />
                    </div>

                    {zone.advisory && (
                      <p className="advisory">{zone.advisory}</p>
                    )}

                    <div className="rules">
                      <span className={`rule-item ${zone.allow_pedestrians ? 'allowed' : 'restricted'}`}>
                        🚶 Ped
                      </span>
                      <span className={`rule-item ${zone.allow_2wheelers ? 'allowed' : 'restricted'}`}>
                        🏍️ Moto
                      </span>
                      <span className={`rule-item ${zone.allow_cars ? 'allowed' : 'restricted'}`}>
                        🚗 Car
                      </span>
                    </div>
        
                    {/* Render live PostgreSQL counts */}
                    <div className="stats">
                      <div className="stat-badge" title="Points of Interest inside this zone">
                        <MapPin size={10} style={{ color: '#fbbf24' }} />
                        <span>{zone.poi_count} POIs</span>
                      </div>
                      <div className="stat-badge" title="Parking lots inside this zone">
                        <Car size={10} style={{ color: '#3b82f6' }} />
                        <span>{zone.parking_count} Parking</span>
                      </div>
                      <div className="stat-badge" title="Route Graph Waypoints inside this zone">
                        <Route size={10} style={{ color: '#8b5cf6' }} />
                        <span>{zone.node_count} Nodes</span>
                      </div>
                    </div>
                  </ZoneCard>
                );
              })
            )}
          </ZonesList>
        </SidebarPanel>

        {/* Right Map Canvas Panel */}
        <MapPanel>
          {drawMode && (
            <FloatingToolbar>
              <ToolbarButton type="button" onClick={handleUndoPoint} disabled={drawnPoints.length === 0}>
                <Undo2 size={12} /> Undo Point
              </ToolbarButton>
              <ToolbarButton type="button" onClick={handleClearDrawing} style={{ color: '#f87171' }}>
                🧹 Clear Drawing
              </ToolbarButton>
            </FloatingToolbar>
          )}

          <MapWrapper>
            <ZonesMap
              selectedEvent={selectedEvent}
              zones={zones}
              activeZoneId={activeZoneId}
              drawnPoints={drawnPoints}
              setDrawnPoints={setDrawnPoints}
              drawMode={drawMode}
              onSelectZone={handleSelectZone}
            />
          </MapWrapper>
        </MapPanel>
      </WorkspaceLayout>
    </PageContainer>
  );
}
