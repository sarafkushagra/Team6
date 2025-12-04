import React, { useState, useCallback } from 'react';
import { Upload, MapPin, Clock, Check, Plus, Minus, ToggleRight, AlertTriangle, Soup, Salad, Cake, Beef } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Helper Components ---

// 1. Quantity Stepper
const QuantityStepper = ({ mealCount, setMealCount }) => {
    const minMeals = 5;
    const maxMeals = 500;

    const increment = () => setMealCount(prev => Math.min(prev + 5, maxMeals));
    const decrement = () => setMealCount(prev => Math.max(prev - 5, minMeals));

    const totalWeight = (mealCount * 0.25).toFixed(1); // Assuming 0.25kg per meal (1kg = 4 meals)

    return (
        <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Meals</label>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white">
                <button
                    type="button"
                    onClick={decrement}
                    disabled={mealCount <= minMeals}
                    className="p-3 text-gray-700 disabled:opacity-50 transition-colors rounded-l-xl hover:bg-gray-50 focus:outline-none"
                >
                    <Minus size={20} />
                </button>
                <div className="flex flex-col items-center justify-center flex-grow py-1">
                    <span className="text-xl font-bold text-gray-900">{mealCount}</span>
                    <span className="text-xs text-emerald-600 font-medium">~{totalWeight}kg</span>
                </div>
                <button
                    type="button"
                    onClick={increment}
                    disabled={mealCount >= maxMeals}
                    className="p-3 text-gray-700 disabled:opacity-50 transition-colors rounded-r-xl hover:bg-gray-50 focus:outline-none"
                >
                    <Plus size={20} />
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum donation is {minMeals} meals.</p>
        </div>
    );
};

// 2. Storage Requirement Toggle
const StorageToggle = ({ storageRequirement, setStorageRequirement }) => {
    const isChilled = storageRequirement === 'Chilled/Hot Holding';
    const toggle = () => {
        setStorageRequirement(isChilled ? 'Ambient' : 'Chilled/Hot Holding');
    };

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Storage Requirement</label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">
                    {isChilled ? 'Chilled/Hot Holding' : 'Ambient'}
                </span>
                <button
                    type="button"
                    onClick={toggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        isChilled ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isChilled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
                {isChilled ? 'Requires insulated carriers for temperature maintenance.' : 'Safe at room temperature for short transport.'}
            </p>
        </div>
    );
};


