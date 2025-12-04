import React, { useEffect, useState } from 'react';
import { MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VolunteerFeed = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/donations')
            .then(res => res.json())
            .then(data => {
                setDonations(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch donations", err);
                setLoading(false);
            });
    }, []);

    const handleClaim = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/donations/${id}/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volunteerId: "Vol-123" })
            });
            if (res.ok) {
                navigate(`/pickup/${id}`);
            }
        } catch (error) {
            console.error("Error claiming donation", error);
        }
    };

    if (loading) return <div className="flex justify-center p-10">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Nearby Donations</h2>
                    <p className="text-gray-500 mt-1">Real-time feed of available food within 5km.</p>
                </div>
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {donations.filter(d => d.status === 'available').length} Available
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {donations.map((donation, index) => (
                    <DonationCard key={donation.id} donation={donation} onClaim={handleClaim} index={index} />
                ))}
            </div>
        </div>
    );
};

const DonationCard = ({ donation, onClaim, index }) => {
    const isAvailable = donation.status === 'available';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
        >
            <div className="h-48 overflow-hidden relative">
                <img src={donation.imageUrl} alt={donation.foodType} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {donation.quantity}
                </div>
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold">
                            {donation.status === 'claimed' ? 'CLAIMED' : 'DISTRIBUTED'}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{donation.foodType}</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date(donation.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">from {donation.donorName}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {donation.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={16} />
                        Expiring soon
                    </div>
                </div>

                {isAvailable ? (
                    <button
                        onClick={() => onClaim(donation.id)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        Claim Donation <ArrowRight size={18} />
                    </button>
                ) : (
                    <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                        <CheckCircle size={18} /> {donation.status.toUpperCase()}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default VolunteerFeed;
