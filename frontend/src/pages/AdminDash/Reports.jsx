import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Leaf, Utensils, TrendingUp } from 'lucide-react';

const Reports = () => {
  // Mock Data: Impact over last 6 months
  const impactData = [
    { name: 'Jul', meals: 400, co2: 200 },
    { name: 'Aug', meals: 600, co2: 350 },
    { name: 'Sep', meals: 850, co2: 500 },
    { name: 'Oct', meals: 1200, co2: 800 },
    { name: 'Nov', meals: 1500, co2: 950 },
    { name: 'Dec', meals: 2100, co2: 1300 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <TrendingUp className="mr-2 text-indigo-600" /> Impact Analytics
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="opacity-80 text-sm mb-1">Environmental Impact</p>
              <h2 className="text-4xl font-bold">4,100 kg</h2>
              <p className="mt-2 text-sm opacity-90">CO2 Emissions Prevented</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Leaf size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 rounded-xl text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="opacity-80 text-sm mb-1">Social Impact</p>
              <h2 className="text-4xl font-bold">6,650</h2>
              <p className="mt-2 text-sm opacity-90">Total Meals Served</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Utensils size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Growth of Donations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Meals Saved Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={impactData}>
                <defs>
                  <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="meals" stroke="#f97316" fillOpacity={1} fill="url(#colorMeals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: CO2 Offset */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">CO2 Reduction (kg)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="co2" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;