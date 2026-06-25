'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useApi } from '../context/ApiContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AlertTriangle, Plus, ShieldAlert, Trash2, MapPin, Shuffle, CheckCircle, Info, Sparkles } from 'lucide-react';
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
  FloatingTools,
  ActionButton,
  FormSection,
  FormGroup,
  Label,
  TextareaField,
  InfoBar,
  SelectorPillGrid,
  SelectorPill,
  PanelTitleRow,
  AdvisoriesList,
  AdvisoryCard,
  ToggleSwitch,
  ToggleInput,
  ToggleSlider,
  TextButton,
  TemplateGrid,
  TemplateChip,
} from './styled';

import { NodeItem, EdgeItem } from './AdvisoryMap';

// Dynamically import Leaflet Map to avoid Next.js SSR build issues (as Leaflet accesses window)
const AdvisoryMap = dynamic(
  () => import('./AdvisoryMap'),
  { ssr: false }
);

// Client-side Dijkstra router for auto-detour calculations
const findAutoDetourPath = (
  nodes: NodeItem[],
  edges: EdgeItem[],
  startId: string,
  endId: string,
  blockedEdgeIds: Set<string>
): string[] | null => {
  if (startId === endId) return [];

  const graph: Record<string, { node: NodeItem; neighbors: { targetId: string; edgeId: string; distance: number }[] }> = {};
  nodes.forEach((node) => {
    graph[node.id] = { node, neighbors: [] };
  });

  edges.forEach((edge) => {
    if (blockedEdgeIds.has(edge.id)) return; // Skip blocked segments

    const sId = edge.start_node_id;
    const eId = edge.end_node_id;

    if (graph[sId] && graph[eId]) {
      graph[sId].neighbors.push({ targetId: eId, edgeId: edge.id, distance: edge.distance });
      graph[eId].neighbors.push({ targetId: sId, edgeId: edge.id, distance: edge.distance });
    }
  });

  const distances: Record<string, number> = {};
  const previous: Record<string, any> = {};
  const unvisited = new Set<string>();

  nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  if (distances[startId] === undefined || distances[endId] === undefined) return null;
  distances[startId] = 0;

  while (unvisited.size > 0) {
    let currentNodeId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((nodeId) => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    });

    if (currentNodeId === null || minDistance === Infinity) break;
    if (currentNodeId === endId) break;

    unvisited.delete(currentNodeId);

    const neighbors = graph[currentNodeId].neighbors;
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.targetId)) continue;
      const alt = distances[currentNodeId] + neighbor.distance;
      if (alt < distances[neighbor.targetId]) {
        distances[neighbor.targetId] = alt;
        previous[neighbor.targetId] = { nodeId: currentNodeId, edgeId: neighbor.edgeId };
      }
    }
  }

  if (distances[endId] === Infinity) return null;

  const pathEdgeIds: string[] = [];
  let curr: string | null = endId;
  while (curr !== null) {
    const prevInfo: any = previous[curr];
    if (prevInfo === null) break;
    pathEdgeIds.push(prevInfo.edgeId);
    curr = prevInfo.nodeId;
  }

  return pathEdgeIds;
};

