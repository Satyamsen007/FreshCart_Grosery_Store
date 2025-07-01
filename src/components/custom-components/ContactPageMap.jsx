'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Dynamically import Leaflet and its CSS
const ContactPageMap = ({ position }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import Leaflet CSS
    import('leaflet/dist/leaflet.css');
    
    // Fix default icon paths for Leaflet markers
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  if (!isClient) {
    return <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>;
  }
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="text-center">
            <h2 className="text-sm text-[var(--textColor)] font-semibold dark:text-gray-200">FreshCart Grosery Store</h2>
            <img
              src="/assets/ourStoreImage.png"
              alt="Office Location"
              className="w-full h-20 object-contain mt-2 rounded dark:brightness-90"
            />
            <p className="text-xs font-semibold text-[var(--textColor)] dark:text-gray-300">Visit us for fresh groceries daily!</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default ContactPageMap;