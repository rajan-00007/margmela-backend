'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouteGraph } from '../../features/routes-mapper/hooks/useRouteGraph';
import Button from '../../components/ui/Button';

// Dynamic import of LeafletMap to prevent SSR compilation errors (since Leaflet references window/document)
const LeafletMap = dynamic(
  () => import('../../features/routes-mapper/components/LeafletMap'),
  { ssr: false }
);

import SidebarControls from '../../features/routes-mapper/components/SidebarControls';

import {
  PageContainer,
  HeaderSection,
  HeaderTitles,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  EmptyStateWrapper,
  WorkspaceLayout,
  MapPanel,
  MapWrapper,
  FloatingToolbar,
  ToolbarButton,
  FloatingActions,
  ToggleButton,
  FloatingButton,
  SidebarPanel,
  FooterSummaryRow,
  SummaryStats,
  AlertBanner,
  MobileTabToggle,
  TabToggleOption,
  WalkDrawButton,
  WalkStatusOverlay,
  WalkStatusHeader,
  WalkStatusGrid,
  ThresholdControlContainer,
} from './styled';

export default function RouteMapper() {
  const {
    selectedEvent,
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedNodeId,
    setSelectedNodeId,
    pois,
    showPois,
    setShowPois,
    editorMode,
    setEditorMode,
    loading,
    error,
    setError,
    success,
    setSuccess,
    sidebarTab,
    setSidebarTab,
    poiEditMode,
    setPoiEditMode,
    editingPoiId,
    setEditingPoiId,
    categories,
    
    // POI form fields
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

    // Refs
    nodesRef,
    edgesRef,
    selectedNodeIdRef,
    editorModeRef,
    poiEditModeRef,
    poiLatRef,
    poiLngRef,
    sidebarTabRef,

    // Actions
    loadRouteGraph,
    handleSaveRoute,
    handleDeleteRoute,
    handleCreatePOI,
    handleUpdatePOI,
    handleDeletePOI,
    updateNodeName,
    removeNode,
    removeEdge,
    clearMap,
    undoLastNode,
    resetPoiForm,
    totalDistance,

    // Geolocation values
    userLocation,
    isTrackingUser,
    setIsTrackingUser,
    addNodeAtCurrentLocation,
    useCurrentLocationForPoi,

    // Continuous Walk Drawing
    isDrawingRouteByWalking,
    setIsDrawingRouteByWalking,
    turnSensitivityAngle,
    setTurnSensitivityAngle,
  } = useRouteGraph();

  const [mobileTab, setMobileTab] = React.useState<'map' | 'controls'>('map');

  // Stopwatch timer for continuous walk drawing session
  const [walkDuration, setWalkDuration] = React.useState(0);
  React.useEffect(() => {
    let timerId: any = null;
    if (isDrawingRouteByWalking) {
      setWalkDuration(0);
      timerId = setInterval(() => {
        setWalkDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setWalkDuration(0);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isDrawingRouteByWalking]);

  // Helper to format duration in MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If no event is selected, render a sleek placeholder requesting event activation
  if (!selectedEvent) {
    return (
      <PageContainer>
        <HeaderSection>
          <HeaderTitles>
            <PageTitle>Route Network Graph Mapper</PageTitle>
            <PageSubtitle>
              Establish physical coordinates, waypoints, paths, and points of interest
            </PageSubtitle>
          </HeaderTitles>
        </HeaderSection>
        <EmptyStateWrapper>
          <h4>No Event Selected</h4>
          <p>
            Please select an active event in the main header to access the route mapping workspace.
          </p>
        </EmptyStateWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderTitles>
          <PageTitle>Route Network Graph Mapper</PageTitle>
          <PageSubtitle>
            Event: <strong>{selectedEvent.name}</strong> • Plot waypoints, link paths, and manage POIs.
          </PageSubtitle>
        </HeaderTitles>
        <HeaderActions>
          <Button
            $variant="secondary"
            onClick={loadRouteGraph}
            disabled={loading}
          >
            🔄 Refresh Graph
          </Button>
          <Button
            $variant="danger"
            onClick={handleDeleteRoute}
            disabled={loading || !selectedEvent.has_route_graph}
          >
            🗑️ Delete Graph
          </Button>
          <Button
            $variant="primary"
            onClick={handleSaveRoute}
            disabled={loading || nodes.length < 2}
          >
            {loading ? 'Saving...' : '💾 Save Route Network'}
          </Button>
        </HeaderActions>
      </HeaderSection>

      {/* Success / Error Banners */}
      {error && <AlertBanner $type="error">{error}</AlertBanner>}
      {success && <AlertBanner $type="success">{success}</AlertBanner>}

      <MobileTabToggle>
        <TabToggleOption
          $active={mobileTab === 'map'}
          onClick={() => setMobileTab('map')}
        >
          🗺️ Map Canvas
        </TabToggleOption>
        <TabToggleOption
          $active={mobileTab === 'controls'}
          onClick={() => setMobileTab('controls')}
        >
          ⚙️ Controls & POIs
        </TabToggleOption>
      </MobileTabToggle>

      <WorkspaceLayout>
        <MapPanel $visible={mobileTab === 'map'}>
          {/* Floating Controls Toolbar */}
          <FloatingToolbar>
            <ToolbarButton
              $active={editorMode === 'draw'}
              $mode="draw"
              onClick={() => {
                setEditorMode('draw');
                setSelectedNodeId(null);
              }}
              title="Ploting waypoints successively. Click coordinates to add a node."
            >
              ✏️ <span className="btn-text">Draw Mode</span>
            </ToolbarButton>
            <ToolbarButton
              $active={editorMode === 'connect'}
              $mode="connect"
              onClick={() => {
                setEditorMode('connect');
                setSelectedNodeId(null);
              }}
              title="Connect existing waypoints. Select first node, then click second node."
            >
              🔗 <span className="btn-text">Connect Mode</span>
            </ToolbarButton>
            <ToolbarButton
              $active={editorMode === 'delete'}
              $mode="delete"
              onClick={() => {
                setEditorMode('delete');
                setSelectedNodeId(null);
              }}
              title="Erase mode. Click nodes or edges to delete them from canvas."
            >
              ❌ <span className="btn-text">Delete Mode</span>
            </ToolbarButton>
          </FloatingToolbar>

          {/* Floating Actions */}
          <FloatingActions>
            <WalkDrawButton
              $active={isDrawingRouteByWalking}
              onClick={() => setIsDrawingRouteByWalking(!isDrawingRouteByWalking)}
              title="Continuous Turn & Dead-end auto-mapping route builder by walking"
            >
              {isDrawingRouteByWalking ? '🛑 Stop Walk Drawing' : '🚶‍♂️ Draw by Walking'}
            </WalkDrawButton>

            <ToggleButton
              $active={isTrackingUser}
              onClick={() => setIsTrackingUser(!isTrackingUser)}
              title="Toggle live location tracking via GPS"
            >
              🛰️ <span className="btn-text">{isTrackingUser ? 'GPS Tracking ON' : 'GPS Tracking OFF'}</span>
            </ToggleButton>

            {isTrackingUser && userLocation && (
              <>
                <FloatingButton
                  onClick={() => {
                    const map = (window as any).leafletMapInstance;
                    if (map && userLocation) {
                      map.setView([userLocation.latitude, userLocation.longitude], 18);
                    }
                  }}
                  title="Center map on your current GPS coordinates"
                >
                  🎯 <span className="btn-text">Center GPS</span>
                </FloatingButton>

                <FloatingButton
                  onClick={addNodeAtCurrentLocation}
                  title="Add route waypoint at your current GPS location"
                >
                  📍 <span className="btn-text">Waypoint Here</span>
                </FloatingButton>

                <FloatingButton
                  onClick={useCurrentLocationForPoi}
                  title="Start creating a POI at your current GPS location"
                >
                  ✨ <span className="btn-text">POI Here</span>
                </FloatingButton>
              </>
            )}

            <ToggleButton
              $active={showPois}
              onClick={() => setShowPois(!showPois)}
              title="Toggle POIs layer visibility"
            >
              {showPois ? '👁️' : '🙈'} <span className="btn-text">{showPois ? 'POIs Visible' : 'POIs Hidden'}</span>
            </ToggleButton>
            <FloatingButton
              onClick={undoLastNode}
              disabled={nodes.length === 0}
              title="Undo last plotted node"
            >
              ↩️ <span className="btn-text">Undo</span>
            </FloatingButton>
            <FloatingButton
              onClick={clearMap}
              disabled={nodes.length === 0}
              title="Clear all waypoints and paths from draft layout"
            >
              🧹 <span className="btn-text">Clear Draft</span>
            </FloatingButton>
          </FloatingActions>

          <MapWrapper>
            <LeafletMap
              selectedEvent={selectedEvent}
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              pois={pois}
              showPois={showPois}
              editorMode={editorMode}
              poiEditMode={poiEditMode}
              setPoiEditMode={setPoiEditMode}
              poiLat={poiLat}
              setPoiLat={setPoiLat}
              poiLng={poiLng}
              setPoiLng={setPoiLng}
              setPoiNameEn={setPoiNameEn}
              setSidebarTab={setSidebarTab}
              setSuccess={setSuccess}
              setError={setError}
              editingPoiId={editingPoiId}
              
              userLocation={userLocation}
              isTrackingUser={isTrackingUser}
              isDrawingRouteByWalking={isDrawingRouteByWalking}
              
              nodesRef={nodesRef}
              edgesRef={edgesRef}
              selectedNodeIdRef={selectedNodeIdRef}
              editorModeRef={editorModeRef}
              poiEditModeRef={poiEditModeRef}
              poiLatRef={poiLatRef}
              poiLngRef={poiLngRef}
              sidebarTabRef={sidebarTabRef}
            />
          </MapWrapper>

          {isDrawingRouteByWalking && (
            <WalkStatusOverlay>
              <WalkStatusHeader>
                <div className="title">
                  <span>🚶‍♂️</span> Continuous Walk Mapping
                </div>
                <div className="status-badge">
                  Active
                </div>
              </WalkStatusHeader>

              <WalkStatusGrid>
                <div className="metric-box">
                  <span className="label">Duration</span>
                  <span className="value">{formatDuration(walkDuration)}</span>
                </div>
                <div className="metric-box">
                  <span className="label">Plotted Nodes</span>
                  <span className="value">{nodes.length} waypoints</span>
                </div>
                <div className="metric-box">
                  <span className="label">GPS Signal</span>
                  {userLocation ? (
                    userLocation.accuracy <= 5 ? (
                      <span className="accuracy-indicator excellent">🟢 Excellent</span>
                    ) : userLocation.accuracy <= 15 ? (
                      <span className="accuracy-indicator moderate">🟡 Moderate</span>
                    ) : (
                      <span className="accuracy-indicator poor">🔴 Poor Signal</span>
                    )
                  ) : (
                    <span className="accuracy-indicator poor">Searching...</span>
                  )}
                </div>
              </WalkStatusGrid>

              <ThresholdControlContainer>
                <div className="header">
                  <span className="label">🔄 Turn Sensitivity</span>
                  <span className="val">{turnSensitivityAngle}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  step="5"
                  value={turnSensitivityAngle}
                  onChange={(e) => setTurnSensitivityAngle(Number(e.target.value))}
                  className="slider"
                  title="Adjust minimum angle change to trigger a waypoint at a turn"
                />
              </ThresholdControlContainer>
            </WalkStatusOverlay>
          )}
        </MapPanel>

        <SidebarPanel $visible={mobileTab === 'controls'}>
          <SidebarControls
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            pois={pois}
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
            poiEditMode={poiEditMode}
            setPoiEditMode={setPoiEditMode}
            categories={categories}
            poiNameEn={poiNameEn}
            setPoiNameEn={setPoiNameEn}
            poiNameHi={poiNameHi}
            setPoiNameHi={setPoiNameHi}
            poiNameOr={poiNameOr}
            setPoiNameOr={setPoiNameOr}
            poiDesc={poiDesc}
            setPoiDesc={setPoiDesc}
            poiCategoryId={poiCategoryId}
            setPoiCategoryId={setPoiCategoryId}
            poiIconUrl={poiIconUrl}
            setPoiIconUrl={setPoiIconUrl}
            poiLat={poiLat}
            setPoiLat={setPoiLat}
            poiLng={poiLng}
            setPoiLng={setPoiLng}
            poiPathName={poiPathName}
            setPoiPathName={setPoiPathName}
            handleCreatePOI={handleCreatePOI}
            handleUpdatePOI={handleUpdatePOI}
            handleDeletePOI={handleDeletePOI}
            updateNodeName={updateNodeName}
            removeNode={removeNode}
            removeEdge={removeEdge}
            resetPoiForm={resetPoiForm}
            setSuccess={setSuccess}
            setError={setError}
            loading={loading}
            editingPoiId={editingPoiId}
            setEditingPoiId={setEditingPoiId}
            
            userLocation={userLocation}
            isTrackingUser={isTrackingUser}
            useCurrentLocationForPoi={useCurrentLocationForPoi}
          />

          <FooterSummaryRow>
            <SummaryStats>
              <div className="stat">
                <span className="lbl">Total Nodes</span>
                <span className="val">{nodes.length} waypoints</span>
              </div>
              <div className="stat">
                <span className="lbl">Total Distance</span>
                <span className="val">
                  {totalDistance > 1000
                    ? `${(totalDistance / 1000).toFixed(2)} km`
                    : `${Math.round(totalDistance)} meters`}
                </span>
              </div>
            </SummaryStats>
          </FooterSummaryRow>
        </SidebarPanel>
      </WorkspaceLayout>
    </PageContainer>
  );
}
