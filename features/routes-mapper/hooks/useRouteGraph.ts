import { useState, useEffect, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { useApi } from '../../../app/context/ApiContext';

export interface NodeItem {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  node_type?: string;
  poi_id?: string | null;
  is_entrance?: boolean;
  is_parking?: boolean;
}

export interface EdgeItem {
  startNodeId: string;
  endNodeId: string;
  path_name?: string | null;
}

export interface POIItem {
  id: string;
  name_en: string;
  name_hi?: string;
  name_or?: string;
  latitude: number;
  longitude: number;
  category_name: string;
  category_id?: string;
  description?: string;
  path_name?: string | null;
}

export const useRouteGraph = () => {
  const { apiFetch, selectedEvent, setSelectedEvent } = useApi();

  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [edges, setEdges] = useState<EdgeItem[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pois, setPois] = useState<POIItem[]>([]);
  const [showPois, setShowPois] = useState(true);
  const [editorMode, setEditorMode] = useState<'draw' | 'connect' | 'delete'>('draw');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [sidebarTab, setSidebarTab] = useState<'nodes' | 'edges' | 'pois'>('nodes');
  const [poiEditMode, setPoiEditMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingPoiId, setEditingPoiId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // POI Form State
  const [poiNameEn, setPoiNameEn] = useState('');
  const [poiNameHi, setPoiNameHi] = useState('');
  const [poiNameOr, setPoiNameOr] = useState('');
  const [poiDesc, setPoiDesc] = useState('');
  const [poiCategoryId, setPoiCategoryId] = useState('');
  const [poiIconUrl, setPoiIconUrl] = useState('');
  const [poiLat, setPoiLat] = useState<number | ''>('');
  const [poiLng, setPoiLng] = useState<number | ''>('');
  const [poiPathName, setPoiPathName] = useState('');

  // Geolocation tracking state
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [isTrackingUser, setIsTrackingUser] = useState(false);

  // Continuous Walk Route Drawing State
  const [isDrawingRouteByWalking, setIsDrawingRouteByWalking] = useState(false);
  const [turnSensitivityAngle, setTurnSensitivityAngle] = useState(20); // Default turn sensitivity is 20 degrees

  // Keep references to prevent stale closures in Leaflet event handlers
  const nodesRef = useRef<NodeItem[]>([]);
  const edgesRef = useRef<EdgeItem[]>([]);
  const selectedNodeIdRef = useRef<string | null>(null);
  const editorModeRef = useRef<'draw' | 'connect' | 'delete'>('draw');
  const poiEditModeRef = useRef<'list' | 'add' | 'edit'>('list');
  const poiLatRef = useRef<number | ''>('');
  const poiLngRef = useRef<number | ''>('');
  const sidebarTabRef = useRef<'nodes' | 'edges' | 'pois'>('nodes');

  // Walk-and-Draw refs
  const isDrawingRouteByWalkingRef = useRef(false);
  const turnSensitivityAngleRef = useRef(20);
  const runningHeadingRef = useRef<number | null>(null);
  const lastPlottedCoordsRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const coordsBufferRef = useRef<{ latitude: number; longitude: number; timestamp: number }[]>([]);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);
  useEffect(() => { selectedNodeIdRef.current = selectedNodeId; }, [selectedNodeId]);
  useEffect(() => { editorModeRef.current = editorMode; }, [editorMode]);
  useEffect(() => { poiEditModeRef.current = poiEditMode; }, [poiEditMode]);
  useEffect(() => { poiLatRef.current = poiLat; }, [poiLat]);
  useEffect(() => { poiLngRef.current = poiLng; }, [poiLng]);
  useEffect(() => { sidebarTabRef.current = sidebarTab; }, [sidebarTab]);
  useEffect(() => { isDrawingRouteByWalkingRef.current = isDrawingRouteByWalking; }, [isDrawingRouteByWalking]);
  useEffect(() => { turnSensitivityAngleRef.current = turnSensitivityAngle; }, [turnSensitivityAngle]);

  // Load POIs and Route Graph when active event changes
  useEffect(() => {
    if (selectedEvent) {
      loadPois();
      if (selectedEvent.has_route_graph) {
        loadRouteGraph();
      } else {
        setNodes([]);
        setEdges([]);
        setSelectedNodeId(null);
      }
    } else {
      setPois([]);
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
    }
  }, [selectedEvent]);

  // Load POI Categories on event activation
  useEffect(() => {
    if (!selectedEvent) {
      setCategories([]);
      return;
    }
    const fetchCategories = async () => {
      try {
        const res = await apiFetch('/api/pois/categories');
        if (res && res.success && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch POI categories:', err);
      }
    };
    fetchCategories();
  }, [selectedEvent]);

  const refreshSelectedEvent = async () => {
    if (!selectedEvent) return;
    try {
      const response = await apiFetch(`/api/events/${selectedEvent.id}`);
      if (response && response.success && response.data) {
        setSelectedEvent(response.data);
      }
    } catch (err) {
      console.error('Failed to refresh event state:', err);
    }
  };

  const loadPois = async () => {
    if (!selectedEvent) return;
    try {
      const response = await apiFetch(`/api/pois?eventId=${selectedEvent.id}`);
      if (response && response.success && Array.isArray(response.data)) {
        setPois(response.data);
      } else {
        setPois([]);
      }
    } catch (err: any) {
      console.error('Failed to load POIs:', err);
    }
  };

  const loadRouteGraph = async () => {
    if (!selectedEvent) return;
    setLoading(true);
    setError('');
    setSelectedNodeId(null);
    try {
      const response = await apiFetch(`/api/events/${selectedEvent.id}/routes`);
      if (response && response.status === 'success') {
        const dbNodes = response.data?.nodes || [];
        const dbEdges = response.data?.edges || [];

        const loadedNodes = dbNodes.map((n: any, idx: number) => ({
          id: n.id,
          latitude: Number(n.latitude),
          longitude: Number(n.longitude),
          name: n.name || `Point ${idx + 1}`,
          node_type: n.node_type || 'path',
          poi_id: n.poi_id || null,
          is_entrance: !!n.is_entrance,
          is_parking: !!n.is_parking,
        }));

        const loadedEdges = dbEdges.map((e: any) => ({
          startNodeId: e.start_node_id,
          endNodeId: e.end_node_id,
          path_name: e.path_name || null,
        }));

        setNodes(loadedNodes);
        setEdges(loadedEdges);
      } else {
        throw new Error('Could not fetch existing route graph');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve route graph');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!selectedEvent) return;
    if (nodes.length < 2) {
      setError('At least 2 nodes are required to compile and save a route graph!');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        nodes: nodes.map((n) => ({
          id: n.id,
          latitude: n.latitude,
          longitude: n.longitude,
          name: n.name,
          node_type: n.node_type || 'path',
          poi_id: n.poi_id || null,
          is_entrance: !!n.is_entrance,
          is_parking: !!n.is_parking,
        })),
        edges: edges.map((e) => ({
          startNodeId: e.startNodeId,
          endNodeId: e.endNodeId,
          path_name: e.path_name || null,
        })),
      };

      const response = await apiFetch(`/api/events/${selectedEvent.id}/routes`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.status === 'success') {
        setSuccess('Arbitrary Route Network Graph successfully saved in the database!');
        await refreshSelectedEvent();
        await loadRouteGraph();
      } else {
        throw new Error(response.message || 'Failed to save route graph');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving route graph');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async () => {
    if (!selectedEvent) return;
    if (!confirm('Are you sure you want to delete this route graph? This will clear all route nodes and edges.')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/api/routes/${selectedEvent.id}`, {
        method: 'DELETE',
      });

      if (response.status === 'success') {
        setSuccess('Route Graph successfully deleted and cleared from database.');
        await refreshSelectedEvent();
        setNodes([]);
        setEdges([]);
        setSelectedNodeId(null);
      } else {
        throw new Error(response.message || 'Failed to delete route graph');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while deleting route graph');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePOI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    if (poiLat === '' || poiLng === '') {
      setError('POI coordinates are required. Click on the map or drag the marker.');
      setTimeout(() => setError(''), 3500);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        event_id: selectedEvent.id,
        lat: Number(poiLat),
        lng: Number(poiLng),
        category_id: poiCategoryId || undefined,
        name_en: poiNameEn,
        name_hi: poiNameHi || undefined,
        name_or: poiNameOr || undefined,
        description: poiDesc || undefined,
        icon_url: poiIconUrl || undefined,
        path_name: poiPathName || undefined,
      };

      const res = await apiFetch('/api/pois', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.success) {
        setSuccess('POI created successfully!');
        const newPoi = res.data;
        
        // Update nodes matching this POI coordinates
        setNodes((prevNodes) =>
          prevNodes.map((n) => {
            const isMatch = Math.abs(n.latitude - Number(poiLat)) < 0.000001 &&
                            Math.abs(n.longitude - Number(poiLng)) < 0.000001;
            if (isMatch) {
              return { ...n, poi_id: newPoi.id, node_type: 'poi' };
            }
            return n;
          })
        );

        resetPoiForm();
        setPoiEditMode('list');
        await loadPois();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(res.error || 'Failed to create POI');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while creating POI');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePOI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !editingPoiId) return;
    if (poiLat === '' || poiLng === '') {
      setError('POI coordinates are required.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        lat: Number(poiLat),
        lng: Number(poiLng),
        category_id: poiCategoryId || undefined,
        name_en: poiNameEn,
        name_hi: poiNameHi || undefined,
        name_or: poiNameOr || undefined,
        description: poiDesc || undefined,
        icon_url: poiIconUrl || undefined,
        path_name: poiPathName || null,
      };

      const res = await apiFetch(`/api/pois/${editingPoiId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (res && res.success) {
        setSuccess('POI updated successfully!');
        
        setNodes((prevNodes) =>
          prevNodes.map((n) => {
            const isCoordMatch = Math.abs(n.latitude - Number(poiLat)) < 0.000001 &&
                                 Math.abs(n.longitude - Number(poiLng)) < 0.000001;
            if (n.poi_id === editingPoiId) {
              if (isCoordMatch) {
                return { ...n, node_type: 'poi' };
              } else {
                return { ...n, poi_id: null, node_type: 'path' };
              }
            } else if (isCoordMatch) {
              return { ...n, poi_id: editingPoiId, node_type: 'poi' };
            }
            return n;
          })
        );

        resetPoiForm();
        setPoiEditMode('list');
        await loadPois();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(res.error || 'Failed to update POI');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while updating POI');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePOI = async (poiId: string) => {
    if (!confirm('Are you sure you want to delete this POI? This action cannot be undone.')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiFetch(`/api/pois/${poiId}`, {
        method: 'DELETE',
      });

      if (res && res.success) {
        setSuccess('POI deleted successfully!');
        
        setNodes((prevNodes) =>
          prevNodes.map((n) => {
            if (n.poi_id === poiId) {
              return { ...n, poi_id: null, node_type: 'path' };
            }
            return n;
          })
        );

        await loadPois();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(res.error || 'Failed to delete POI');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while deleting POI');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateNodeName = (id: string, newName: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, name: newName } : n))
    );
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.startNodeId !== id && e.endNodeId !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
  };

  const removeEdge = (startId: string, endId: string) => {
    setEdges((prev) =>
      prev.filter(
        (e) =>
          !(e.startNodeId === startId && e.endNodeId === endId) &&
          !(e.startNodeId === endId && e.endNodeId === startId)
      )
    );
  };

  const clearMap = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSuccess('');
    setError('');
  };

  const undoLastNode = () => {
    const lastNode = nodes[nodes.length - 1];
    if (!lastNode) return;

    setNodes((prev) => prev.slice(0, -1));
    setEdges((prev) => prev.filter((e) => e.startNodeId !== lastNode.id && e.endNodeId !== lastNode.id));
    
    if (selectedNodeId === lastNode.id) {
      setSelectedNodeId(null);
    }
  };

  const resetPoiForm = () => {
    setPoiNameEn('');
    setPoiNameHi('');
    setPoiNameOr('');
    setPoiDesc('');
    setPoiCategoryId('');
    setPoiIconUrl('');
    setPoiLat('');
    setPoiLng('');
    setPoiPathName('');
    setEditingPoiId(null);
  };

  // Geolocation watcher effect (uses Capacitor Geolocation plugin for proper Android permission handling)
  useEffect(() => {
    if (!isTrackingUser) {
      setUserLocation(null);
      return;
    }

    if (typeof window === 'undefined') {
      setError('Geolocation is not available.');
      setIsTrackingUser(false);
      return;
    }

    let watchId: string | null = null;

    const startWatching = async () => {
      try {
        // Request permission first (this triggers the Android runtime permission dialog)
        const permStatus = await Geolocation.requestPermissions();
        if (permStatus.location === 'denied') {
          setError('Location permission denied. Please allow location access in your device settings.');
          setIsTrackingUser(false);
          return;
        }

        watchId = await Geolocation.watchPosition(
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
          (position, err) => {
            if (err) {
              console.error('Geolocation error:', err);
              setError('Failed to retrieve your location.');
              setIsTrackingUser(false);
              setTimeout(() => setError(''), 5000);
              return;
            }
            if (position) {
              const { latitude, longitude, accuracy } = position.coords;
              setUserLocation({ latitude, longitude, accuracy: accuracy ?? 0 });
            }
          }
        );
      } catch (err: any) {
        console.error('Geolocation setup error:', err);
        setError('Location permission denied. Please allow location access.');
        setIsTrackingUser(false);
        setTimeout(() => setError(''), 5000);
      }
    };

    startWatching();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [isTrackingUser]);

  // Helper: Calculate bearing in degrees between two coordinates (0 = North, 90 = East, 180 = South, 270 = West)
  const getBearingDegrees = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const dLng = toRad(lng2 - lng1);
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);

    const y = Math.sin(dLng) * Math.cos(rLat2);
    const x =
      Math.cos(rLat1) * Math.sin(rLat2) -
      Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLng);

    const brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
  };

  // Sync: When Turn-Drawing begins or ends, handle ref state and plot final node on stop
  useEffect(() => {
    if (isDrawingRouteByWalking) {
      setIsTrackingUser(true);
      runningHeadingRef.current = null;
      lastPlottedCoordsRef.current = null;
      coordsBufferRef.current = [];
    } else {
      // Walk Drawing just stopped!
      // If we have an active GPS position and at least one node, plot the final endpoint node!
      if (userLocation && nodesRef.current.length > 0) {
        const currentLat = Number(userLocation.latitude.toFixed(7));
        const currentLng = Number(userLocation.longitude.toFixed(7));
        const lastNode = nodesRef.current[nodesRef.current.length - 1];

        const distance = getDistanceMeters(
          lastNode,
          { id: '', latitude: currentLat, longitude: currentLng, name: '' }
        );

        // If they walked at least 3 meters from the last plotted node, add a final node!
        if (distance >= 3.0) {
          const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          const newNode: NodeItem = {
            id: newNodeId,
            latitude: currentLat,
            longitude: currentLng,
            name: `Point ${nodesRef.current.length + 1}`,
          };

          setNodes((prev) => [...prev, newNode]);
          setEdges((prev) => [...prev, { startNodeId: lastNode.id, endNodeId: newNodeId }]);
          setSelectedNodeId(newNodeId);
          
          setSuccess('Walk Drawing stopped: Plotted final endpoint!');
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    }
  }, [isDrawingRouteByWalking]);

  // Auto-plotting Turn & Terminal (Turnaround) Detection Effect
  useEffect(() => {
    if (!isDrawingRouteByWalking || !userLocation) {
      return;
    }

    // 1. Skip inaccurate coordinates to filter out GPS drift/noise
    if (userLocation.accuracy > 15) {
      return;
    }

    const currentLat = Number(userLocation.latitude.toFixed(7));
    const currentLng = Number(userLocation.longitude.toFixed(7));

    // 2. Initial Setup: If we have no nodes, plot the first node as the start point immediately
    if (nodesRef.current.length === 0) {
      const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newNode: NodeItem = {
        id: newNodeId,
        latitude: currentLat,
        longitude: currentLng,
        name: `Point 1`,
      };

      setNodes([newNode]);
      setSelectedNodeId(newNodeId);
      lastPlottedCoordsRef.current = { latitude: currentLat, longitude: currentLng };
      setSuccess('Walk-Draw started: Plotted start waypoint!');
      setTimeout(() => setSuccess(''), 3000);
      return;
    }

    // Ensure we have a reference to the last plotted coordinates
    if (!lastPlottedCoordsRef.current) {
      const lastNode = nodesRef.current[nodesRef.current.length - 1];
      lastPlottedCoordsRef.current = { latitude: lastNode.latitude, longitude: lastNode.longitude };
    }

    const lastCoords = lastPlottedCoordsRef.current;
    
    // Calculate distance from the last plotted node
    const distanceMeters = getDistanceMeters(
      { id: '', latitude: lastCoords.latitude, longitude: lastCoords.longitude, name: '' },
      { id: '', latitude: currentLat, longitude: currentLng, name: '' }
    );

    // Filter out minor movements (jitter) that are too close (e.g. less than 3 meters)
    if (distanceMeters < 3.0) {
      return;
    }

    // 3. Compute bearing from the last plotted node to current position
    const currentHeading = getBearingDegrees(
      lastCoords.latitude,
      lastCoords.longitude,
      currentLat,
      currentLng
    );

    // If we don't have a running segment heading yet, initialize it
    if (runningHeadingRef.current === null) {
      runningHeadingRef.current = currentHeading;
      return;
    }

    const segmentHeading = runningHeadingRef.current;

    // Calculate heading difference (bearing change) handling 360-degree wrap-around
    let headingDiff = Math.abs(currentHeading - segmentHeading);
    if (headingDiff > 180) {
      headingDiff = 360 - headingDiff;
    }

    const turnThreshold = turnSensitivityAngleRef.current;

    // A. Turnaround (Dead End / "Back Option") Detection (Heading change between 140 and 220 degrees)
    const isTurnaround = headingDiff >= 140 && headingDiff <= 220;

    // B. Normal Turn Detection (Heading change >= turnThreshold)
    const isTurn = headingDiff >= turnThreshold && !isTurnaround;

    // C. Maximum Distance Fail-safe (Every 15 meters of straight walking)
    const isMaxDistanceExceeded = distanceMeters >= 15.0;

    if (isTurnaround) {
      // The admin turned around! Plot a terminal node at the dead-end turnaround tip
      const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newNode: NodeItem = {
        id: newNodeId,
        latitude: currentLat,
        longitude: currentLng,
        name: `Point ${nodesRef.current.length + 1}`,
      };

      const lastNode = nodesRef.current[nodesRef.current.length - 1];
      setNodes((prev) => [...prev, newNode]);
      setEdges((prev) => [...prev, { startNodeId: lastNode.id, endNodeId: newNodeId }]);
      setSelectedNodeId(newNodeId);

      lastPlottedCoordsRef.current = { latitude: currentLat, longitude: currentLng };
      runningHeadingRef.current = currentHeading; // Reset segment heading in the new direction
      
      setSuccess('Dead-end/Turnaround detected! Plotted terminal waypoint.');
      setTimeout(() => setSuccess(''), 3000);

    } else if (isTurn) {
      // The admin made a turn! Plot a corner node
      const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newNode: NodeItem = {
        id: newNodeId,
        latitude: currentLat,
        longitude: currentLng,
        name: `Point ${nodesRef.current.length + 1}`,
      };

      const lastNode = nodesRef.current[nodesRef.current.length - 1];
      setNodes((prev) => [...prev, newNode]);
      setEdges((prev) => [...prev, { startNodeId: lastNode.id, endNodeId: newNodeId }]);
      setSelectedNodeId(newNodeId);

      lastPlottedCoordsRef.current = { latitude: currentLat, longitude: currentLng };
      runningHeadingRef.current = currentHeading; // Update active segment heading to the new turn direction
      
      setSuccess(`Turn detected (${Math.round(headingDiff)}°)! Plotted corner waypoint.`);
      setTimeout(() => setSuccess(''), 2500);

    } else if (isMaxDistanceExceeded) {
      // Auto-plot a mid-point node on a long straight path (every 15 meters)
      const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newNode: NodeItem = {
        id: newNodeId,
        latitude: currentLat,
        longitude: currentLng,
        name: `Point ${nodesRef.current.length + 1}`,
      };

      const lastNode = nodesRef.current[nodesRef.current.length - 1];
      setNodes((prev) => [...prev, newNode]);
      setEdges((prev) => [...prev, { startNodeId: lastNode.id, endNodeId: newNodeId }]);
      setSelectedNodeId(newNodeId);

      lastPlottedCoordsRef.current = { latitude: currentLat, longitude: currentLng };
      runningHeadingRef.current = currentHeading; // Update active segment heading
      
      setSuccess(`Plotted waypoint #${nodesRef.current.length + 1} (Straight 15m)`);
      setTimeout(() => setSuccess(''), 2000);
    }

  }, [userLocation, isDrawingRouteByWalking]);

  const addNodeAtCurrentLocation = () => {
    if (!userLocation) {
      setError('Current GPS position is not available. Please ensure tracking is ON.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const latVal = Number(userLocation.latitude.toFixed(7));
    const lngVal = Number(userLocation.longitude.toFixed(7));

    // Check if a node already exists very close to this coordinate to avoid duplicates
    const duplicate = nodes.find(n => 
      Math.abs(n.latitude - latVal) < 0.00001 && Math.abs(n.longitude - lngVal) < 0.00001
    );

    if (duplicate) {
      setSelectedNodeId(duplicate.id);
      setSuccess('A waypoint already exists at your current location. Selected it.');
      setTimeout(() => setSuccess(''), 2500);
      return;
    }

    const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newNode: NodeItem = {
      id: newNodeId,
      latitude: latVal,
      longitude: lngVal,
      name: `Point ${nodes.length + 1}`,
    };

    setNodes((prev) => [...prev, newNode]);

    const currentSelected = selectedNodeIdRef.current;
    if (currentSelected) {
      setEdges((prev) => [...prev, { startNodeId: currentSelected, endNodeId: newNodeId }]);
    }
    
    setSelectedNodeId(newNodeId);
    setSuccess('Created waypoint at your current location!');
    setTimeout(() => setSuccess(''), 2500);
  };

  const useCurrentLocationForPoi = () => {
    if (!userLocation) {
      setError('Current GPS position is not available. Please ensure tracking is ON.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const latVal = Number(userLocation.latitude.toFixed(7));
    const lngVal = Number(userLocation.longitude.toFixed(7));

    setPoiLat(latVal);
    setPoiLng(lngVal);
    
    if (!poiNameEn) {
      setPoiNameEn(`POI ${pois.length + 1} (Current Location)`);
    }
    
    setPoiEditMode('add');
    setSidebarTab('pois');
    setSuccess('Coordinates updated to your current location!');
    setTimeout(() => setSuccess(''), 2500);
  };

  // Helper: Haversine distance calculator between node items
  const getDistanceMeters = (start: NodeItem, end: NodeItem): number => {
    const R = 6371e3; // Earth radius
    const toRad = (degrees: number) => (degrees * Math.PI) / 180;
    
    const dLat = toRad(end.latitude - start.latitude);
    const dLng = toRad(end.longitude - start.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(start.latitude)) *
        Math.cos(toRad(end.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Sum all edge segments for summary metrics
  const totalDistance = edges.reduce((acc, edge) => {
    const start = nodes.find((n) => n.id === edge.startNodeId);
    const end = nodes.find((n) => n.id === edge.endNodeId);
    if (start && end) {
      return acc + getDistanceMeters(start, end);
    }
    return acc;
  }, 0);

  return {
    selectedEvent,
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedNodeId,
    setSelectedNodeId,
    pois,
    setPois,
    showPois,
    setShowPois,
    editorMode,
    setEditorMode,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,

    // Continuous Walk Drawing
    isDrawingRouteByWalking,
    setIsDrawingRouteByWalking,
    turnSensitivityAngle,
    setTurnSensitivityAngle,
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
    loadPois,
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
    refreshSelectedEvent,

    // Geolocation values
    userLocation,
    isTrackingUser,
    setIsTrackingUser,
    addNodeAtCurrentLocation,
    useCurrentLocationForPoi,
  };
};
