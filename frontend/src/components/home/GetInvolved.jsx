import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Truck, HeartHandshake, ArrowRight } from 'lucide-react';

const actions = [
    {
        id: 1,
        title: "Monetary Donations",
        description: "Make a one-time or recurring donation to support our programs.",
        icon: Gift,
        color: "bg-emerald-600",
        link: "/donate",
        btn: "Donate Now"
    },
    {
        id: 2,
        title: "Food Drives",
        description: "Organize a food drive in your community to collect non-perishable items.",
        icon: Truck,
        color: "bg-orange-500",
        link: "/food-drives",
        btn: "Start a Drive"
    },
    {
        id: 3,
        title: "Volunteer",
        description: "Join our team and help with food distribution and events.",
        icon: HeartHandshake,
        color: "bg-blue-500",
        link: "/volunteer",
        btn: "Join Us"
    }
];

const GetInvolved = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Involved Today</h2>
                    <p className="text-lg text-gray-600">Choose how you want to make an impact.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {actions.map((action, index) => (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                        >
                            <div className={`${action.color} p-10 flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <action.icon className="w-16 h-16 text-white transform group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            <div className="p-8 bg-white flex-grow flex flex-col border-x border-b border-gray-100 rounded-b-3xl">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{action.title}</h3>
                                <p className="text-gray-600 mb-8 flex-grow">{action.description}</p>

                                <Link
                                    to={action.link}
                                    className={`inline-flex items-center font-bold ${action.color.replace('bg-', 'text-')} group-hover:gap-3 transition-all`}
                                >
                                    {action.btn} <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GetInvolved;
