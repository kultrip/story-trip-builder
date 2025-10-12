import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/utils/types';

interface MapProps {
  locations: {
    lat: number;
    lng: number;
    name?: string;
    address?: string;
    inspirationReference?: string;
  }[];
  center?: { lat: number; lng: number };
  zoom?: number;
  interactive?: boolean;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  locations,
  center,
  zoom = 12,
  interactive = true,
  className = ""
}) => {
  // Check if locations are valid/non-empty
  const hasLocations = Array.isArray(locations) && locations.length > 0;

  // Show error message if no coordinates
  if (!hasLocations) {
    return (
      <div className={`rounded-lg overflow-hidden ${className}`}>
        <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-100 text-gray-500 text-lg">
          No locations to display on the map.
        </div>
      </div>
    );
  }

  // Compute map center: prefer prop, else first location
  const mapCenter = center || { lat: locations[0].lat, lng: locations[0].lng };

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    const MAPBOX_API_KEY = 'pk.eyJ1Ijoia3VsdHJpcCIsImEiOiJjbThjYzZtYmcxdXJ5MmpyN250Ym9mM28yIn0.tB4lKBihQDhgp6DRkDT8lQ';
    mapboxgl.accessToken = MAPBOX_API_KEY;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoom,
      interactive: interactive,
    });

    if (interactive) {
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
    }

    map.current.on('load', () => {
      setMapInitialized(true);

      if (map.current) {
        map.current.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
      }

      // Add marker for the center
      const centerMarker = new mapboxgl.Marker({
        color: 'red', // Customize marker color
      })
        .setLngLat([mapCenter.lng, mapCenter.lat])
        .addTo(map.current!);

      markers.current.push(centerMarker);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [mapCenter, zoom, interactive]);

  useEffect(() => {
    if (!map.current || !mapInitialized || locations.length === 0) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((location, index) => {
      const el = document.createElement('div');
      el.className = 'flex items-center justify-center w-8 h-8 bg-kultrip-purple text-white rounded-full border-2 border-white shadow-md font-bold text-sm';
      el.textContent = (index + 1).toString();

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current!);

      if (interactive) {
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          className: 'rounded-lg shadow-lg border border-white/20 overflow-hidden',
        }).setHTML(`
          <div class="p-3 max-w-sm">
            <h3 class="font-bold text-gray-900">${location.name || ""}</h3>
            <p class="text-sm text-gray-600 mt-1">${location.address || ""}</p>
            ${location.inspirationReference ? 
              `<p class="text-xs italic text-kultrip-purple mt-2">${location.inspirationReference}</p>` : ''}
          </div>
        `);

        marker.setPopup(popup);
      }

      markers.current.push(marker);
      bounds.extend([location.lng, location.lat]);
    });

    if (locations.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15,
      });
    } else if (locations.length === 1) {
      map.current.setCenter([locations[0].lng, locations[0].lat]);
      map.current.setZoom(14);
    }
  }, [locations, mapInitialized, interactive]);

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[300px]" 
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        .mapboxgl-popup-content {
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        .mapboxgl-popup-close-button {
          font-size: 16px;
          color: #666;
        }
      `}} />
    </div>
  );
};

export default Map;
