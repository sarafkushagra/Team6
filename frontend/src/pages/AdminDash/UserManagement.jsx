import React, { useState } from 'react';
import { Users, AlertTriangle, Ban, Check, MoreVertical, Star, Shield } from 'lucide-react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'complaints'

  // Mock Users Data
  const [users] = useState([
    { id: 1, name: "Spicy Pot Restaurant", role: "Donor", trustScore: 95, status: "Active", joined: "Oct 2025" },
    { id: 2, name: "Rahul Verma", role: "Volunteer", trustScore: 88, status: "Active", joined: "Nov 2025" },
    { id: 3, name: "City Caterers", role: "Donor", trustScore: 40, status: "Suspended", joined: "Sept 2025" },
  ]);

  // Mock Complaints/Issues Data
  const [complaints, setComplaints] = useState([
    { id: 101, reportedBy: "NGO Hope", reportedUser: "City Caterers", issue: "Spoiled Food Detected", severity: "High", date: "2025-12-01", status: "Pending" },
    { id: 102, reportedBy: "Volunteer Priya", reportedUser: "Bistro 55", issue: "Donor No-Show", severity: "Medium", date: "2025-12-03", status: "Resolved" },
  ]);

  const handleBan = (id) => {
    alert(`User ${id} has been banned.`); // Replace with API call
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Community Management</h1>
        <div className="bg-white rounded-lg shadow-sm p-1 flex">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            User Database
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'complaints' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <AlertTriangle size={14} className="mr-2" />
            Risk Alerts ({complaints.filter(c => c.status === 'Pending').length})
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{user.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'Donor' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 flex items-center">
                    <Star size={14} className="text-yellow-400 mr-1 fill-current" />
                    {user.trustScore}/100
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center text-sm ${user.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                      {user.status === 'Active' ? <Check size={14} className="mr-1" /> : <Ban size={14} className="mr-1" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-indigo-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-gray-200" style={{ borderLeftColor: complaint.severity === 'High' ? '#ef4444' : '#f59e0b' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center">
                    {complaint.issue}
                    {complaint.severity === 'High' && <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">High Priority</span>}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Reported by <span className="font-medium text-indigo-600">{complaint.reportedBy}</span> against {complaint.reportedUser}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{complaint.date}</p>
                </div>
                {complaint.status === 'Pending' ? (
                  <div className="flex space-x-2">
                    <button onClick={() => handleBan(complaint.reportedUser)} className="px-3 py-1 bg-white border border-red-200 text-red-600 text-sm rounded hover:bg-red-50">Ban User</button>
                    <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Investigate</button>
                  </div>
                ) : (
                  <span className="text-green-600 text-sm font-bold flex items-center"><Check size={16} className="mr-1"/> Resolved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;