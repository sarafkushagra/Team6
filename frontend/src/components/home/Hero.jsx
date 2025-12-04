import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-emerald-100/30 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-orange-100/30 blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm tracking-wide"
                    >
                        HYPER-LOCAL FOOD LOGISTICS
                    </motion.span>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 leading-tight">
                        Feeding Hope, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            One Meal at a Time
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Bridge the gap between surplus and hunger. Connect food donors with local volunteers in real-time.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    >
                        <Link
                            to="/donate"
                            className="group relative px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-1"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Donate Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>
                        <Link
                            to="/volunteer"
                            className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg border-2 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all hover:-translate-y-1"
                        >
                            Join as Volunteer
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
