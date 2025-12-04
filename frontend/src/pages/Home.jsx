import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, HeartHandshake, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
            <div className="text-center space-y-4 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                        Hyper-local Food Logistics
                    </span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl"
                >
                    Bridge the gap between <span className="text-emerald-600">surplus</span> and <span className="text-emerald-600">hunger</span>.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-500"
                >
                    Connect food donors with local volunteers in real-time. Speed is key.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
                <RoleCard
                    to="/donor"
                    icon={<Utensils size={32} />}
                    title="I am a Donor"
                    description="Restaurant, Caterer, or Individual with surplus food."
                    color="bg-orange-50 hover:bg-orange-100"
                    iconColor="text-orange-600"
                    delay={0.3}
                />
                <RoleCard
                    to="/volunteer"
                    icon={<HeartHandshake size={32} />}
                    title="I am a Volunteer"
                    description="NGO, Volunteer, or Driver ready to pickup and distribute."
                    color="bg-emerald-50 hover:bg-emerald-100"
                    iconColor="text-emerald-600"
                    delay={0.4}
                />
            </div>
        </div>
    );
};

const RoleCard = ({ to, icon, title, description, color, iconColor, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
    >
        <Link to={to} className={`block p-8 rounded-2xl border border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${color} group`}>
            <div className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm mb-6 ${iconColor}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <div className="flex items-center font-semibold text-gray-900 group-hover:gap-2 transition-all">
                Get Started <ArrowRight size={18} className="ml-2" />
            </div>
        </Link>
    </motion.div>
);

export default Home;
