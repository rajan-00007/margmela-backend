'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface NodeItem {
  id: string;
  name: string | null;
  latitude: number;
  longitude: number;
  node_type?: string;
  is_entrance?: boolean;
  is_parking?: boolean;
}

export interface EdgeItem {
  id: string;
  start_node_id: string;
  end_node_id: string;
  distance: number;
  path_name?: string | null;
}

interface AdvisoryMapProps {
  selectedEvent: any;
  nodes: NodeItem[];
  edges: EdgeItem[];
  startNodeId: string | null;
  setStartNodeId: (id: string | null) => void;
  endNodeId: string | null;
  setEndNodeId: (id: string | null) => void;
  advisoryEdges: Record<string, 'blocked' | 'recommended'>;
  setAdvisoryEdges: React.Dispatch<React.SetStateAction<Record<string, 'blocked' | 'recommended'>>>;
  pickMode: 'start' | 'end' | 'toggle' | 'draw';
  lastDrawNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  eventZones?: any[];
  selectedZoneIds?: string[];
  setSelectedZoneIds?: React.Dispatch<React.SetStateAction<string[]>>;
  advisoryType?: 'zone' | 'road';
}

export const AdvisoryMap: React.FC<AdvisoryMapProps> = ({
  selectedEvent,
  nodes,
  edges,
  startNodeId,
  setStartNodeId,
  endNodeId,
  setEndNodeId,
  advisoryEdges,
  setAdvisoryEdges,
  pickMode,
  lastDrawNodeId,
  onNodeClick,
  eventZones = [],
  selectedZoneIds = [],
  setSelectedZoneIds,
  advisoryType = 'road',
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
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

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
    return [20.2960587, 85.8245398]; // Default fallbacks
  };

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || typeof window === 'undefined') return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const center = getMapCenter();
    const map = L.map('advisory-map-canvas', {
      zoomControl: true,
      attributionControl: false,
    }).setView(center, 16);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Event bounds rectangle
    if (selectedEvent) {
      const { north, south, east, west } = selectedEvent;
      if (north !== null && south !== null && east !== null && west !== null) {
        const bounds = [
          [Number(south), Number(west)],
          [Number(north), Number(east)],
        ];
        L.rectangle(bounds, {
          color: '#10b981',
          weight: 1.5,
          fill: true,
          fillColor: '#10b981',
          fillOpacity: 0.02,
          dashArray: '5, 8',
        }).addTo(map);

        map.fitBounds(bounds);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, selectedEvent]);

  // Render Route Graph and Highlights on active changes
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const L = LRef.current || (window as any).L;
    const map = mapRef.current;

    // Clear previous dynamic layers
    layersRef.current.forEach((layer) => layer.remove());
    layersRef.current = [];

    const newLayers: any[] = [];

    // Draw clickable zone polygons if in zone mode
    if (advisoryType === 'zone') {
      eventZones.forEach((zone) => {
        const boundary = typeof zone.boundary === 'string' ? JSON.parse(zone.boundary) : zone.boundary;
        if (!Array.isArray(boundary) || boundary.length < 3) return;

        const latlngs = boundary.map((p: any) => [
          p.lat !== undefined ? Number(p.lat) : Number(p.latitude),
          p.lng !== undefined ? Number(p.lng) : Number(p.longitude)
        ]);

        const isSelected = selectedZoneIds.includes(zone.id);
        const polygon = L.polygon(latlngs, {
          color: isSelected ? '#3b82f6' : '#9ca3af',
          fillColor: isSelected ? '#3b82f6' : '#d1d5db',
          fillOpacity: isSelected ? 0.35 : 0.08,
          weight: isSelected ? 3 : 1.5,
          dashArray: isSelected ? undefined : '5, 5'
        }).addTo(map);

        polygon.bindTooltip(zone.name, {
          permanent: true,
          direction: 'center',
          className: isSelected ? 'zone-tooltip-selected' : 'zone-tooltip-unselected'
        });

        polygon.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          if (setSelectedZoneIds) {
            setSelectedZoneIds((prev) =>
              isSelected ? prev.filter((id) => id !== zone.id) : [...prev, zone.id]
            );
          }
        });

        newLayers.push(polygon);
      });

      layersRef.current = newLayers;
      return;
    }

    // 1. Draw Route Edges
    edges.forEach((edge) => {
      const startNode = nodes.find((n) => n.id === edge.start_node_id);
      const endNode = nodes.find((n) => n.id === edge.end_node_id);
      if (!startNode || !endNode) return;

      const latlngs: [number, number][] = [
        [Number(startNode.latitude), Number(startNode.longitude)],
        [Number(endNode.latitude), Number(endNode.longitude)],
      ];

      const status = advisoryEdges[edge.id];
      let color = '#22d3ee'; // Normal Cyan
      let weight = 4;
      let opacity = 0.55;
      let dashArray = undefined;

      if (status === 'blocked') {
        color = '#ef4444'; // Red Blocked
        weight = 7;
        opacity = 0.85;
      } else if (status === 'recommended') {
        color = '#10b981'; // Green Detour
        weight = 7;
        opacity = 0.85;
        dashArray = '5, 5';
      }

      // Buffer Corridor background for red/green for high visibility
      if (status) {
        const corridor = L.polyline(latlngs, {
          color,
          weight: 24,
          opacity: 0.15,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
        newLayers.push(corridor);
      }

      // Draw Main Polyline Segment
      const polyline = L.polyline(latlngs, {
        color,
        weight,
        opacity,
        dashArray,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Tooltip for path name if present
      if (edge.path_name) {
        polyline.bindTooltip(edge.path_name, {
          permanent: false,
          direction: 'center',
          className: 'path-name-tooltip',
        });
      }

      // Add click handler for manual toggles
      polyline.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        if (pickMode === 'toggle') {
          setAdvisoryEdges((prev) => {
            const next = { ...prev };
            const current = next[edge.id];
            if (!current) {
              next[edge.id] = 'blocked';
            } else if (current === 'blocked') {
              next[edge.id] = 'recommended';
            } else {
              delete next[edge.id];
            }
            return next;
          });
        }
      });

      newLayers.push(polyline);
    });

    // 2. Draw Waypoints
    nodes.forEach((node) => {
      const lat = Number(node.latitude);
      const lng = Number(node.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isStart = node.id === startNodeId;
      const isEnd = node.id === endNodeId;
      const isLastDraw = node.id === lastDrawNodeId && pickMode === 'draw';

      let radius = 6;
      let fillColor = '#0891b2'; // Cyan Node
      let color = '#ffffff';
      let weight = 1.5;
      let fillOpacity = 1;

      if (isLastDraw) {
        radius = 11;
        fillColor = '#d946ef'; // Magenta Active Draw Anchor
        color = '#ffffff';
        weight = 3;
      } else if (isStart) {
        radius = 10;
        fillColor = '#10b981'; // Green Start Anchor
        color = '#ffffff';
        weight = 3;
      } else if (isEnd) {
        radius = 10;
        fillColor = '#f97316'; // Orange End Anchor
        color = '#ffffff';
        weight = 3;
      } else if (node.is_entrance) {
        radius = 8;
        fillColor = '#8b5cf6'; // Purple Entrance
      } else if (node.is_parking) {
        radius = 8;
        fillColor = '#3b82f6'; // Blue Parking
      }

      const marker = L.circleMarker([lat, lng], {
        radius,
        fillColor,
        color,
        weight,
        fillOpacity,
      }).addTo(map);

      // Node popups / descriptions
      let tooltipText = node.name || `Waypoint #${node.id.substring(0, 4)}`;
      if (isLastDraw) tooltipText = `✏️ DETOUR DRAW ANCHOR: ${tooltipText}`;
      else if (isStart) tooltipText = `🏁 DETOUR START: ${tooltipText}`;
      else if (isEnd) tooltipText = `🎯 DETOUR END: ${tooltipText}`;
      marker.bindTooltip(tooltipText);

      // Node Click listener
      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        onNodeClick(node.id);
      });

      newLayers.push(marker);
    });

    layersRef.current = newLayers;
  }, [leafletLoaded, nodes, edges, startNodeId, endNodeId, advisoryEdges, pickMode, lastDrawNodeId, onNodeClick, eventZones, selectedZoneIds, setSelectedZoneIds, advisoryType]);

  return (
    <div id="advisory-map-canvas" style={{ width: '100%', height: '100%', minHeight: '350px' }} />
  );
};

export default AdvisoryMap;
