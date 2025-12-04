import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Users, HandHeart } from 'lucide-react';

const stats = [
    {
        id: 1,
        number: "1M+",
        label: "Meals Served",
        icon: Utensils,
        color: "text-orange-500",
        bg: "bg-orange-50"
    },
    {
        id: 2,
        number: "10k+",
        label: "Active Volunteers",
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-50"
    },
    {
        id: 3,
        number: "500+",
        label: "Partnerships",
        icon: HandHeart,
        color: "text-blue-500",
        bg: "bg-blue-50"
    }
];

const Impact = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-4xl font-bold text-gray-900">Making a Real Difference</h2>
                    <p className="text-lg text-gray-600">
                        Every donation and volunteer hour translates directly into meals for those in need.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            <h3 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">
                                {stat.number}
                            </h3>
                            <p className="text-gray-500 font-medium text-lg">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Impact;
