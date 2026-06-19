'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';

interface BBoxMapProps {
  north: string;
  south: string;
  east: string;
  west: string;
  onCapture: (south: string, north: string, west: string, east: string) => void;
  selectedEvent: any;
  setError: (msg: string) => void;
  setSuccess: (msg: string) => void;
}

export const BBoxMap: React.FC<BBoxMapProps> = ({
  north,
  south,
  east,
  west,
  onCapture,
  selectedEvent,
  setError,
  setSuccess,
}) => {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [bboxLoading, setBboxLoading] = useState(false);
  
  const LRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const rectangleRef = useRef<any>(null);
  const markerSwRef = useRef<any>(null);
  const markerNeRef = useRef<any>(null);

  // Dynamic asset loader for Leaflet Leaflet.js & Leaflet.css CDN bounds
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      if ((window as any).L) {
        LRef.current = (window as any).L;
        setLeafletLoaded(true);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

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

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || typeof window === 'undefined') return;

    const L = LRef.current;
    if (!L) return;

    const initialNorth = north !== '' ? Number(north) : 20.4900;
    const initialSouth = south !== '' ? Number(south) : 20.4700;
    const initialEast = east !== '' ? Number(east) : 85.9100;
    const initialWest = west !== '' ? Number(west) : 85.8900;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const centerLat = (initialNorth + initialSouth) / 2;
    const centerLng = (initialEast + initialWest) / 2;

    const map = L.map('bbox-selector-map').setView([centerLat, centerLng], 14);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const initialBounds = [
      [initialSouth, initialWest],
      [initialNorth, initialEast]
    ];

    const rectangle = L.rectangle(initialBounds, {
      color: '#f59e0b',
      weight: 2.5,
      fillColor: '#f59e0b',
      fillOpacity: 0.15,
      dashArray: '5, 8'
    }).addTo(map);
    rectangleRef.current = rectangle;

    const swIcon = L.divIcon({
      html: `
        <div style="
          background: #10b981;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 8px;
          font-weight: bold;
        ">SW</div>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const markerSw = L.marker([initialSouth, initialWest], {
      icon: swIcon,
      draggable: true
    }).addTo(map);
    markerSwRef.current = markerSw;

    const neIcon = L.divIcon({
      html: `
        <div style="
          background: #8b5cf6;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 8px;
          font-weight: bold;
        ">NE</div>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const markerNe = L.marker([initialNorth, initialEast], {
      icon: neIcon,
      draggable: true
    }).addTo(map);
    markerNeRef.current = markerNe;

    const updateRectangle = () => {
      const swLatLng = markerSw.getLatLng();
      const neLatLng = markerNe.getLatLng();
      const bounds = [
        [swLatLng.lat, swLatLng.lng],
        [neLatLng.lat, neLatLng.lng]
      ];
      rectangle.setBounds(bounds);
    };

    markerSw.on('drag', updateRectangle);
    markerNe.on('drag', updateRectangle);

    map.fitBounds(initialBounds, { padding: [40, 40] });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, selectedEvent]);

  const handleCapture = () => {
    if (markerSwRef.current && markerNeRef.current) {
      const swLatLng = markerSwRef.current.getLatLng();
      const neLatLng = markerNeRef.current.getLatLng();

      const s = Math.min(swLatLng.lat, neLatLng.lat).toFixed(7);
      const n = Math.max(swLatLng.lat, neLatLng.lat).toFixed(7);
      const w = Math.min(swLatLng.lng, neLatLng.lng).toFixed(7);
      const e = Math.max(swLatLng.lng, neLatLng.lng).toFixed(7);

      onCapture(s, n, w, e);
    }
  };

  const locateAdmin = async () => {
    setBboxLoading(true);
    
    try {
      // Request permission first (triggers Android runtime dialog)
      const permStatus = await Geolocation.requestPermissions();
      if (permStatus.location === 'denied') {
        setError('Location permission denied. Please allow location access in your device settings.');
        setTimeout(() => setError(''), 3500);
        setBboxLoading(false);
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const newSouth = Number((lat - 0.001).toFixed(7));
      const newNorth = Number((lat + 0.001).toFixed(7));
      const newWest = Number((lng - 0.001).toFixed(7));
      const newEast = Number((lng + 0.001).toFixed(7));

      if (mapRef.current) {
        mapRef.current.setView([lat, lng], 15);
      }

      if (markerSwRef.current && markerNeRef.current && rectangleRef.current) {
        markerSwRef.current.setLatLng([newSouth, newWest]);
        markerNeRef.current.setLatLng([newNorth, newEast]);
        rectangleRef.current.setBounds([
          [newSouth, newWest],
          [newNorth, newEast]
        ]);
        if (mapRef.current) {
          mapRef.current.fitBounds([  
            [newSouth, newWest],
            [newNorth, newEast]
          ], { padding: [40, 40] });
        }
      }

      onCapture(String(newSouth), String(newNorth), String(newWest), String(newEast));
      setSuccess(`Located Admin! Placed BBox bounds right around your current position.`);
      setBboxLoading(false);
    } catch (err: any) {
      setError(`Could not locate admin: ${err.message || 'Permission Denied'}`);
      setTimeout(() => setError(''), 3500);
      setBboxLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f23', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ minWidth: '200px', flex: '1 1 auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🗺️ Map Bounding Box Selector
          </span>
          <span style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginTop: '4px' }}>
            Drag SW and NE circular markers. Click Capture Bounds when you are done.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={locateAdmin}
            disabled={bboxLoading}
            style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#6366f1', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
          >
            {bboxLoading ? 'Locating...' : '🛰️ Locate Me'}
          </button>
          <button
            type="button"
            onClick={handleCapture}
            style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#f59e0b', color: '#09090b', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
          >
            🎯 Capture Bounds
          </button>
        </div>
      </div>
      
      {!leafletLoaded ? (
        <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', border: '1px solid #1f1f23', borderRadius: '12px', color: '#a1a1aa', fontSize: '12px' }}>
          Loading Leaflet mapping library assets...
        </div>
      ) : (
        <div
          id="bbox-selector-map"
          style={{ height: '320px', borderRadius: '12px', border: '1px solid #1f1f23', zIndex: 1 }}
        />
      )}
    </div>
  );
};

export default BBoxMap;
