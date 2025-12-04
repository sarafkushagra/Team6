import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Map, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  Heart, 
  AlertTriangle 
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock Data (In a real app, fetch this from your Node/Firebase backend)
  const [stats, setStats] = useState({
    mealsSaved: 1250, // Impact Logic: 1kg approx 4 meals
    donationsToday: 34,
    activeDonations: 8,
    completedDonations: 26,
    volunteersOnline: 12,
  });

  // Mock "Live" Feed for visual appeal to judges
  const recentActivity = [
    { id: 1, text: "Bistro Cafe posted a donation (5kg Rice)", time: "2 mins ago", type: "new" },
    { id: 2, text: "Volunteer Rahul picked up from Spicy Pot", time: "10 mins ago", type: "pickup" },
    { id: 3, text: "City Orphanage received delivery", time: "15 mins ago", type: "complete" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Top Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Impact Overview</h1>
          <p className="text-gray-500">Real-time logistics and impact monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600">System Live</span>
          </div>
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </header>

      {/* KPI Cards (Key Performance Indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total Meals Saved (The "Hero" Metric) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Meals Saved</p>
              <h2 className="text-4xl font-extrabold text-indigo-600 mt-2">{stats.mealsSaved}</h2>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Heart size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Based on 1kg = 4 meals calculation</p>
        </div>

        {/* Card 2: Donations Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Donations Today</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">{stats.donationsToday}</h2>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Package size={24} />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-4 flex items-center">
            <span className="font-bold mr-1">↑ 12%</span> vs yesterday
          </p>
        </div>

        {/* Card 3: Active vs Completed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Status</p>
              <div className="flex items-end mt-2 space-x-2">
                <h2 className="text-3xl font-bold text-orange-500">{stats.activeDonations}</h2>
                <span className="text-gray-400 text-sm mb-1">Active</span>
                <span className="text-gray-300 mb-1">/</span>
                <h2 className="text-3xl font-bold text-green-600">{stats.completedDonations}</h2>
                <span className="text-gray-400 text-sm mb-1">Done</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
              <Clock size={24} />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
            <div 
              className="bg-green-500 h-1.5 rounded-full" 
              style={{ width: `${(stats.completedDonations / (stats.activeDonations + stats.completedDonations)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card 4: Volunteers Online */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Volunteers Online</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">{stats.volunteersOnline}</h2>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <Users size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Within 5km of active donations</p>
        </div>
      </div>

      {/* Main Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Navigation Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center p-8 bg-white border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group cursor-pointer">
            <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Map size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Live Logistics Map</h3>
            <p className="text-sm text-gray-500 text-center mt-2">View real-time donor locations, volunteer routes, and traffic status.</p>
          </button>

          <button className="flex flex-col items-center justify-center p-8 bg-white border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group cursor-pointer">
            <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Impact Analytics</h3>
            <p className="text-sm text-gray-500 text-center mt-2">Download reports for NGOs, track food waste reduction data.</p>
          </button>
        </div>

        {/* Right Col: Live Activity Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle size={18} className="text-orange-500 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`mt-1 h-2 w-2 rounded-full mr-3 ${
                  activity.type === 'new' ? 'bg-blue-500' : 
                  activity.type === 'pickup' ? 'bg-orange-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-indigo-600 font-medium hover:underline">
            View All Logs
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;