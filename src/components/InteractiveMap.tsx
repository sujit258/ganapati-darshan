'use client';

import React, { useEffect, useRef } from 'react';
import { useDarshan } from '@/context/DarshanContext';
import { toMarathiNumber } from '@/lib/marathiNumbers';
import { getDirectionsUrl } from '@/lib/maps';
import 'leaflet/dist/leaflet.css';

export const InteractiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { routeStops, userLocation } = useDarshan();

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    let L: any;
    try {
      L = require('leaflet');
    } catch (e) {
      console.error('Leaflet load error', e);
      return;
    }

    // Default center: Central Pune (Budhwar Peth / Shaniwar Wada)
    const centerLat = userLocation?.latitude || 18.5165;
    const centerLng = userLocation?.longitude || 73.8555;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([centerLat, centerLng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], 15);
    }

    const map = mapInstanceRef.current;

    // Clear previous markers & polylines
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Draw user location marker if present
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position:relative; width:28px; height:28px; display:flex; items-center; justify-content:center;">
            <div style="position:absolute; inset:0; background:#3b82f6; opacity:0.3; border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:16px; height:16px; background:#2563eb; border:3px solid #ffffff; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.3); margin:auto;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const markerPopupText = userLocation.isPreset
        ? `📍 सुरुवातीचे ठिकाण: ${userLocation.presetName || 'शनिवार वाडा'}`
        : '📍 तुमचे सध्याचे स्थान';

      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<strong style="font-family:system-ui;">${markerPopupText}</strong>`);
    }

    // Coordinates path for route polyline
    const routeCoords: [number, number][] = [];
    if (userLocation) {
      routeCoords.push([userLocation.latitude, userLocation.longitude]);
    }

    // Add Ganpati stop markers
    routeStops.forEach((stop) => {
      const { ganpati, sequenceNumber, isVisited } = stop;
      const lat = ganpati.coordinates.latitude;
      const lng = ganpati.coordinates.longitude;
      routeCoords.push([lat, lng]);

      const bgCol = isVisited ? '#10b981' : '#ea580c';
      const badgeText = toMarathiNumber(sequenceNumber);

      const customIcon = L.divIcon({
        className: 'custom-ganpati-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${bgCol};
            color: #ffffff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            border: 2px solid #ffffff;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              font-family: 'Noto Sans Devanagari', system-ui, sans-serif;
              font-size: 13px;
              font-weight: 800;
              line-height: 1;
              color: #ffffff;
            ">${badgeText}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28],
      });

      const directionsLink = getDirectionsUrl(lat, lng, userLocation?.latitude, userLocation?.longitude);

      const popupContent = `
        <div style="font-family: 'Noto Sans Devanagari', system-ui, sans-serif; min-width: 170px; padding: 4px;">
          <span style="font-size: 11px; font-weight: 700; color: ${bgCol};">${sequenceNumber}वे दर्शन</span>
          <h4 style="margin: 3px 0 2px; font-size: 14px; font-weight: 700; color: #0f172a;">${ganpati.name}</h4>
          <p style="margin: 0 0 6px; font-size: 11px; color: #64748b;">${ganpati.area}</p>
          <a href="${directionsLink}" target="_blank" rel="noopener noreferrer" style="
            display: inline-block;
            background: #ea580c;
            color: #ffffff;
            text-decoration: none;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
          ">🗺️ दिशा मिळवा</a>
        </div>
      `;

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    // Draw route polyline
    if (routeCoords.length > 1) {
      L.polyline(routeCoords, {
        color: '#f97316',
        weight: 3.5,
        opacity: 0.75,
        dashArray: '8, 6',
      }).addTo(map);
    }
  }, [routeStops, userLocation]);

  return (
    <div className="w-full h-[380px] rounded-2xl overflow-hidden border border-border shadow-soft relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border text-[11px] font-semibold text-slate-700 shadow-sm">
        📍 १ ते ९ दर्शन मार्ग
      </div>
    </div>
  );
};
