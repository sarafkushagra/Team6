import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, ShieldCheck, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const PickupScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [donation, setDonation] = useState(null);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        // Mock donation data
        const mockDonation = {
            foodType: 'Rice and Curry',
            quantity: '5 meals',
            donorName: 'John Doe',
            address: '123 Main St',
            phone: '123-456-7890'
        };
        setDonation(mockDonation);
    }, [id]);

    const handleVerify = async () => {
        // Mock verification
        if (otp === '1234') {
            setVerified(true);
            setTimeout(() => navigate('/distribution'), 3000);
        } else {
            alert("Invalid OTP");
        }
    };

    if (verified) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                >
                    <ShieldCheck size={48} />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Pickup Verified!</h2>
                <p className="text-gray-500">Thank you for helping save food today.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative">
                {/* Mock Map */}
                <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60"
                    alt="Map"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-900">Tasty Bites Restaurant</h3>
                        <p className="text-sm text-gray-500">Connaught Place, Delhi</p>
                    </div>
                    <button className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700">
                        <Navigation size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200">
                    <Phone size={18} /> Call Donor
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200">
                    <MessageSquare size={18} /> Message
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Verify Pickup</h3>
                <p className="text-sm text-gray-500 mb-6">Ask the donor for the 4-digit OTP to confirm handover.</p>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full text-center text-2xl tracking-widest py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        maxLength={4}
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                    />
                    <button
                        onClick={handleVerify}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-emerald-200"
                    >
                        Verify & Complete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PickupScreen;
