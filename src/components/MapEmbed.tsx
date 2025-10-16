import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// You'll need to set your Mapbox token - for now using a placeholder
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapEmbedProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  name?: string;
  className?: string;
  zoom?: number;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ 
  coordinates, 
  name = 'Location', 
  className = '',
  zoom = 15 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: zoom,
    });

    // Add marker
    new mapboxgl.Marker({ color: '#9333ea' })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${name}</strong>`))
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates.lat, coordinates.lng, name, zoom]);

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-64 rounded-lg overflow-hidden ${className}`}
    />
  );
};

export default MapEmbed;
