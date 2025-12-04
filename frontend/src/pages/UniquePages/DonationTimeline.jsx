import React from 'react';
import { Check, Truck, User, MapPin, Clock } from 'lucide-react';

const DonationTimeline = () => {
  const events = [
    { time: "14:30", title: "Donation Posted", desc: "Spicy Pot posted 10kg Biryani", active: true, icon: User },
    { time: "14:35", title: "Quality Check Passed", desc: "AI verified food image freshness", active: true, icon: Check },
    { time: "14:42", title: "Volunteer Assigned", desc: "Rahul accepted the pickup", active: true, icon: Truck },
    { time: "15:10", title: "Picked Up", desc: "OTP 4492 verified at restaurant", active: true, icon: MapPin },
    { time: "15:45", title: "Delivered", desc: "Handed over to Shelter Manager", active: false, icon: User },
  ];

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-6 flex items-center">
        <Clock className="mr-2 text-indigo-600" size={20} />
        Live Tracking: #DON-8821
      </h3>
      
      <div className="relative pl-4 border-l-2 border-indigo-100 space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative">
            {/* Timeline Dot */}
            <div className={`absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-white shadow-sm ${event.active ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            
            <div className={`transition-all duration-500 ${event.active ? 'opacity-100' : 'opacity-50 blur-[0.5px]'}`}>
              <div className="flex items-center mb-1">
                <span className="text-xs font-mono text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded mr-2">{event.time}</span>
                <h4 className="font-bold text-gray-800 text-sm">{event.title}</h4>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                {event.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200">
        View Proof of Delivery
      </button>
    </div>
  );
};

export default DonationTimeline;