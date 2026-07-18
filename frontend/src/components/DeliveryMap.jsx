import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet default icon path issues in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customBikeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/754/754294.png', // A free bike icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function DeliveryMap({ partnerLocation, deliveryAddress }) {
  // Default to some coordinate if none provided, or center between partner and user
  const centerLat = partnerLocation?.lat || 19.0760;
  const centerLng = partnerLocation?.lng || 72.8777;

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm z-0 relative">
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={14} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={[centerLat, centerLng]} />
        
        {partnerLocation && (
          <Marker position={[partnerLocation.lat, partnerLocation.lng]} icon={customBikeIcon}>
            <Popup>Delivery Partner</Popup>
          </Marker>
        )}
        
        {/* We can optionally mock the user's location too if we have it in deliveryAddress */}
      </MapContainer>
    </div>
  );
}