// 3. Main Donor Dashboard Component
const DonorDashboard = () => {
    const [formData, setFormData] = useState({
        foodType: '',
        category: '',
        expiryTime: '2 hours',
        location: '123 Main St, Anytown, USA (Auto-Detected)', // Mock auto-detection
        donorName: 'My Restaurant',
        isSafe: false,
    });
    const [mealCount, setMealCount] = useState(20);
    const [storageRequirement, setStorageRequirement] = useState('Ambient');
    const [submitted, setSubmitted] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

    const commonCategories = [
        { label: 'Cooked Veg', icon: Soup, value: 'Cooked Veg' },
        { label: 'Cooked Non-Veg', icon: Beef, value: 'Cooked Non-Veg' },
        { label: 'Bakery Items', icon: Cake, value: 'Bakery Items' },
        { label: 'Raw Produce', icon: Salad, value: 'Raw Produce' },
    ];

    const expiryPresets = ['1 hour', '2 hours', '3 hours', 'Custom'];

    const handleCategorySelect = (category) => {
        setFormData(prev => ({ ...prev, category: category }));
    };

    const handleExpirySelect = (time) => {
        setFormData(prev => ({ ...prev, expiryTime: time }));
    };

    const handlePhotoUpload = (e) => {
        // In a real app, this handles file upload. Here, we mock the preview.
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLocationDetect = () => {
        // Mocking Geolocation API call for speed
        setFormData(prev => ({ ...prev, location: '123 Main St, Anytown, USA (GPS Verified)' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.isSafe) return; // Block submission if safety is not confirmed

        setIsPosting(true);

        const dataToSend = {
            ...formData,
            quantity: `${mealCount} meals`,
            storageRequirement: storageRequirement,
            timestamp: new Date().toISOString(),
            // Mock map URL, image URL, etc.
        };

        console.log('Posting Donation:', dataToSend);

        // Mock API call to satisfy the prototype requirement
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsPosting(false);
        setSubmitted(true);
        // Reset form after successful submission
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ foodType: '', category: '', expiryTime: '2 hours', location: '123 Main St, Anytown, USA (Auto-Detected)', donorName: 'My Restaurant', isSafe: false, });
            setMealCount(20);
            setStorageRequirement('Ambient');
            setPhotoPreview(null);
        }, 3000);
    };

    const isFormValid = formData.foodType && formData.category && mealCount > 0 && formData.location && formData.isSafe;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-['Inter']">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">Food Share</h1>
                    <p className="text-gray-500 mt-1">Quickly list surplus food to turn waste into warmth.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl"
                >
                    {submitted ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Donation Posted Successfully!</h3>
                            <p className="text-gray-500 mt-2">Volunteers nearby have been notified. An OTP will appear here once claimed.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Step 1: Food Details & Category */}
                            <section className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">1. Food Details</h2>

                                {/* Food Category Quick Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Category Select</label>
                                    <div className="flex flex-wrap gap-2">
                                        {commonCategories.map((cat) => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => handleCategorySelect(cat.value)}
                                                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                                    formData.category === cat.value
                                                        ? 'bg-emerald-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                <cat.icon size={16} />
                                                <span>{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {formData.category && <p className="text-xs text-emerald-600 mt-2">Selected: {formData.category}</p>}
                                </div>

                                {/* Detailed Food Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Specific Item Description</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 5L Chana Masala, 10 loaves of Whole Wheat Bread"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        value={formData.foodType}
                                        onChange={e => setFormData({ ...formData, foodType: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Quantity Stepper */}
                                <QuantityStepper mealCount={mealCount} setMealCount={setMealCount} />

                                {/* Storage Toggle */}
                                <StorageToggle storageRequirement={storageRequirement} setStorageRequirement={setStorageRequirement} />
                            </section>

                            {/* Step 2: Location & Time */}
                            <section className="space-y-4 pt-4">
                                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">2. Pickup Logistics</h2>

                                {/* Pickup Location - Auto-Detect */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location (for 1-Tap Speed)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter address or tap 'Detect'"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            required
                                        />
                                        <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <button
                                            type="button"
                                            onClick={handleLocationDetect}
                                            className="absolute right-2 top-2 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
                                        >
                                            Detect
                                        </button>
                                    </div>
                                </div>

                                {/* Map Preview Placeholder */}
                                <div className="rounded-xl overflow-hidden shadow-inner border border-gray-200 h-40 w-full">
                                    {/* Mock Map Preview */}
                                    <img
                                        src={`https://placehold.co/600x400/10B981/ffffff?text=PINNED+LOCATION\n${encodeURIComponent(formData.location.split('(')[0])}`}
                                        alt="Map Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>

                                {/* Best Before Time Presets */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Best Before (Priority Timer)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {expiryPresets.map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => handleExpirySelect(time)}
                                                className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                                                    formData.expiryTime === time
                                                        ? 'bg-red-500 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                <Clock size={16} />
                                                <span>{time}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Step 3: Photo & Safety */}
                            <section className="space-y-4 pt-4">
                                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">3. Verification & Safety</h2>

                                {/* Photo Upload with Preview */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Photo (Mandatory)</label>
                                    <label htmlFor="food-photo" className="block cursor-pointer">
                                        <input
                                            id="food-photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="sr-only"
                                            required
                                        />
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                                            {photoPreview ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={photoPreview} alt="Food Preview" className="h-24 w-24 object-cover rounded-lg mb-2 shadow-md" />
                                                    <p className="text-sm text-emerald-600 font-medium">Photo Uploaded. Click to change.</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                                    <p className="text-sm text-gray-500">Upload a clear photo of the prepared food.</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* Safety Disclaimer Check */}
                                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            checked={formData.isSafe}
                                            onChange={e => setFormData({ ...formData, isSafe: e.target.checked })}
                                            className="mt-1 mr-3 h-5 w-5 rounded text-red-600 border-red-300 focus:ring-red-500"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-red-800 flex items-center">
                                                <AlertTriangle size={16} className="mr-1 inline-block" /> Safety Confirmation (Required)
                                            </p>
                                            <p className="text-xs text-red-700 mt-0.5">
                                                I confirm this food was prepared and stored hygienically, is not expired, and is suitable for immediate consumption by others.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={!isFormValid || isPosting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                                    isFormValid
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isPosting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Requesting Pickup...
                                    </span>
                                ) : (
                                    'Post Donation & Request Pickup'
                                )}
                            </motion.button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default DonorDashboard;
