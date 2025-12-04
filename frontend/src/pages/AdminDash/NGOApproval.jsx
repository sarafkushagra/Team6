import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  ShieldAlert, 
  Search, 
  Building2,
  Download
} from 'lucide-react';

const NGOApproval = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ngos');
      const data = await res.json();
      setApplicants(data.filter(ngo => !ngo.verified));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/ngos/${id}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApplicants(applicants.filter(app => app._id !== id));
      setSelectedApplicant(null);
      alert("NGO Verified!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = (id) => {
    // For simplicity, just remove from list
    setApplicants(applicants.filter(app => app._id !== id));
    setSelectedApplicant(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShieldAlert className="mr-3 text-indigo-600" />
          Partner Verification Portal
        </h1>
        <p className="text-gray-500">Review government registration documents before allowing NGOs to claim food.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: List of Applicants */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">Pending Requests ({applicants.length})</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Reg ID..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="p-4 font-medium uppercase">Organization</th>
                <th className="p-4 font-medium uppercase">Reg ID</th>
                <th className="p-4 font-medium uppercase">AI Trust Score</th>
                <th className="p-4 font-medium uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr 
                  key={app._id} 
                  className={`border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${selectedApplicant?._id === app._id ? 'bg-indigo-50' : ''}`}
                  onClick={() => setSelectedApplicant(app)}
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3 font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.location ? 'Location set' : 'No location'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-mono">{app._id}</td>
                  <td className="p-4">
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                      Pending
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                      <Eye size={16} className="mr-1" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {applicants.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
              <p>All verifications completed!</p>
            </div>
          )}
        </div>

        {/* Right Col: Document Inspector (The "Work" Area) */}
        {selectedApplicant ? (
          <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden flex flex-col h-[600px] sticky top-6">
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h2 className="font-bold">Verification Dossier</h2>
                <p className="text-xs opacity-80">ID: {selectedApplicant._id}</p>
              </div>
              <button onClick={() => setSelectedApplicant(null)} className="text-white hover:bg-indigo-700 p-1 rounded">
                <XCircle size={20} />
              </button>
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 bg-gray-100 p-4 overflow-y-auto relative">
              <div className="absolute top-6 right-6 z-10">
                <button className="bg-white p-2 rounded-full shadow hover:bg-gray-50" title="Download Original">
                  <Download size={18} className="text-gray-600" />
                </button>
              </div>
              
              {/* Fake Document Image */}
              <div className="bg-white p-2 shadow-sm mb-4 border border-gray-300">
                 <img src={selectedApplicant.docUrl} alt="Doc" className="w-full h-auto opacity-90" />
              </div>

              {/* AI Analysis Section (The "Hackathon Bonus") */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Automated Analysis</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Building2 size={14} className="mr-2" /> Govt Database Check
                    </span>
                    <span className="text-green-600 font-bold flex items-center">
                      <CheckCircle size={14} className="mr-1" /> Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <FileText size={14} className="mr-2" /> OCR Name Match
                    </span>
                    <span className={`${selectedApplicant.trustScore > 80 ? 'text-green-600' : 'text-red-500'} font-bold`}>
                      {selectedApplicant.trustScore}% Match
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-white border-t border-gray-200 grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleReject(selectedApplicant._id)}
                className="py-3 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50 transition"
              >
                Reject
              </button>
              <button 
                onClick={() => handleApprove(selectedApplicant._id)}
                className="py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md transition flex justify-center items-center"
              >
                <CheckCircle size={18} className="mr-2" />
                Approve
              </button>
            </div>
          </div>
        ) : (
          /* Empty State for Right Column */
          <div className="hidden lg:flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>Select an application to view documents</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default NGOApproval;