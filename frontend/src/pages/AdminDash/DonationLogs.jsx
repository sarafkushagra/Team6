import React, { useState } from 'react';
import { FileText, Download, Eye, ExternalLink, Filter } from 'lucide-react';

const DonationLogs = () => {
  const [selectedProof, setSelectedProof] = useState(null);

  // Mock Logs
  const logs = [
    { id: "TXN-8892", date: "2025-12-04 10:30 AM", donor: "Bistro Cafe", volunteer: "Rahul K.", recipient: "City Orphanage", food: "20kg Rice", status: "Verified", hash: "0x8f...3a1", proofImg: "https://via.placeholder.com/400x300?text=Food+Delivery+Proof" },
    { id: "TXN-8891", date: "2025-12-04 09:15 AM", donor: "Wedding Hall B", volunteer: "Priya S.", recipient: "Shelter Home", food: "15kg Curry", status: "Verified", hash: "0x2c...9b2", proofImg: "https://via.placeholder.com/400x300?text=Shelter+Handover" },
    { id: "TXN-8890", date: "2025-12-03 08:45 PM", donor: "Pizza Hut CP", volunteer: "Amit M.", recipient: "Night Shelter", food: "10 Pizzas", status: "Flagged", hash: "0x1d...4c4", proofImg: null },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Audit Logs</h1>
          <p className="text-gray-500 text-sm">Immutable record of all food transfers</p>
        </div>
        <button className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          <Filter size={16} />
          <span>Filter Logs</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Transaction ID</th>
              <th className="p-4 font-semibold text-gray-600">Timestamp</th>
              <th className="p-4 font-semibold text-gray-600">Route</th>
              <th className="p-4 font-semibold text-gray-600">Details</th>
              <th className="p-4 font-semibold text-gray-600">Proof</th>
              <th className="p-4 font-semibold text-gray-600">Audit Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-indigo-600 font-medium">{log.id}</td>
                <td className="p-4 text-gray-600">{log.date}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{log.donor}</span>
                    <span className="text-xs text-gray-400">↓ via {log.volunteer}</span>
                    <span className="font-medium text-gray-800">{log.recipient}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{log.food}</td>
                <td className="p-4">
                  {log.proofImg ? (
                    <button 
                      onClick={() => setSelectedProof(log)}
                      className="flex items-center text-indigo-600 hover:underline"
                    >
                      <Eye size={14} className="mr-1" /> View Image
                    </button>
                  ) : (
                    <span className="text-red-400 text-xs italic">Missing</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-500 w-fit">
                    {log.hash}
                    <ExternalLink size={10} className="ml-2" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Proof of Delivery</h3>
              <button onClick={() => setSelectedProof(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-4">
              <img src={selectedProof.proofImg} alt="Proof" className="w-full rounded-lg mb-4 bg-gray-100" />
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center">
                 <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                 Verified by Location & Time Match
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationLogs;