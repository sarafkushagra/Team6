import React, { useState, useEffect } from 'react';
import { Radar, MapPin, Navigation } from 'lucide-react';

const DonationRadar = () => {
  const [detectedItems, setDetectedItems] = useState([]);
  const [isScanning, setIsScanning] = useState(true);

  // Simulate finding items
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setDetectedItems(prev => [...prev, { id: 1, name: "5kg Rice", dist: "0.8km", azim: "North-East" }]);
    }, 2000);
    const timer2 = setTimeout(() => {
      setDetectedItems(prev => [...prev, { id: 2, name: "10 Pizzas", dist: "1.2km", azim: "South" }]);
    }, 4500);

    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="z-10 text-center mb-8">
        <h2 className="text-2xl font-mono font-bold text-indigo-400 tracking-widest uppercase flex items-center justify-center">
          <Radar className="mr-3 animate-pulse" /> Live Donation Radar
        </h2>
        <p className="text-gray-400 text-sm mt-2">Scanning 5km radius for surplus food...</p>
      </div>

      {/* The Radar UI */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-4 border-indigo-900 flex items-center justify-center bg-gray-800/50 shadow-[0_0_50px_rgba(79,70,229,0.3)]">
        
        {/* Scanning Line */}
        <div className="absolute w-full h-full rounded-full animate-spin-slow overflow-hidden pointer-events-none">
           <div className="w-1/2 h-1/2 bg-gradient-to-br from-indigo-500/0 to-indigo-500/40 origin-bottom-right absolute top-0 left-0"></div>
        </div>

        {/* Concentric Circles */}
        <div className="absolute w-2/3 h-2/3 border border-indigo-800/50 rounded-full"></div>
        <div className="absolute w-1/3 h-1/3 border border-indigo-800/50 rounded-full"></div>
        
        {/* Center Dot */}
        <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1] z-20"></div>

        {/* Detected Blips */}
        {detectedItems.map((item, idx) => (
          <div key={item.id} 
               className="absolute w-3 h-3 bg-green-400 rounded-full animate-ping"
               style={{ top: idx === 0 ? '20%' : '70%', left: idx === 0 ? '70%' : '20%' }}
          ></div>
        ))}
        {detectedItems.map((item, idx) => (
          <div key={`static-${item.id}`} 
               className="absolute w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:scale-150 transition"
               style={{ top: idx === 0 ? '20%' : '70%', left: idx === 0 ? '70%' : '20%' }}
          >
             <div className="absolute top-4 left-4 w-32 bg-gray-800 border border-gray-700 p-2 rounded text-xs z-50 pointer-events-none">
               <p className="font-bold text-green-400">{item.name}</p>
               <p>{item.dist}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Detected List */}
      <div className="mt-8 w-full max-w-md space-y-3 z-10">
        {detectedItems.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-800 border border-gray-700 p-3 rounded-lg hover:bg-gray-750 transition animate-fade-in-up">
            <div className="flex items-center">
              <MapPin className="text-green-500 mr-3" size={18} />
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-xs text-gray-400">{item.dist} away • {item.azim}</p>
              </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full">
              <Navigation size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationRadar;