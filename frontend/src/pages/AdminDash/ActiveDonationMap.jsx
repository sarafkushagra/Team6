import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Package, Clock, ShieldCheck, MapPin } from 'lucide-react';

// --- Custom Marker Icons (CSS-based for Hackathon speed) ---
// We use L.divIcon to render HTML/Tailwind classes as markers instead of loading images
const createIcon = (type) => {
  const color = type === 'donor' ? 'bg-orange-500' : 'bg-indigo-600';
  const iconHtml = `<div class="${color} w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                      ${type === 'donor' ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' : 
                         '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>'}
                    </div>`;
  
  return new L.DivIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon', // Remove default leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });
};

const ActiveDonationsMap = () => {
  // Mock Data: Centered around Connaught Place, New Delhi for demo
  const initialCenter = [28.6290, 77.2150]; // Example Coords

  const [donors] = useState([
    { id: 1, name: "Spicy Pot Restaurant", type: "donor", lat: 28.6310, lng: 77.2170, food: "5kg Biryani", expiry: "2h 30m", status: "Active" },
    { id: 2, name: "City Bakery", type: "donor", lat: 28.6250, lng: 77.2100, food: "20 Loaves Bread", expiry: "5h 00m", status: "Assigned" },
    { id: 3, name: "Wedding Hall A", type: "donor", lat: 28.6350, lng: 77.2200, food: "15kg Mixed Curry", expiry: "1h 15m", status: "Active" },
  ]);

  const [volunteers] = useState([
    { id: 101, name: "Rahul K.", type: "volunteer", lat: 28.6280, lng: 77.2160, movingTo: 2 }, // Moving to Donor 2
    { id: 102, name: "Priya S.", type: "volunteer", lat: 28.6330, lng: 77.2220, movingTo: null }, // Idle
  ]);

  // Determine active route (Visualizing the "Match")
  const activeRoute = [
    [28.6280, 77.2160], // Volunteer Rahul
    [28.6250, 77.2100]  // Donor City Bakery
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* Map Header */}
      <div className="bg-white px-6 py-4 shadow-sm z-10 flex justify-between items-center border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <MapPin className="mr-2 text-indigo-600" size={20} />
            Live Logistics View
          </h2>
          <p className="text-sm text-gray-500">Real-time matching of Donors (Orange) and Volunteers (Indigo)</p>
        </div>
        
        {/* Legend */}
        <div className="flex space-x-4 text-sm bg-gray-100 px-4 py-2 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span>Donations (Pending)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
            <span>Volunteers (Online)</span>
          </div>
        </div>
      </div>

      {/* The Map */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={initialCenter} 
          zoom={14} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false} // Clean look
        >
          {/* Darker/Professional Tile Layer (CartoDB Voyager) - looks great for logistics */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Render Donors */}
          {donors.map((donor) => (
            <Marker 
              key={donor.id} 
              position={[donor.lat, donor.lng]} 
              icon={createIcon('donor')}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{donor.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${donor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {donor.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <Package size={14} className="mr-2" />
                    {donor.food}
                  </div>
                  <div className="flex items-center text-red-500 text-sm font-medium mb-3">
                    <Clock size={14} className="mr-2" />
                    Expires in {donor.expiry}
                  </div>
                  {donor.status === 'Active' && (
                    <button className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded hover:bg-indigo-700 transition">
                      Find Nearest Volunteer
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Volunteers */}
          {volunteers.map((vol) => (
            <Marker 
              key={vol.id} 
              position={[vol.lat, vol.lng]} 
              icon={createIcon('volunteer')}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    {vol.name} <ShieldCheck size={14} className="text-green-500 ml-1" />
                  </h3>
                  <p className="text-xs text-gray-500">Status: {vol.movingTo ? 'En Route' : 'Idle'}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Route Line (Visualizing Logistics) */}
          <Polyline 
            positions={activeRoute} 
            pathOptions={{ color: '#4f46e5', weight: 4, dashArray: '10, 10', opacity: 0.6 }} 
          />

        </MapContainer>

        {/* Floating "System Status" Overlay */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-64 z-[400]">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Algorithm Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Geo-Fencing</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Matching Speed</span>
              <span className="text-sm font-bold text-gray-800">~120ms</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActiveDonationsMap;