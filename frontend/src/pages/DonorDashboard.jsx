import React, { useState } from 'react';
import { Upload, MapPin, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const DonorDashboard = () => {
    const [formData, setFormData] = useState({
        foodType: '',
        quantity: '',
        expiryTime: '',
        location: '',
        donorName: 'My Restaurant'
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // In real app, upload image here
        const data = {
            ...formData,
            expiryTime: new Date(Date.now() + 3600000 * 2).toISOString(), // Mock 2 hours
        };

        try {
            const res = await fetch('http://localhost:5000/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
                setFormData({ foodType: '', quantity: '', expiryTime: '', location: '', donorName: 'My Restaurant' });
            }
        } catch (error) {
            console.error("Error posting donation", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Donate Food</h2>
                <p className="text-gray-500">Share your surplus food with those in need.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
                {submitted ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Donation Posted!</h3>
                        <p className="text-gray-500">Volunteers nearby have been notified.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                            <input
                                type="text"
                                placeholder="e.g. Mixed Veg Curry & Rice"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                value={formData.foodType}
                                onChange={e => setFormData({ ...formData, foodType: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 5kg or 20 meals"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Best Before</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="2 hours"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        value={formData.expiryTime}
                                        onChange={e => setFormData({ ...formData, expiryTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Enter address"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-500">Click to upload photo</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors"
                        >
                            Post Donation
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default DonorDashboard;