export default function TrafficAdvisoriesPage() {
  const { apiFetch, selectedEvent } = useApi();

  // Core Data States
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [edges, setEdges] = useState<EdgeItem[]>([]);
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [eventZones, setEventZones] = useState<any[]>([]);
  
  // UI Selection States
  const [startNodeId, setStartNodeId] = useState<string | null>(null);
  const [endNodeId, setEndNodeId] = useState<string | null>(null);
  const [lastDrawNodeId, setLastDrawNodeId] = useState<string | null>(null);
  const [advisoryEdges, setAdvisoryEdges] = useState<Record<string, 'blocked' | 'recommended'>>({});
  const [pickMode, setPickMode] = useState<'toggle' | 'start' | 'end' | 'draw'>('toggle');

  // Form Fields
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([]);
  const [advisoryType, setAdvisoryType] = useState<'zone' | 'road'>('road');
  const [statusTag, setStatusTag] = useState<'stable' | 'warning' | 'congested' | 'critical' | 'general'>('general');

  // Status Banners
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Quick Presets
  const presets = [
    {
      label: 'Main Gate Surge',
      title: 'Main Gate Divert',
      message: 'Route closed near Gate 1 due to high crowd density. All incoming traffic redirected via sector 2 bypass route.',
    },
    {
      label: 'Grand Road Block',
      title: 'Grand Road Closure',
      message: 'Bada Danda main avenue is restricted. Please follow the alternative green arrow route for safety.',
    },
    {
      label: 'Chariot Station detour',
      title: 'Chariot Stand Blockage',
      message: 'Transit stand congested. Detour route operational via outer ring link road.',
    }
  ];

  // Fetch Event Routes and Existing Advisories
  useEffect(() => {
    if (selectedEvent) {
      loadEventData();
    } else {
      setNodes([]);
      setEdges([]);
      setAdvisories([]);
    }
  }, [selectedEvent]);

  const loadEventData = async () => {
    if (!selectedEvent) return;
    try {
      setLoading(true);
      setError('');

      // 1. Fetch Route Graph
      const routesRes = await apiFetch(`/api/events/${selectedEvent.id}/routes`);
      if (routesRes && (routesRes.success || routesRes.status === 'success') && routesRes.data) {
        setNodes(routesRes.data.nodes || []);
        setEdges(routesRes.data.edges || []);
      } else {
        setNodes([]);
        setEdges([]);
      }

      // 2. Fetch Advisories
      const advisoriesRes = await apiFetch(`/api/events/${selectedEvent.id}/advisories`);
      if (advisoriesRes && advisoriesRes.success) {
        setAdvisories(advisoriesRes.data || []);
      }

      // 3. Fetch Zones
      const zonesRes = await apiFetch(`/api/events/${selectedEvent.id}/zones`);
      if (zonesRes && zonesRes.success) {
        setEventZones(zonesRes.data || []);
      } else {
        setEventZones([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading event route configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setTitle(preset.title);
    setMessage(preset.message);
    setSuccess('Advisory template details prefilled!');
    setTimeout(() => setSuccess(''), 2500);
  };

  // Run auto-detour pathfinding helper
  const handleAutoGenerateDetour = () => {
    if (!startNodeId || !endNodeId) {
      setError('Please select detour Start and End waypoints on the map first.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    const blockedEdges = new Set<string>(
      Object.keys(advisoryEdges).filter((key) => advisoryEdges[key] === 'blocked')
    );

    const detourPathEdges = findAutoDetourPath(nodes, edges, startNodeId, endNodeId, blockedEdges);

    if (detourPathEdges === null) {
      setError('No alternative detour path found between the selected nodes avoiding the blocked segments!');
      setTimeout(() => setError(''), 5000);
    } else {
      setAdvisoryEdges((prev) => {
        const next = { ...prev };
        // Clean out previous recommended labels
        Object.keys(next).forEach((key) => {
          if (next[key] === 'recommended') {
            delete next[key];
          }
        });
        // Assign new recommended labels
        detourPathEdges.forEach((id) => {
          next[id] = 'recommended';
        });
        return next;
      });
      setSuccess('Detour path automatically computed and highlighted in GREEN!');
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const handleClearAdvisoryDraft = () => {
    setStartNodeId(null);
    setEndNodeId(null);
    setLastDrawNodeId(null);
    setAdvisoryEdges({});
    setTitle('');
    setMessage('');
    setSelectedZoneIds([]);
    setAdvisoryType('road');
    setStatusTag('general');
    setSuccess('Draft cleared.');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleResetDetourOnly = () => {
    setStartNodeId(null);
    setEndNodeId(null);
    setLastDrawNodeId(null);
    setAdvisoryEdges((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (next[key] === 'recommended') {
          delete next[key];
        }
      });
      return next;
    });
    setSuccess('Detour path reset. Click waypoints sequentially to draw a custom detour path.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleNodeClick = (nodeId: string) => {
    if (pickMode === 'start') {
      setStartNodeId(nodeId === startNodeId ? null : nodeId);
      if (nodeId !== startNodeId) {
        setLastDrawNodeId(nodeId);
      }
    } else if (pickMode === 'end') {
      setEndNodeId(nodeId === endNodeId ? null : nodeId);
    } else if (pickMode === 'draw') {
      if (!startNodeId) {
        setStartNodeId(nodeId);
        setLastDrawNodeId(nodeId);
        setSuccess(`Detour drawing started at ${getNodeName(nodeId)}.`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const fromNodeId = lastDrawNodeId || startNodeId;
        if (fromNodeId === nodeId) return;

        // Check if direct edge connects them
        const directEdge = edges.find(
          (e) =>
            (e.start_node_id === fromNodeId && e.end_node_id === nodeId) ||
            (e.start_node_id === nodeId && e.end_node_id === fromNodeId)
        );

        if (directEdge) {
          setAdvisoryEdges((prev) => ({
            ...prev,
            [directEdge.id]: 'recommended',
          }));
          setLastDrawNodeId(nodeId);
          setEndNodeId(nodeId);
          setSuccess(`Detour extended to ${getNodeName(nodeId)}.`);
          setTimeout(() => setSuccess(''), 2000);
        } else {
          // Route sub-path dynamically avoiding blocked segments
          const blockedEdges = new Set<string>(
            Object.keys(advisoryEdges).filter((key) => advisoryEdges[key] === 'blocked')
          );
          const pathEdges = findAutoDetourPath(nodes, edges, fromNodeId, nodeId, blockedEdges);

          if (pathEdges && pathEdges.length > 0) {
            setAdvisoryEdges((prev) => {
              const next = { ...prev };
              pathEdges.forEach((edgeId) => {
                next[edgeId] = 'recommended';
              });
              return next;
            });
            setLastDrawNodeId(nodeId);
            setEndNodeId(nodeId);
            setSuccess(`Detour routed to ${getNodeName(nodeId)} via intermediate waypoints.`);
            setTimeout(() => setSuccess(''), 2000);
          } else {
            setError(`No valid route network connection found from previous waypoint to ${getNodeName(nodeId)} avoiding blocked roads!`);
            setTimeout(() => setError(''), 4000);
          }
        }
      }
    }
  };

  const handleSubmitAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!title.trim() || !message.trim()) {
      setError('Title and Advisory Message description are required.');
      return;
    }

    const edgesPayload = Object.keys(advisoryEdges).map((id) => ({
      edgeId: id,
      status: advisoryEdges[id],
    }));

    if (advisoryType === 'road' && edgesPayload.length === 0) {
      setError('Please select at least one blocked (RED) or detour (GREEN) road on the map.');
      return;
    }

    if (advisoryType === 'zone' && selectedZoneIds.length === 0) {
      setError('Please select at least one targeted Zone.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await apiFetch(`/api/events/${selectedEvent.id}/advisories`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          startNodeId: advisoryType === 'road' ? startNodeId : null,
          endNodeId: advisoryType === 'road' ? endNodeId : null,
          edges: advisoryType === 'road' ? edgesPayload : [],
          zoneIds: advisoryType === 'zone' ? selectedZoneIds : [],
          advisory_type: advisoryType,
          status_tag: statusTag,
        }),
      });

      if (res && res.success) {
        setSuccess('Traffic advisory successfully published and warning notification sent!');
        handleClearAdvisoryDraft();
        // Reload list
        loadEventData();
      } else {
        throw new Error(res.message || 'Failed to publish advisory');
      }
    } catch (err: any) {
      setError(err.message || 'Server error publishing advisory');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdvisory = async (id: string, currentStatus: boolean) => {
    try {
      const res = await apiFetch(`/api/advisories/${id}/toggle`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res && res.success) {
        setSuccess(`Advisory successfully ${!currentStatus ? 'activated' : 'deactivated'}!`);
        setTimeout(() => setSuccess(''), 3000);
        // Refresh list
        loadEventData();
      } else {
        throw new Error(res.message || 'Failed to toggle advisory status');
      }
    } catch (err: any) {
      setError(err.message || 'Server error toggling active status');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleDeleteAdvisory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this traffic advisory? It will also delete linked notifications.')) return;
    try {
      const res = await apiFetch(`/api/advisories/${id}`, {
        method: 'DELETE',
      });

      if (res && res.success) {
        setSuccess('Traffic advisory deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
        // Refresh list
        loadEventData();
      } else {
        throw new Error(res.message || 'Failed to delete advisory');
      }
    } catch (err: any) {
      setError(err.message || 'Server error deleting advisory');
      setTimeout(() => setError(''), 4000);
    }
  };

  // Helpers to get node names
  const getNodeName = (id: string | null) => {
    if (!id) return '';
    const node = nodes.find((n) => n.id === id);
    return node?.name || `Waypoint #${id.substring(0, 4)}`;
  };

  if (!selectedEvent) {
    return (
      <PageContainer>
        <HeaderSection>
          <HeaderTitles>
            <PageTitle>Traffic Advisory Manager</PageTitle>
            <PageSubtitle>Redirect crowd flows, block congested corridors, and publish warnings.</PageSubtitle>
          </HeaderTitles>
        </HeaderSection>
        <EmptyStateWrapper>
          <AlertTriangle size={32} style={{ color: '#fbbf24' }} />
          <h4>No Event Selected</h4>
          <p>Please select an active event in the main header to access the traffic advisory workspace.</p>
        </EmptyStateWrapper>
      </PageContainer>
    );
  }

  const blockedCount = Object.values(advisoryEdges).filter(v => v === 'blocked').length;
  const detourCount = Object.values(advisoryEdges).filter(v => v === 'recommended').length;

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderTitles>
          <PageTitle>Traffic Advisory Manager</PageTitle>
          <PageSubtitle>
            Event: <strong>{selectedEvent.name}</strong> • Publish route diversion warnings and detours.
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
        {/* Left Compose & Dashboard Panel */}
        <SidebarPanel>
            <Card style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '550px', flexShrink: 0 }}>
              <FormSection onSubmit={handleSubmitAdvisory} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0' }}>Compose Traffic Advisory</h3>

                  {/* Template Presets */}
                  <TemplateGrid>
                    {presets.map((preset, i) => (
                      <TemplateChip key={i} type="button" onClick={() => handleApplyPreset(preset)}>
                        <span className="dot"></span>
                        {preset.label}
                      </TemplateChip>
                    ))}
                  </TemplateGrid>

                  <FormGroup>
                    <Label>Advisory Type</Label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setAdvisoryType('road');
                          setSelectedZoneIds([]);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: advisoryType === 'road' ? '1px solid #22d3ee' : '1px solid #27272a',
                          background: advisoryType === 'road' ? 'rgba(34, 211, 238, 0.15)' : '#18181b',
                          color: advisoryType === 'road' ? '#22d3ee' : '#a1a1aa',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        🔘 Road Detour
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdvisoryType('zone');
                          setStartNodeId(null);
                          setEndNodeId(null);
                          setAdvisoryEdges({});
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: advisoryType === 'zone' ? '1px solid #3b82f6' : '1px solid #27272a',
                          background: advisoryType === 'zone' ? 'rgba(59, 130, 246, 0.15)' : '#18181b',
                          color: advisoryType === 'zone' ? '#60a5fa' : '#a1a1aa',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        🔘 Zone Alert
                      </button>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Advisory Status Tag</Label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      {[
                        { val: 'stable', label: '🟢 Stable', border: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
                        { val: 'warning', label: '🟡 Warning', border: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)', color: '#fdba74' },
                        { val: 'congested', label: '🟠 Congested', border: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', color: '#ffedd5' },
                        { val: 'critical', label: '🔴 Critical', border: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
                        { val: 'general', label: '🔵 General', border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }
                      ].map((t) => {
                        const isSelected = statusTag === t.val;
                        return (
                          <button
                            key={t.val}
                            type="button"
                            onClick={() => setStatusTag(t.val as any)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: '700',
                              border: isSelected ? `1px solid ${t.border}` : '1px solid #27272a',
                              background: isSelected ? t.bg : '#18181b',
                              color: isSelected ? t.color : '#a1a1aa',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </FormGroup>

                  <Input
                    label="Advisory Title *"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Gate 3 Diversion"
                    required
                  />

                  <FormGroup>
                    <Label>Advisory Warning Message *</Label>
                    <TextareaField
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail instructions for users. E.g. Gate 3 is closed due to high crowd density. Follow green arrow detour paths..."
                      rows={3}
                      required
                    />
                  </FormGroup>

                  {advisoryType === 'zone' && (
                    <FormGroup style={{ marginBottom: '16px' }}>
                      <Label>Apply to Zones (Multi-Select)</Label>
                      {eventZones.length === 0 ? (
                        <div style={{ color: '#71717a', fontSize: '11px', padding: '4px 0' }}>
                          No zones defined for this event. Go to Zones Manager to draw zones.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                          {eventZones.map((zone) => {
                            const isSelected = selectedZoneIds.includes(zone.id);
                            return (
                              <button
                                key={zone.id}
                                type="button"
                                onClick={() => {
                                  setSelectedZoneIds((prev) =>
                                    isSelected ? prev.filter((id) => id !== zone.id) : [...prev, zone.id]
                                  );
                                }}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '16px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  border: isSelected ? '1px solid #3b82f6' : '1px solid #27272a',
                                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : '#18181b',
                                  color: isSelected ? '#60a5fa' : '#a1a1aa',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {zone.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </FormGroup>
                  )}

                  {advisoryType === 'road' && (
                    <>
                      {/* Anchor Node selectors */}
                      <FormGroup>
                        <Label>Detour Waypoints</Label>
                        <SelectorPillGrid>
                          <SelectorPill
                            $selected={!!startNodeId}
                            $color="#10b981"
                            onClick={() => setPickMode(pickMode === 'start' ? 'toggle' : 'start')}
                          >
                            <span>{startNodeId ? `🏁 Start: ${getNodeName(startNodeId).substring(0, 10)}...` : '📍 Pick Detour Start'}</span>
                            {startNodeId && (
                              <button className="clear-btn" onClick={(e) => { e.stopPropagation(); setStartNodeId(null); }}>×</button>
                            )}
                          </SelectorPill>

                          <SelectorPill
                            $selected={!!endNodeId}
                            $color="#f97316"
                            onClick={() => setPickMode(pickMode === 'end' ? 'toggle' : 'end')}
                          >
                            <span>{endNodeId ? `🎯 End: ${getNodeName(endNodeId).substring(0, 10)}...` : '🏁 Pick Detour End'}</span>
                            {endNodeId && (
                              <button className="clear-btn" onClick={(e) => { e.stopPropagation(); setEndNodeId(null); }}>×</button>
                            )}
                          </SelectorPill>
                        </SelectorPillGrid>
                      </FormGroup>

                      {/* Selection summary */}
                      {Object.keys(advisoryEdges).length > 0 && (
                        <InfoBar>
                          <Info size={14} />
                          <span>
                            Selection: <strong>{blockedCount}</strong> blocked road segments (RED) and <strong>{detourCount}</strong> detour road segments (GREEN).
                          </span>
                        </InfoBar>
                      )}
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #27272a' }}>
                  <Button type="button" $variant="secondary" onClick={handleClearAdvisoryDraft} style={{ flex: 1 }}>
                    Clear Draft
                  </Button>
                  <Button type="submit" $variant="primary" style={{ flex: 2 }} disabled={loading || !title || !message}>
                    {loading ? 'Publishing...' : 'Publish Advisory'}
                  </Button>
                </div>
              </FormSection>
            </Card>

          {/* Active / Logged Advisories */}
          <PanelTitleRow>
            <h3>Advisories Log</h3>
          </PanelTitleRow>

          <AdvisoriesList style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
            {advisories.length === 0 ? (
              <div style={{ color: '#71717a', fontSize: '12px', padding: '16px', border: '1px dashed #27272a', borderRadius: '12px', textAlign: 'center' }}>
                No published traffic advisories for this event yet.
              </div>
            ) : (
              advisories.map((adv) => {
                const advBlocked = adv.edges?.filter((e: any) => e.status === 'blocked').length || 0;
                const advDetour = adv.edges?.filter((e: any) => e.status === 'recommended').length || 0;
                
                return (
                  <AdvisoryCard key={adv.id} $active={adv.is_active}>
                    <div className="header">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <span style={{
                            fontSize: '8px',
                            textTransform: 'uppercase',
                            fontWeight: '800',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: adv.advisory_type === 'zone' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(34, 211, 238, 0.15)',
                            color: adv.advisory_type === 'zone' ? '#60a5fa' : '#22d3ee',
                            border: adv.advisory_type === 'zone' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(34, 211, 238, 0.3)',
                            marginBottom: '4px'
                          }}>
                            {adv.advisory_type === 'zone' ? 'Zone Alert' : 'Road Detour'}
                          </span>
                          {adv.status_tag && (
                            <span style={{
                              fontSize: '8px',
                              textTransform: 'uppercase',
                              fontWeight: '800',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 
                                adv.status_tag === 'stable' ? 'rgba(16, 185, 129, 0.15)' :
                                adv.status_tag === 'warning' ? 'rgba(251, 146, 60, 0.15)' :
                                adv.status_tag === 'congested' ? 'rgba(249, 115, 22, 0.15)' :
                                adv.status_tag === 'critical' ? 'rgba(239, 68, 68, 0.15)' :
                                'rgba(59, 130, 246, 0.15)',
                              color: 
                                adv.status_tag === 'stable' ? '#34d399' :
                                adv.status_tag === 'warning' ? '#fdba74' :
                                adv.status_tag === 'congested' ? '#ffedd5' :
                                adv.status_tag === 'critical' ? '#f87171' :
                                '#60a5fa',
                              border: 
                                adv.status_tag === 'stable' ? '1px solid rgba(16, 185, 129, 0.3)' :
                                adv.status_tag === 'warning' ? '1px solid rgba(251, 146, 60, 0.3)' :
                                adv.status_tag === 'congested' ? '1px solid rgba(249, 115, 22, 0.3)' :
                                adv.status_tag === 'critical' ? '1px solid rgba(239, 68, 68, 0.3)' :
                                '1px solid rgba(59, 130, 246, 0.3)',
                              marginBottom: '4px'
                            }}>
                              {adv.status_tag}
                            </span>
                          )}
                        </div>
                        <h4 className="title">{adv.title}</h4>
                      </div>
                      <span className="meta">
                        {new Date(adv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="desc">{adv.message}</p>

                    {adv.zoneIds && adv.zoneIds.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0 8px 0' }}>
                        {adv.zoneIds.map((zId: string) => {
                          const zone = eventZones.find((z) => z.id === zId);
                          return zone ? (
                            <span
                              key={zId}
                              style={{
                                fontSize: '9px',
                                padding: '2px 6px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                color: '#cbd5e1',
                                fontWeight: '600'
                              }}
                            >
                              📍 {zone.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    <div className="stats">
                      <div className="stat-badge">
                        <ShieldAlert size={10} style={{ color: '#ef4444' }} />
                        <span>{advBlocked} Blocked</span>
                      </div>
                      <div className="stat-badge">
                        <Shuffle size={10} style={{ color: '#10b981' }} />
                        <span>{advDetour} Detour</span>
                      </div>
                    </div>
                    
                    <div className="actions">
                      <span style={{ fontSize: '11px', color: adv.is_active ? '#10b981' : '#71717a', marginRight: 'auto', fontWeight: '700' }}>
                        {adv.is_active ? '● Active' : '○ Deactivated'}
                      </span>

                      {/* Deactivate switch */}
                      <ToggleSwitch>
                        <ToggleInput
                          type="checkbox"
                          checked={adv.is_active}
                          onChange={() => handleToggleAdvisory(adv.id, adv.is_active)}
                        />
                        <ToggleSlider />
                      </ToggleSwitch>

                      <TextButton $color="#ef4444" onClick={() => handleDeleteAdvisory(adv.id)} title="Delete Advisory">
                        <Trash2 size={12} />
                        Delete
                      </TextButton>
                    </div>
                  </AdvisoryCard>
                );
              })
            )}
          </AdvisoriesList>
        </SidebarPanel>

        {/* Right Map Canvas Panel */}
        <MapPanel>
          {advisoryType === 'road' ? (
            <>
              <FloatingToolbar>
                <ToolbarButton
                  $active={pickMode === 'toggle'}
                  onClick={() => setPickMode('toggle')}
                  title="Click route segments to toggle Closed (RED) or Detour (GREEN) status"
                >
                  🎨 Edge Paint
                </ToolbarButton>

                <ToolbarButton
                  $active={pickMode === 'draw'}
                  onClick={() => setPickMode('draw')}
                  title="Click waypoints node-to-node sequentially to draw recommended detour path"
                >
                  ✏️ Detour Draw
                </ToolbarButton>

                <ToolbarButton
                  $active={pickMode === 'start'}
                  onClick={() => setPickMode('start')}
                  title="Click a node on map to set detour Start point"
                >
                  🏁 Detour Start
                </ToolbarButton>

                <ToolbarButton
                  $active={pickMode === 'end'}
                  onClick={() => setPickMode('end')}
                  title="Click a node on map to set detour Destination point"
                >
                  🎯 Detour End
                </ToolbarButton>
              </FloatingToolbar>

              {/* Floating Detour and Reset Tools */}
              {(startNodeId || endNodeId || detourCount > 0) && (
                <FloatingTools>
                  {startNodeId && endNodeId && (
                    <ActionButton onClick={handleAutoGenerateDetour} title="Run Dijkstra routing to automatically select detour path">
                      <Sparkles size={12} style={{ color: '#22d3ee' }} />
                      Auto-Compute Detour
                    </ActionButton>
                  )}
                  {detourCount > 0 && (
                    <ActionButton onClick={handleResetDetourOnly} title="Reset recommended green detour path only" style={{ background: '#f59e0b', color: '#18181b', border: '1px solid #d97706' }}>
                      Reset Detour Path
                    </ActionButton>
                  )}
                </FloatingTools>
              )}
            </>
          ) : (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 1000,
              background: 'rgba(9, 9, 11, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#60a5fa',
              fontSize: '11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <MapPin size={12} />
              Zone Alert Mode (Map shows visual zone boundaries for reference)
            </div>
          )}

          <MapWrapper>
            <AdvisoryMap
              selectedEvent={selectedEvent}
              nodes={nodes}
              edges={edges}
              startNodeId={startNodeId}
              setStartNodeId={setStartNodeId}
              endNodeId={endNodeId}
              setEndNodeId={setEndNodeId}
              advisoryEdges={advisoryEdges}
              setAdvisoryEdges={setAdvisoryEdges}
              pickMode={pickMode}
              lastDrawNodeId={lastDrawNodeId}
              onNodeClick={handleNodeClick}
              eventZones={eventZones}
              selectedZoneIds={selectedZoneIds}
              setSelectedZoneIds={setSelectedZoneIds}
              advisoryType={advisoryType}
            />
          </MapWrapper>
        </MapPanel>
      </WorkspaceLayout>
    </PageContainer>
  );
}
