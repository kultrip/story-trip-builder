import React from 'react';

interface Location {
  lat: number;
  lng: number;
  name?: string;
}

interface MapProps {
  locations: Location[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
}

const Map: React.FC<MapProps> = ({ locations, zoom = 13, interactive = true, className = "" }) => {
  return (
    <div className={`bg-gray-200 ${className}`}>
      <div className="flex items-center justify-center h-full text-gray-500">
        Map Placeholder ({locations.length} locations)
      </div>
    </div>
  );
};

export default Map;
