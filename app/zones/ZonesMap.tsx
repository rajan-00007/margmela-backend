'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface ZoneItem {
  id: string;
  name: string;
  boundary: { lat: number; lng: number }[];
  allow_pedestrians: boolean;
  allow_2wheelers: boolean;
  allow_cars: boolean;
  advisory?: string;
  color?: string; // Curated color
}

interface ZonesMapProps {
  selectedEvent: any;
  zones: ZoneItem[];
  activeZoneId: string | null;
  drawnPoints: { lat: number; lng: number }[];
  setDrawnPoints: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }[]>>;
  drawMode: boolean;
  onSelectZone: (id: string) => void;
}

// Curated list of color strings for rendering multiple zones
export const ZONE_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#f97316'  // Orange
];

export const ZonesMap: React.FC<ZonesMapProps> = ({
  selectedEvent,
  zones,
  activeZoneId,
  drawnPoints,
  setDrawnPoints,
  drawMode,
  onSelectZone,
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
    const map = L.map('zones-map-canvas', {
      zoomControl: true,
      attributionControl: false,
    }).setView(center, 15);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Event bounds bounding box rectangle
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
          fillOpacity: 0.01,
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

  // Click handler on map canvas for drawing polygon vertices
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !drawMode) return;
    const L = LRef.current || (window as any).L;
    const map = mapRef.current;

    const onMapClick = (e: any) => {
      const { lat, lng } = e.latlng;
      setDrawnPoints((prev) => [...prev, { lat, lng }]);
    };

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
    };
  }, [leafletLoaded, drawMode, setDrawnPoints]);

  // Draw overlay components: existing zones and active draft polygon
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const L = LRef.current || (window as any).L;
    const map = mapRef.current;

    // Clear previous overlays
    layersRef.current.forEach((layer) => layer.remove());
    layersRef.current = [];

    const newLayers: any[] = [];

    // 1. Draw Existing Saved Zones
    zones.forEach((zone, idx) => {
      if (!zone.boundary || zone.boundary.length < 3) return;

      const latlngs = zone.boundary.map((p) => [p.lat, p.lng] as [number, number]);
      const color = ZONE_COLORS[idx % ZONE_COLORS.length];
      const isActive = zone.id === activeZoneId;

      const polygon = L.polygon(latlngs, {
        color,
        fillColor: color,
        fillOpacity: isActive ? 0.35 : 0.15,
        weight: isActive ? 3 : 1.5,
        dashArray: isActive ? undefined : '3, 4'
      }).addTo(map);

      // Bind advisory details popups
      let popupContent = `
        <div style="font-family: inherit; color: #1f2937; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #111827;">${zone.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #4b5563;">
            Rules: ${zone.allow_pedestrians ? '🚶 Allowed' : '🚶 Restricted'} | 
            ${zone.allow_2wheelers ? '🏍️ Allowed' : '🏍️ Restricted'} | 
            ${zone.allow_cars ? '🚗 Allowed' : '🚗 Restricted'}
          </p>
          ${zone.advisory ? `<p style="margin: 0; font-size: 11.5px; background: #f3f4f6; padding: 6px; border-radius: 6px; border-left: 3px solid #f59e0b; color: #374151;"><strong>Advisory:</strong> ${zone.advisory}</p>` : ''}
        </div>
      `;
      polygon.bindPopup(popupContent);

      polygon.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        onSelectZone(zone.id);
      });

      newLayers.push(polygon);
    });

    // 2. Draw Active Drawing Draft
    if (drawMode && drawnPoints.length > 0) {
      const latlngs = drawnPoints.map((p) => [p.lat, p.lng] as [number, number]);

      // Draw lines connecting points
      if (drawnPoints.length >= 2) {
        const polyline = L.polyline(latlngs, {
          color: '#fbbf24', // Amber
          weight: 2.5,
          dashArray: '5, 5'
        }).addTo(map);
        newLayers.push(polyline);
      }

      // Draw transparent polygon preview if 3+ points
      if (drawnPoints.length >= 3) {
        const previewPolygon = L.polygon(latlngs, {
          color: '#fbbf24',
          fillColor: '#fbbf24',
          fillOpacity: 0.1,
          weight: 0
        }).addTo(map);
        newLayers.push(previewPolygon);
      }

      // Draw draggable/clickable vertex markers
      drawnPoints.forEach((point, index) => {
        const isFirst = index === 0;
        const markerColor = isFirst ? '#10b981' : '#fbbf24'; // First vertex is green (to click and close shape)
        const radius = isFirst ? 7 : 5;

        const marker = L.circleMarker([point.lat, point.lng], {
          radius,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 1.5,
          fillOpacity: 1,
        }).addTo(map);

        marker.bindTooltip(
          isFirst 
            ? 'Click here to CLOSE polygon' 
            : `Vertex #${index + 1}. Click to delete.`,
          { direction: 'top' }
        );

        marker.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          if (isFirst && drawnPoints.length >= 3) {
            // Close polygon drawing action
            map.fire('dblclick'); // Trigger completion if needed, or user click button
          } else {
            // Remove vertex
            setDrawnPoints((prev) => prev.filter((_, idx) => idx !== index));
          }
        });

        newLayers.push(marker);
      });
    }

    layersRef.current = newLayers;
  }, [leafletLoaded, zones, activeZoneId, drawnPoints, drawMode, onSelectZone, setDrawnPoints]);

  // Fit boundaries when an active zone is selected in sidebar list
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !activeZoneId) return;
    const L = LRef.current || (window as any).L;
    const map = mapRef.current;

    const selectedZone = zones.find((z) => z.id === activeZoneId);
    if (selectedZone && selectedZone.boundary && selectedZone.boundary.length >= 3) {
      const latlngs = selectedZone.boundary.map((p) => [p.lat, p.lng] as [number, number]);
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activeZoneId, leafletLoaded, zones]);

  return (
    <div id="zones-map-canvas" style={{ width: '100%', height: '100%', minHeight: '450px' }} />
  );
};

export default ZonesMap;
