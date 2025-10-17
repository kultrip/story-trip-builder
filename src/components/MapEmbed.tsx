import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// You'll need to set your Mapbox token - for now using a placeholder
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface LocationMarker {
  lat: number;
  lng: number;
  name: string;
}

interface MapEmbedProps {
  coordinates?: {
    lat: number;
    lng: number;
  };
  locations?: LocationMarker[];
  name?: string;
  className?: string;
  zoom?: number;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ 
  coordinates, 
  locations,
  name = 'Location', 
  className = '',
  zoom = 15 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Determine center and locations to display
    let center: [number, number];
    let locationsToShow: LocationMarker[];

    if (locations && locations.length > 0) {
      // Multiple locations mode
      locationsToShow = locations;
      // Calculate center as average of all locations
      const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
      center = [avgLng, avgLat];
    } else if (coordinates) {
      // Single location mode
      center = [coordinates.lng, coordinates.lat];
      locationsToShow = [{ lat: coordinates.lat, lng: coordinates.lng, name: name }];
    } else {
      // No locations provided
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: locations && locations.length > 1 ? 12 : zoom,
    });

    // Add markers for all locations
    locationsToShow.forEach((location, index) => {
      const marker = new mapboxgl.Marker({ 
        color: index === 0 ? '#9333ea' : '#f97316' // purple for first, orange for others
      })
        .setLngLat([location.lng, location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${location.name}</strong>`))
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

    // If multiple locations, fit bounds to show all markers
    if (locations && locations.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(loc => {
        bounds.extend([loc.lng, loc.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      // Clean up markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, locations, name, zoom]);

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-64 rounded-lg overflow-hidden ${className}`}
    />
  );
};

export default MapEmbed;
