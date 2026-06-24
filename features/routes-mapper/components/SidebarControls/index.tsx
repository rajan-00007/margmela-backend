'use client';

import React from 'react';
import { NodeItem, EdgeItem, POIItem } from '../../hooks/useRouteGraph';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import {
  SidebarWrapper,
  TabsHeader,
  TabButton,
  TabContent,
  EmptyPanelState,
  ListScrollContainer,
  ItemRowCard,
  DeleteIconButton,
  IndexBadge,
  NodeNameInput,
  EntranceLabel,
  PoiAnchorBadge,
  CoordinatesFooter,
  QuickConnectContainer,
  EdgeItemRow,
  PoiCard,
  ActionBtn,
  Form,
  FormTitle,
  CancelTextLink,
  FormGroupWrapper,
  LabelText,
  CategorySelect,
  TextArea,
  CoordinatesGrid,
  FormBannerTip,
} from './styled';

interface SidebarControlsProps {
  nodes: NodeItem[];
  setNodes: React.Dispatch<React.SetStateAction<NodeItem[]>>;
  edges: EdgeItem[];
  setEdges: React.Dispatch<React.SetStateAction<EdgeItem[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  pois: POIItem[];
  sidebarTab: 'nodes' | 'edges' | 'pois';
  setSidebarTab: (tab: 'nodes' | 'edges' | 'pois') => void;
  poiEditMode: 'list' | 'add' | 'edit';
  setPoiEditMode: (mode: 'list' | 'add' | 'edit') => void;
  categories: any[];
  
  // POI Form State
  poiNameEn: string;
  setPoiNameEn: (val: string) => void;
  poiNameHi: string;
  setPoiNameHi: (val: string) => void;
  poiNameOr: string;
  setPoiNameOr: (val: string) => void;
  poiDesc: string;
  setPoiDesc: (val: string) => void;
  poiCategoryId: string;
  setPoiCategoryId: (val: string) => void;
  poiIconUrl: string;
  setPoiIconUrl: (val: string) => void;
  poiLat: number | '';
  setPoiLat: (val: number | '') => void;
  poiLng: number | '';
  setPoiLng: (val: number | '') => void;
  poiPathName: string;
  setPoiPathName: (val: string) => void;

  // Form Submits
  handleCreatePOI: (e: React.FormEvent) => void;
  handleUpdatePOI: (e: React.FormEvent) => void;
  handleDeletePOI: (poiId: string) => void;
  
  // Actions
  updateNodeName: (id: string, newName: string) => void;
  removeNode: (id: string) => void;
  removeEdge: (startId: string, endId: string) => void;
  resetPoiForm: () => void;
  setSuccess: (msg: string) => void;
  setError: (msg: string) => void;
  loading: boolean;
  editingPoiId: string | null;
  setEditingPoiId: (id: string | null) => void;

  // Geolocation values
  userLocation: { latitude: number; longitude: number; accuracy: number } | null;
  isTrackingUser: boolean;
  useCurrentLocationForPoi: () => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  selectedNodeId,
  setSelectedNodeId,
  pois,
  sidebarTab,
  setSidebarTab,
  poiEditMode,
  setPoiEditMode,
  categories,
  
  poiNameEn,
  setPoiNameEn,
  poiNameHi,
  setPoiNameHi,
  poiNameOr,
  setPoiNameOr,
  poiDesc,
  setPoiDesc,
  poiCategoryId,
  setPoiCategoryId,
  poiIconUrl,
  setPoiIconUrl,
  poiLat,
  setPoiLat,
  poiLng,
  setPoiLng,
  poiPathName,
  setPoiPathName,

  handleCreatePOI,
  handleUpdatePOI,
  handleDeletePOI,
  
  updateNodeName,
  removeNode,
  removeEdge,
  resetPoiForm,
  setSuccess,
  setError,
  loading,
  editingPoiId,
  setEditingPoiId,
  userLocation,
  isTrackingUser,
  useCurrentLocationForPoi,
}) => {
  
  const categoryColor = (catName: string): string => {
    const c = (catName || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '#f59e0b';
    if (c.includes('police') || c.includes('security')) return '#3b82f6';
    if (c.includes('medical') || c.includes('hospital') || c.includes('health') || c.includes('first')) return '#ef4444';
    if (c.includes('water') || c.includes('drink')) return '#06b6d4';
    if (c.includes('exit') || c.includes('entrance') || c.includes('gate')) return '#10b981';
    if (c.includes('parking')) return '#6366f1';
    if (c.includes('food') || c.includes('eat')) return '#f97316';
    return '#a1a1aa';
  };

  const focusOnPoi = (poi: POIItem) => {
    const map = (window as any).leafletMapInstance;
    if (map) {
      map.setView([Number(poi.latitude), Number(poi.longitude)], 18);
    }
  };

  return (
    <SidebarWrapper>
      {/* Sidebar Tabs */}
      <TabsHeader>
        <TabButton
          $active={sidebarTab === 'nodes'}
          onClick={() => setSidebarTab('nodes')}
        >
          Waypoints ({nodes.length})
        </TabButton>
        <TabButton
          $active={sidebarTab === 'edges'}
          onClick={() => setSidebarTab('edges')}
        >
          Paths ({edges.length})
        </TabButton>
        <TabButton
          $active={sidebarTab === 'pois'}
          onClick={() => setSidebarTab('pois')}
        >
          POIs ({pois.length})
        </TabButton>
      </TabsHeader>

      {/* Content Panels */}
      <TabContent>
        {/* WAYPOINTS LIST TAB */}
        {sidebarTab === 'nodes' && (
          nodes.length === 0 ? (
            <EmptyPanelState>
              <p>No waypoints plotted yet.</p>
              <span className="subtitle">Click coordinates inside map limits to construct your layout.</span>
            </EmptyPanelState>
          ) : (
            <ListScrollContainer>
              {nodes.map((node, idx) => {
                const isSelected = selectedNodeId === node.id;
                const linkedPoi = pois.find(
                  (p) =>
                    p.id === node.poi_id ||
                    (Math.abs(node.latitude - p.latitude) < 0.000001 && Math.abs(node.longitude - p.longitude) < 0.000001)
                );
                return (
                  <ItemRowCard key={node.id} $isSelected={isSelected}>
                    <DeleteIconButton
                      onClick={() => removeNode(node.id)}
                      title="Remove Node"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </DeleteIconButton>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <IndexBadge
                        $selected={isSelected}
                        onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                        title="Click to select as draw target"
                      >
                        {idx + 1}
                      </IndexBadge>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <NodeNameInput
                          type="text"
                          value={node.name}
                          onChange={(e) => updateNodeName(node.id, e.target.value)}
                          placeholder="Location Name"
                        />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <EntranceLabel>
                            <input
                              type="checkbox"
                              checked={!!node.is_entrance}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setNodes((prev) =>
                                  prev.map((n) => (n.id === node.id ? { ...n, is_entrance: checked } : n))
                                );
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <span>Entrance Point 🚪</span>
                          </EntranceLabel>

                          <EntranceLabel>
                            <input
                              type="checkbox"
                              checked={!!node.is_parking}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setNodes((prev) =>
                                  prev.map((n) => (n.id === node.id ? { ...n, is_parking: checked } : n))
                                );
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <span>Parking Point 🅿️</span>
                          </EntranceLabel>

                          {linkedPoi ? (
                            <PoiAnchorBadge>
                              ✨ POI: {linkedPoi.name_en}
                            </PoiAnchorBadge>
                          ) : (
                            <Button
                              $variant="secondary"
                              $size="sm"
                              style={{ width: 'max-content', padding: '3px 8px', fontSize: '9px', borderRadius: '6px' }}
                              onClick={() => {
                                setPoiEditMode('add');
                                setPoiLat(node.latitude);
                                setPoiLng(node.longitude);
                                setPoiNameEn(node.name);
                                setSidebarTab('pois');
                                setSuccess(`Creating POI anchored to Waypoint "${node.name}"!`);
                                setTimeout(() => setSuccess(''), 3000);
                              }}
                            >
                              ➕ Mark as POI
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <CoordinatesFooter>
                      <div>Lat: {node.latitude}</div>
                      <div>Lng: {node.longitude}</div>
                    </CoordinatesFooter>
                  </ItemRowCard>
                );
              })}
            </ListScrollContainer>
          )
        )}

        {/* CONNECTION PATHS TAB */}
        {sidebarTab === 'edges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Connect Selection Box */}
            {nodes.length >= 2 && (
              <QuickConnectContainer>
                <div className="title">Quick Link Waypoints</div>
                <div className="select-row">
                  <select
                    id="quick-connect-start"
                    className="quick-select"
                    defaultValue=""
                  >
                    <option value="" disabled>Start Point</option>
                    {nodes.map((n, i) => (
                      <option key={n.id} value={n.id}>#{i+1}: {n.name}</option>
                    ))}
                  </select>
                  <select
                    id="quick-connect-end"
                    className="quick-select"
                    defaultValue=""
                  >
                    <option value="" disabled>End Point</option>
                    {nodes.map((n, i) => (
                      <option key={n.id} value={n.id}>#{i+1}: {n.name}</option>
                    ))}
                  </select>
                </div>
                <Button
                  $variant="secondary"
                  $size="sm"
                  $fullWidth
                  onClick={() => {
                    const startEl = document.getElementById('quick-connect-start') as HTMLSelectElement;
                    const endEl = document.getElementById('quick-connect-end') as HTMLSelectElement;
                    const startVal = startEl?.value;
                    const endVal = endEl?.value;

                    if (!startVal || !endVal) {
                      setError('Please select both start and end waypoints to connect!');
                      setTimeout(() => setError(''), 3000);
                      return;
                    }
                    if (startVal === endVal) {
                      setError('Cannot connect a waypoint to itself!');
                      setTimeout(() => setError(''), 3000);
                      return;
                    }

                    const edgeExists = edges.some(
                      (e) =>
                        (e.startNodeId === startVal && e.endNodeId === endVal) ||
                        (e.startNodeId === endVal && e.endNodeId === startVal)
                    );

                    if (edgeExists) {
                      setError('This connection already exists!');
                      setTimeout(() => setError(''), 3000);
                      return;
                    }

                    setEdges((prev) => [...prev, { startNodeId: startVal, endNodeId: endVal }]);
                    setSuccess('Connection added successfully!');
                    setTimeout(() => setSuccess(''), 2500);

                    startEl.value = '';
                    endEl.value = '';
                  }}
                >
                  ➕ Add Connection Path
                </Button>
              </QuickConnectContainer>
            )}

            {edges.length === 0 ? (
              <EmptyPanelState>
                <p>No connections defined yet.</p>
                <span className="subtitle">Select a source node, then click a target node to establish paths.</span>
              </EmptyPanelState>
            ) : (
              <ListScrollContainer>
                {edges.map((edge, idx) => {
                  const start = nodes.find((n) => n.id === edge.startNodeId);
                  const end = nodes.find((n) => n.id === edge.endNodeId);
                  
                  const startIdx = nodes.findIndex((n) => n.id === edge.startNodeId) + 1;
                  const endIdx = nodes.findIndex((n) => n.id === edge.endNodeId) + 1;

                  return (
                    <EdgeItemRow key={idx} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px', padding: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="connection-text">
                          <span className="idx">#{startIdx || '?'}</span>
                          <span className="name" title={start?.name}>{start?.name || 'Deleted'}</span>
                          <span className="arrows">↔</span>
                          <span className="idx">#{endIdx || '?'}</span>
                          <span className="name" title={end?.name}>{end?.name || 'Deleted'}</span>
                        </div>

                        <DeleteIconButton
                          onClick={() => removeEdge(edge.startNodeId, edge.endNodeId)}
                          title="Delete Connection"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </DeleteIconButton>
                      </div>
                      <input
                        type="text"
                        value={edge.path_name || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEdges((prev) =>
                            prev.map((eg, i) => (i === idx ? { ...eg, path_name: val } : eg))
                          );
                        }}
                        placeholder="Path Name (e.g. L2)"
                        style={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          background: '#18181b',
                          color: '#e4e4e7',
                          border: '1px solid #27272a',
                          borderRadius: '4px',
                          width: '100%'
                        }}
                      />
                    </EdgeItemRow>
                  );
                })}
              </ListScrollContainer>
            )}
          </div>
        )}

        {/* POI MANAGEMENT TAB */}
        {sidebarTab === 'pois' && (
          poiEditMode === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Button
                $variant="primary"
                $fullWidth
                onClick={() => {
                  resetPoiForm();
                  setPoiEditMode('add');
                  setSuccess('Click map or drag the cyan marker to position new POI.');
                  setTimeout(() => setSuccess(''), 4000);
                }}
              >
                ➕ Add New POI
              </Button>

              {pois.length === 0 ? (
                <EmptyPanelState>
                  <p>No POIs found for this event.</p>
                  <span className="subtitle">Click "Add New POI" above to get started.</span>
                </EmptyPanelState>
              ) : (
                <ListScrollContainer>
                  {pois.map((poi) => (
                    <PoiCard key={poi.id}>
                      <div className="card-header">
                        <div className="name-titles">
                          <span className="en">{poi.name_en}</span>
                          {poi.name_hi && <span className="translated">HI: {poi.name_hi}</span>}
                          {poi.name_or && <span className="translated">OR: {poi.name_or}</span>}
                        </div>
                        <div className="actions">
                          <ActionBtn onClick={() => focusOnPoi(poi)} title="Focus Map">🔍</ActionBtn>
                          <ActionBtn
                            onClick={() => {
                              setEditingPoiId(poi.id);
                              setPoiNameEn(poi.name_en);
                              setPoiNameHi(poi.name_hi || '');
                              setPoiNameOr(poi.name_or || '');
                              setPoiDesc(poi.description || '');
                              setPoiCategoryId(poi.category_id || '');
                              setPoiLat(Number(poi.latitude));
                              setPoiLng(Number(poi.longitude));
                              setPoiPathName(poi.path_name || '');
                              setPoiEditMode('edit');
                            }}
                            title="Edit POI"
                          >
                            ✏️
                          </ActionBtn>
                          <ActionBtn onClick={() => handleDeletePOI(poi.id)} title="Delete POI">🗑️</ActionBtn>
                        </div>
                      </div>

                      {poi.description && (
                        <p className="desc">{poi.description}</p>
                      )}

                      <div className="card-footer">
                        <span className="category" style={{ color: categoryColor(poi.category_name) }}>
                          {poi.category_name}
                        </span>
                        <span className="coords">
                          {Number(poi.latitude).toFixed(5)}, {Number(poi.longitude).toFixed(5)}
                        </span>
                      </div>
                    </PoiCard>
                  ))}
                </ListScrollContainer>
              )}
            </div>
          ) : (
            /* POI Creation / Edit Forms */
            <Form onSubmit={poiEditMode === 'add' ? handleCreatePOI : handleUpdatePOI}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f23', paddingBottom: '10px' }}>
                <FormTitle>{poiEditMode === 'add' ? '✨ Add POI' : '✏️ Edit POI'}</FormTitle>
                <CancelTextLink
                  onClick={() => {
                    resetPoiForm();
                    setPoiEditMode('list');
                  }}
                >
                  Cancel
                </CancelTextLink>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Input
                  label="Name (English) *"
                  type="text"
                  required
                  value={poiNameEn}
                  onChange={(e) => setPoiNameEn(e.target.value)}
                  placeholder="e.g. Police Booth A"
                />

                <Input
                  label="Name (Hindi)"
                  type="text"
                  value={poiNameHi}
                  onChange={(e) => setPoiNameHi(e.target.value)}
                  placeholder="e.g. पुलिस बूथ ए"
                />

                <Input
                  label="Name (Odia)"
                  type="text"
                  value={poiNameOr}
                  onChange={(e) => setPoiNameOr(e.target.value)}
                  placeholder="e.g. ପୋଲିସ ବୁଥ୍ ଏ"
                />

                <Input
                  label="Path Name"
                  type="text"
                  value={poiPathName}
                  onChange={(e) => setPoiPathName(e.target.value)}
                  placeholder="e.g. L2"
                />

                <FormGroupWrapper>
                  <LabelText>Category *</LabelText>
                  <CategorySelect
                    required
                    value={poiCategoryId}
                    onChange={(e) => setPoiCategoryId(e.target.value)}
                  >
                    <option value="" disabled>
                      {categories.length === 0 ? 'Loading categories...' : 'Select Category'}
                    </option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name_en || cat.name}
                      </option>
                    ))}
                  </CategorySelect>
                </FormGroupWrapper>

                <FormGroupWrapper>
                  <LabelText>Description</LabelText>
                  <TextArea
                    value={poiDesc}
                    onChange={(e) => setPoiDesc(e.target.value)}
                    placeholder="Enter landmark info, services available etc..."
                    rows={2.5}
                  />
                </FormGroupWrapper>

                <FormGroupWrapper>
                  <LabelText>Geographic Coordinates *</LabelText>
                  <CoordinatesGrid>
                    <div className="box">
                      <span className="lbl">Latitude</span>
                      <span className="val">{poiLat !== '' ? poiLat : 'Click map...'}</span>
                    </div>
                    <div className="box">
                      <span className="lbl">Longitude</span>
                      <span className="val">{poiLng !== '' ? poiLng : 'Click map...'}</span>
                    </div>
                  </CoordinatesGrid>
                  {isTrackingUser && userLocation ? (
                    <Button
                      type="button"
                      $variant="secondary"
                      $size="sm"
                      style={{ marginTop: '4px', width: 'max-content', padding: '6px 12px', fontSize: '10px' }}
                      onClick={useCurrentLocationForPoi}
                    >
                      📍 Use Current GPS Coordinate
                    </Button>
                  ) : (
                    <span style={{ fontSize: '9px', color: '#a1a1aa', marginTop: '4px' }}>
                      🛰️ Geolocation tracking is OFF. Enable GPS in map controls to prefill your location.
                    </span>
                  )}
                  <FormBannerTip>
                    💡 {poiLat === '' ? 'Click anywhere on the map to place the POI.' : 'Drag the cyan marker on the map to fine-tune coordinates.'}
                  </FormBannerTip>
                </FormGroupWrapper>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading || poiLat === '' || poiLng === '' || !poiNameEn || !poiCategoryId}
                $variant="primary"
                $fullWidth
                style={{ marginTop: '16px' }}
              >
                {poiEditMode === 'add' ? 'Create POI' : 'Update POI'}
              </Button>
            </Form>
          )
        )}
      </TabContent>
    </SidebarWrapper>
  );
};

export default SidebarControls;
