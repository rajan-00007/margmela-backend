'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NodeItem, EdgeItem, POIItem } from '../hooks/useRouteGraph';

interface LeafletMapProps {
  selectedEvent: any;
  nodes: NodeItem[];
  setNodes: React.Dispatch<React.SetStateAction<NodeItem[]>>;
  edges: EdgeItem[];
  setEdges: React.Dispatch<React.SetStateAction<EdgeItem[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  pois: POIItem[];
  showPois: boolean;
  editorMode: 'draw' | 'connect' | 'delete';
  poiEditMode: 'list' | 'add' | 'edit';
  setPoiEditMode: (mode: 'list' | 'add' | 'edit') => void;
  poiLat: number | '';
  setPoiLat: (lat: number | '') => void;
  poiLng: number | '';
  setPoiLng: (lng: number | '') => void;
  setPoiNameEn: (name: string) => void;
  setSidebarTab: (tab: 'nodes' | 'edges' | 'pois') => void;
  setSuccess: (msg: string) => void;
  setError: (msg: string) => void;
  editingPoiId: string | null;
  
  // Geolocation values
  userLocation: { latitude: number; longitude: number; accuracy: number } | null;
  isTrackingUser: boolean;
  isDrawingRouteByWalking?: boolean;
  
  // Refs from useRouteGraph hook to prevent stale closure issues inside Leaflet listeners
  nodesRef: React.MutableRefObject<NodeItem[]>;
  edgesRef: React.MutableRefObject<EdgeItem[]>;
  selectedNodeIdRef: React.MutableRefObject<string | null>;
  editorModeRef: React.MutableRefObject<'draw' | 'connect' | 'delete'>;
  poiEditModeRef: React.MutableRefObject<'list' | 'add' | 'edit'>;
  poiLatRef: React.MutableRefObject<number | ''>;
  poiLngRef: React.MutableRefObject<number | ''>;
  sidebarTabRef: React.MutableRefObject<'nodes' | 'edges' | 'pois'>;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  selectedEvent,
  nodes,
  setNodes,
  edges,
  setEdges,
  selectedNodeId,
  setSelectedNodeId,
  pois,
  showPois,
  editorMode,
  poiEditMode,
  setPoiEditMode,
  poiLat,
  setPoiLat,
  poiLng,
  setPoiLng,
  setPoiNameEn,
  setSidebarTab,
  setSuccess,
  setError,
  editingPoiId,
  
  userLocation,
  isTrackingUser,
  isDrawingRouteByWalking = false,
  
  nodesRef,
  edgesRef,
  selectedNodeIdRef,
  editorModeRef,
  poiEditModeRef,
  poiLatRef,
  poiLngRef,
  sidebarTabRef,
}) => {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const LRef = useRef<any>(null);

  // Dynamic asset loader for Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      if ((window as any).L) {
        LRef.current = (window as any).L;
        setLeafletLoaded(true);
        return;
      }

      // Add CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      // Add JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      script.onload = () => {
        LRef.current = (window as any).L;
        setLeafletLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // Expose global callback selectors to windo object for Leaflet popup interactive buttons
  useEffect(() => {
    (window as any).createRouteNodeAtPoi = (poiId: string) => {
      const poi = pois.find(p => p.id === poiId);
      if (!poi) return;

      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);

      const existingNode = nodesRef.current.find(n => 
        Math.abs(n.latitude - lat) < 0.00001 && Math.abs(n.longitude - lng) < 0.00001
      );

      if (existingNode) {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === existingNode.id
              ? { ...n, poi_id: poi.id, node_type: 'poi' }
              : n
          )
        );
        setSelectedNodeId(existingNode.id);
        setSuccess(`Waypoint already exists at "${poi.name_en}". Selected and linked it to POI!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newNode: NodeItem = {
          id: newNodeId,
          latitude: lat,
          longitude: lng,
          name: `Entrance: ${poi.name_en}`,
          node_type: 'poi',
          poi_id: poi.id
        };

        setNodes((prev) => [...prev, newNode]);

        const currentSelected = selectedNodeIdRef.current;
        if (currentSelected) {
          setEdges((prev) => [...prev, { startNodeId: currentSelected, endNodeId: newNodeId }]);
        }

        setSelectedNodeId(newNodeId);
        setSuccess(`Created and linked waypoint at POI "${poi.name_en}"!`);
        setTimeout(() => setSuccess(''), 3000);
      }

      if (mapRef.current) {
        mapRef.current.closePopup();
      }
    };

    (window as any).convertNodeOrPointToPoi = (latStr: string, lngStr: string, name?: string) => {
      const lat = Number(latStr);
      const lng = Number(lngStr);
      setPoiEditMode('add');
      setPoiLat(lat);
      setPoiLng(lng);
      setPoiNameEn(name || `POI ${pois.length + 1}`);
      setSuccess(`Prefilled POI form with coordinates [${lat}, ${lng}]!`);
      setTimeout(() => setSuccess(''), 3000);
      setSidebarTab('pois');
      if (mapRef.current) {
        mapRef.current.closePopup();
      }
    };

    return () => {
      delete (window as any).createRouteNodeAtPoi;
      delete (window as any).convertNodeOrPointToPoi;
    };
  }, [pois]);

  const getMapCenter = (): [number, number] => {
    if (selectedEvent) {
      const { north, south, east, west } = selectedEvent;
      if (north !== null && south !== null && east !== null && west !== null) {
        return [(Number(north) + Number(south)) / 2, (Number(east) + Number(west)) / 2];
      }
      if (selectedEvent.center_lat !== null && selectedEvent.center_lng !== null) {
        return [Number(selectedEvent.center_lat), Number(selectedEvent.center_lng)];
      }
    }
    return [20.4800, 85.9000];
  };

  // 1. Map container initialization
  useEffect(() => {
    if (!leafletLoaded || !selectedEvent || typeof window === 'undefined') return;

    const L = LRef.current;
    if (!L) return;

    const center = getMapCenter();

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map('test-leaflet-map').setView(center, 15);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const { north, south, east, west } = selectedEvent;
    if (north !== null && south !== null && east !== null && west !== null) {
      const bounds = [
        [Number(south), Number(west)],
        [Number(north), Number(east)],
      ];
      L.rectangle(bounds, {
        color: '#f59e0b',
        weight: 1.5,
        fill: false,
        dashArray: '5, 8',
      }).addTo(map).bindPopup('Event Boundary Limit (BBox)');
      
      map.fitBounds(bounds);
    }

    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;

      if (sidebarTabRef.current === 'pois') {
        const latVal = Number(lat.toFixed(7));
        const lngVal = Number(lng.toFixed(7));
        if (poiEditModeRef.current === 'add' || poiEditModeRef.current === 'edit') {
          setPoiLat(latVal);
          setPoiLng(lngVal);
          setSuccess(`Updated POI coordinates to [${latVal}, ${lngVal}]!`);
          setTimeout(() => setSuccess(''), 2550);
        } else {
          const popupContent = `
            <div style="font-family:sans-serif;min-width:160px;color:#18181b;padding:4px;font-weight:normal;">
              <strong style="font-size:12px;display:block;margin-bottom:4px;color:#0f172a">Map Position</strong>
              <span style="font-size:10px;color:#71717a;display:block;margin-bottom:8px">Coordinates: ${latVal}, ${lngVal}</span>
              <button 
                onclick="window.convertNodeOrPointToPoi('${latVal}', '${lngVal}', '')"
                style="width:100%;padding:6px 10px;background-color:#10b981;color:white;border:none;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;box-shadow:0 2px 4px rgba(16,185,129,0.2);display:block;text-align:center;"
                onmouseover="this.style.backgroundColor='#059669'"
                onmouseout="this.style.backgroundColor='#10b981'"
              >
                ➕ Create POI Here
              </button>
            </div>
          `;
          L.popup()
            .setLatLng([latVal, lngVal])
            .setContent(popupContent)
            .openOn(map);
        }
        return;
      }

      const mode = editorModeRef.current;
      if (mode === 'delete' || mode === 'connect') return;

      const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newNode: NodeItem = {
        id: newNodeId,
        latitude: Number(lat.toFixed(7)),
        longitude: Number(lng.toFixed(7)),
        name: `Point ${nodesRef.current.length + 1}`,
      };

      setNodes((prev) => [...prev, newNode]);

      const currentSelected = selectedNodeIdRef.current;
      if (currentSelected) {
        setEdges((prev) => [...prev, { startNodeId: currentSelected, endNodeId: newNodeId }]);
      }
      
      setSelectedNodeId(newNodeId);
    });

    // Expose dynamic mapping ref to window so parent page layout buttons can center focus
    (window as any).leafletMapInstance = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      delete (window as any).leafletMapInstance;
    };
  }, [leafletLoaded, selectedEvent]);

  // Auto-center map once when tracking starts and userLocation is first retrieved
  const hasAutoCenteredRef = useRef(false);
  useEffect(() => {
    if (!isTrackingUser) {
      hasAutoCenteredRef.current = false;
      return;
    }
    if (userLocation && mapRef.current && !hasAutoCenteredRef.current) {
      mapRef.current.setView([userLocation.latitude, userLocation.longitude], 18);
      hasAutoCenteredRef.current = true;
    }
  }, [isTrackingUser, userLocation]);

  // 2. Render Markers, Edges, Draft indicators on State changes
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    // Clear old visual layers
    layersRef.current.forEach((layer) => layer.remove());
    layersRef.current = [];

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

    const categoryEmoji = (catName: string): string => {
      const c = (catName || '').toLowerCase();
      if (c.includes('toilet') || c.includes('washroom')) return '🚻';
      if (c.includes('police') || c.includes('security')) return '👮';
      if (c.includes('medical') || c.includes('hospital') || c.includes('first')) return '🏥';
      if (c.includes('water') || c.includes('drink')) return '💧';
      if (c.includes('exit') || c.includes('entrance') || c.includes('gate')) return '🚪';
      if (c.includes('parking')) return '🅿️';
      if (c.includes('food') || c.includes('eat')) return '🍽️';
      return '📍';
    };

    // Draw paths (edges)
    edges.forEach((edge) => {
      const start = nodes.find((n) => n.id === edge.startNodeId);
      const end = nodes.find((n) => n.id === edge.endNodeId);

      if (start && end) {
        const polyline = L.polyline(
          [
            [start.latitude, start.longitude],
            [end.latitude, end.longitude],
          ],
          {
            color: '#ef4444',
            weight: 5,
            opacity: 0.85,
            className: editorMode === 'delete' ? 'delete-polyline-cursor' : '',
          }
        ).addTo(map);
        
        polyline.bindPopup(`Edge Path: ${start.name} ↔ ${end.name}`);

        polyline.on('click', (evt: any) => {
          if (editorModeRef.current === 'delete') {
            L.DomEvent.stopPropagation(evt);
            setEdges((prev) =>
              prev.filter(
                (e) =>
                  !(e.startNodeId === edge.startNodeId && e.endNodeId === edge.endNodeId) &&
                  !(e.startNodeId === edge.endNodeId && e.endNodeId === edge.startNodeId)
              )
            );
            setSuccess('Deleted connection path!');
            setTimeout(() => setSuccess(''), 2500);
          }
        });

        layersRef.current.push(polyline);
      }
    });

    // Draw waypoints (nodes)
    nodes.forEach((node, idx) => {
      const isSelected = selectedNodeId === node.id;
      const isPoiSelectedNode = 
        (poiEditMode === 'add' || poiEditMode === 'edit') && 
        poiLat !== '' && 
        poiLng !== '' && 
        Math.abs(node.latitude - Number(poiLat)) < 0.000001 && 
        Math.abs(node.longitude - Number(poiLng)) < 0.000001;
      
      const linkedPoi = pois.find(
        (p) =>
          p.id === node.poi_id ||
          (Math.abs(node.latitude - p.latitude) < 0.000001 && Math.abs(node.longitude - p.longitude) < 0.000001)
      );
      
      let markerColor = node.is_entrance ? '#8b5cf6' : (node.is_parking ? '#3b82f6' : '#10b981');
      let borderStyle = (node.is_entrance || node.is_parking) ? 'border: 2px dashed white;' : 'border: 2px solid white;';
      let shadowStyle = node.is_entrance 
        ? 'box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);' 
        : (node.is_parking ? 'box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);' : 'box-shadow: 0 0 10px rgba(0,0,0,0.5);');
      
      if (isPoiSelectedNode) {
        markerColor = '#06b6d4';
        borderStyle = 'border: 3px solid #ffffff;';
        shadowStyle = 'box-shadow: 0 0 15px #06b6d4, 0 0 5px #06b6d4;';
      } else if (isSelected) {
        markerColor = '#eab308';
        borderStyle = 'border: 3px solid #ffffff;';
        shadowStyle = 'box-shadow: 0 0 15px #eab308, 0 0 5px #eab308;';
      }

      if (editorMode === 'delete') {
        markerColor = '#ef4444';
        borderStyle = 'border: 2px solid #fee2e2;';
        shadowStyle = 'box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);';
      }

      let customHtml = '';

      if (linkedPoi) {
        const color = categoryColor(linkedPoi.category_name);
        const emoji = categoryEmoji(linkedPoi.category_name);
        let activeGlow = `box-shadow: 0 0 10px ${color}, 0 0 3px ${color};`;
        let activeBorder = 'border: 2px solid #ffffff;';

        if (isPoiSelectedNode) {
          activeGlow = 'box-shadow: 0 0 15px #06b6d4, 0 0 5px #06b6d4;';
          activeBorder = 'border: 3px solid #ffffff;';
        } else if (isSelected) {
          activeGlow = 'box-shadow: 0 0 15px #eab308, 0 0 5px #eab308;';
          activeBorder = 'border: 3px solid #eab308;';
        }

        const nodeLabel = `${linkedPoi.name_en} ${emoji}`;

        customHtml = `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            ${activeBorder}
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            ${activeGlow}
            transition: all 0.3s ease;
            position: relative;
          ">
            <span style="font-size: 13px; line-height: 1;">${emoji}</span>
            <div style="
              position: absolute;
              bottom: -5px;
              right: -5px;
              background-color: #09090b;
              color: #ffffff;
              border: 1px solid rgba(255,255,255,0.4);
              border-radius: 50%;
              width: 14px;
              height: 14px;
              font-size: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
            ">
              ${idx + 1}
            </div>
          </div>
          <div style="
            position: absolute;
            top: -22px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(9, 9, 11, 0.9);
            color: #ffffff;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-family: sans-serif;
            white-space: nowrap;
            border: 1px solid ${color};
            pointer-events: none;
            font-weight: bold;
          ">
            ${nodeLabel}
          </div>
        `;
      } else {
        const labelBorderColor = node.is_entrance ? '#8b5cf6' : (node.is_parking ? '#3b82f6' : 'rgba(63, 63, 70, 0.4)');
        const labelText = node.is_entrance ? `${node.name} 🚪` : (node.is_parking ? `${node.name} 🅿️` : node.name);

        customHtml = `
          <div style="
            background-color: ${markerColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            ${borderStyle}
            color: white;
            font-weight: bold;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            ${shadowStyle}
            transition: all 0.3s ease;
          ">
            ${idx + 1}
          </div>
          <div style="
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(9, 9, 11, 0.85);
            color: #ffffff;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-family: sans-serif;
            white-space: nowrap;
            border: 1px solid ${labelBorderColor};
            pointer-events: none;
          ">
            ${labelText}
          </div>
        `;
      }

      const myIcon = L.divIcon({
        html: customHtml,
        className: 'custom-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([node.latitude, node.longitude], {
        icon: myIcon,
        draggable: true,
      }).addTo(map);

      marker.on('click', (evt: any) => {
        L.DomEvent.stopPropagation(evt);
        
        // Custom Click Handler logic routing back to parent state
        if (sidebarTabRef.current === 'pois') {
          if (poiEditModeRef.current === 'add' || poiEditModeRef.current === 'edit') {
            setPoiLat(node.latitude);
            setPoiLng(node.longitude);
            setSuccess(`Updated POI coordinates to match node "${node.name}"!`);
            setTimeout(() => setSuccess(''), 2500);
          } else {
            const popupContent = `
              <div style="font-family:sans-serif;min-width:160px;color:#18181b;padding:4px;font-weight:normal;">
                <strong style="font-size:12px;display:block;margin-bottom:4px;color:#0f172a">Waypoint: ${node.name}</strong>
                <span style="font-size:10px;color:#71717a;display:block;margin-bottom:8px">Coordinates: ${node.latitude}, ${node.longitude}</span>
                <button 
                  onclick="window.convertNodeOrPointToPoi('${node.latitude}', '${node.longitude}', '${node.name}')"
                  style="width:100%;padding:6px 10px;background-color:#10b981;color:white;border:none;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;box-shadow:0 2px 4px rgba(16,185,129,0.2);display:block;text-align:center;"
                  onmouseover="this.style.backgroundColor='#059669'"
                  onmouseout="this.style.backgroundColor='#10b981'"
                >
                  ➕ Create POI Here
                </button>
              </div>
            `;
            L.popup()
              .setLatLng([node.latitude, node.longitude])
              .setContent(popupContent)
              .openOn(map);
          }
          return;
        }

        const currentSelected = selectedNodeIdRef.current;
        const mode = editorModeRef.current;

        if (mode === 'delete') {
          setNodes((prev) => prev.filter((n) => n.id !== node.id));
          setEdges((prev) => prev.filter((e) => e.startNodeId !== node.id && e.endNodeId !== node.id));
          if (currentSelected === node.id) {
            setSelectedNodeId(null);
          }
          setSuccess('Deleted waypoint and its connected paths!');
          setTimeout(() => setSuccess(''), 2500);
          return;
        }

        if (mode === 'draw') {
          if (currentSelected === node.id) {
            setSelectedNodeId(null);
          } else {
            setSelectedNodeId(node.id);
          }
          return;
        }

        if (mode === 'connect') {
          if (currentSelected === null) {
            setSelectedNodeId(node.id);
          } else if (currentSelected === node.id) {
            setSelectedNodeId(null);
          } else {
            const edgeExists = edgesRef.current.some(
              (e) =>
                (e.startNodeId === currentSelected && e.endNodeId === node.id) ||
                (e.startNodeId === node.id && e.endNodeId === currentSelected)
            );

            if (!edgeExists) {
              setEdges((prev) => [...prev, { startNodeId: currentSelected, endNodeId: node.id }]);
              setSuccess(`Connected node paths!`);
              setTimeout(() => setSuccess(''), 2550);
            }
            setSelectedNodeId(node.id);
          }
        }
      });

      marker.on('dragend', (evt: any) => {
        const newLatLng = evt.target.getLatLng();
        setNodes((prev) => {
          const updated = [...prev];
          const nodeIdx = updated.findIndex((n) => n.id === node.id);
          if (nodeIdx !== -1) {
            updated[nodeIdx] = {
              ...updated[nodeIdx],
              latitude: Number(newLatLng.lat.toFixed(7)),
              longitude: Number(newLatLng.lng.toFixed(7)),
            };
          }
          return updated;
        });
      });

      layersRef.current.push(marker);
    });

    // Draw POIs
    if (showPois) {
      pois.forEach((poi) => {
        if (poiEditMode === 'edit' && editingPoiId === poi.id) return;

        const isLinkedToNode = nodes.some(
          (node) =>
            node.poi_id === poi.id ||
            (Math.abs(node.latitude - poi.latitude) < 0.000001 && Math.abs(node.longitude - poi.longitude) < 0.000001)
        );
        if (isLinkedToNode) return;

        const color = categoryColor(poi.category_name);
        const emoji = categoryEmoji(poi.category_name);
        const lat = Number(poi.latitude);
        const lng = Number(poi.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const poiIcon = L.divIcon({
          html: `
            <div style="
              background:${color};
              width:28px;height:28px;border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:2px solid rgba(0,0,0,0.6);
              box-shadow:0 2px 6px rgba(0,0,0,0.5);
              display:flex;align-items:center;justify-content:center;
            ">
              <span style="transform:rotate(45deg);font-size:12px;line-height:1;">${emoji}</span>
            </div>
          `,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [8, 28],
          popupAnchor: [6, -28]
        });

        const marker = L.marker([lat, lng], { icon: poiIcon }).addTo(map);

        marker.on('click', (evt: any) => {
          L.DomEvent.stopPropagation(evt);
        });

        marker.bindPopup(`
          <div style="font-family:sans-serif;min-width:150px;color:#18181b">
            <strong style="font-size:12px">${poi.name_en || 'POI'}</strong>
            <div style="font-size:10px;color:${color};text-transform:uppercase;margin-top:2px;font-weight:bold">${poi.category_name || ''}</div>
            ${poi.description ? `<div style="font-size:10px;color:#71717a;margin-top:4px">${poi.description}</div>` : ''}
            <div style="margin-top:8px;border-top:1px solid #e4e4e7;padding-top:6px;">
              <button 
                onclick="window.createRouteNodeAtPoi('${poi.id}')"
                style="
                  width: 100%;
                  padding: 5px 8px;
                  background: #0f172a;
                  color: #22d3ee;
                  border: 1px solid #334155;
                  border-radius: 6px;
                  font-size: 10px;
                  font-weight: bold;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 4px;
                  transition: all 0.2s ease;
                "
                onmouseover="this.style.background='#1e293b';this.style.borderColor='#22d3ee';"
                onmouseout="this.style.background='#0f172a';this.style.borderColor='#334155';"
              >
                📍 Link to Route Graph
              </button>
            </div>
          </div>
        `);

        layersRef.current.push(marker);
      });
    }

    // Draw Draft Draggable POI Marker
    if ((poiEditMode === 'add' || poiEditMode === 'edit') && poiLat !== '' && poiLng !== '') {
      const draftIcon = L.divIcon({
        html: `
          <div style="
            background: #22d3ee;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #ffffff;
            box-shadow: 0 0 15px rgba(34, 211, 238, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="transform: rotate(45deg); font-size: 14px; line-height: 1;">✨</span>
          </div>
        `,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const draftMarker = L.marker([Number(poiLat), Number(poiLng)], {
        icon: draftIcon,
        draggable: true
      }).addTo(map);

      draftMarker.on('dragend', (evt: any) => {
        const newLatLng = evt.target.getLatLng();
        setPoiLat(Number(newLatLng.lat.toFixed(7)));
        setPoiLng(Number(newLatLng.lng.toFixed(7)));
      });

      layersRef.current.push(draftMarker);
    }

    // Draw User Live GPS Location Marker & Accuracy Circle
    if (isTrackingUser && userLocation) {
      const { latitude, longitude, accuracy } = userLocation;
      
      // Pulsing blue dot icon
      const userIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 18px; height: 18px;">
            <div style="
              background: #3b82f6;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: 2px solid #ffffff;
              box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
              position: absolute;
              top: 2px;
              left: 2px;
              z-index: 2;
            "></div>
            <div style="
              background: rgba(59, 130, 246, 0.3);
              width: 18px;
              height: 18px;
              border-radius: 50%;
              position: absolute;
              top: 0;
              left: 0;
              animation: user-gps-pulse 1.8s infinite ease-in-out;
              z-index: 1;
            "></div>
          </div>
        `,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
      userMarker.bindPopup(`
        <div style="font-family:sans-serif;min-width:140px;color:#18181b;padding:2px;">
          <strong style="font-size:11px;display:block;margin-bottom:2px;color:#3b82f6">📍 You are here</strong>
          <span style="font-size:9px;color:#71717a;display:block;margin-bottom:6px">Accuracy: ±${Math.round(accuracy)}m</span>
        </div>
      `);
      layersRef.current.push(userMarker);

      // Draw accuracy radius circle (only if accuracy is reasonably precise, e.g. < 100 meters)
      if (accuracy && accuracy < 100) {
        const accuracyCircle = L.circle([latitude, longitude], {
          radius: accuracy,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.08,
          weight: 1,
          dashArray: '3, 4',
        }).addTo(map);
        layersRef.current.push(accuracyCircle);
      }
    }

    // Draw real-time live walking path from the last plotted node to the user's current GPS location
    if (isDrawingRouteByWalking && userLocation && nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const livePath = L.polyline(
        [
          [lastNode.latitude, lastNode.longitude],
          [userLocation.latitude, userLocation.longitude]
        ],
        {
          color: '#ef4444',
          weight: 5,
          opacity: 0.7,
          dashArray: '8, 8', // dashed to indicate a real-time live preview/stretch path!
          className: 'live-gps-walk-path'
        }
      ).addTo(map);
      layersRef.current.push(livePath);
    }
  }, [nodes, edges, selectedNodeId, editorMode, pois, showPois, poiEditMode, editingPoiId, poiLat, poiLng, userLocation, isTrackingUser, isDrawingRouteByWalking]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
      {!leafletLoaded ? (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', borderRadius: '16px', color: '#a1a1aa' }}>
          <span style={{ width: '32px', height: '32px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: '#22d3ee', animation: 'spin 0.8s linear infinite', marginBottom: '16px' }} />
          <p style={{ fontSize: '13px' }}>Mounting Interactive Map Module...</p>
        </div>
      ) : (
        <div id="test-leaflet-map" style={{ width: '100%', height: '100%', minHeight: '480px', borderRadius: '16px', backgroundColor: '#09090b' }} />
      )}
      <style>{`
        .delete-polyline-cursor {
          cursor: crosshair !important;
        }
        .leaflet-interactive {
          cursor: pointer;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes user-gps-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 0.1; }
          100% { transform: scale(0.8); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;
