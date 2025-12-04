import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, HeartHandshake, ArrowRight, Users, HandHeart, Gift, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative bg-emerald-50 py-20 lg:py-32 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
                        >
                            Feeding Hope, <span className="text-emerald-600">One Meal at a Time</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl text-gray-600"
                        >
                            Join us in our mission to fight hunger and provide nutritious meals to those in need.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="pt-4"
                        >
                            <Link to="/donate" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl">
                                Donate Now
                            </Link>
                        </motion.div>
                    </div>
                </div>
                {/* Decorative background elements could go here */}
            </section>

            {/* Impact Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Making a Difference, One Meal at a Time</h2>
                        <p className="text-lg text-gray-600">See how your donations have helped us provide meals and support to those in need.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <ImpactStat
                            number="1 Million+"
                            label="Meals Served to Families in Need"
                            icon={<Utensils className="w-12 h-12 text-emerald-500 mx-auto mb-4" />}
                            delay={0.1}
                        />
                        <ImpactStat
                            number="10,000+"
                            label="Volunteers Engaged in Our Programs"
                            icon={<Users className="w-12 h-12 text-emerald-500 mx-auto mb-4" />}
                            delay={0.2}
                        />
                        <ImpactStat
                            number="500+"
                            label="Community Partnerships Established"
                            icon={<HandHeart className="w-12 h-12 text-emerald-500 mx-auto mb-4" />}
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="Your donations have been a lifeline for my family. We are so grateful for the meals and support you've provided."
                            author="Sarah"
                            role="Recipient of Food Assistance"
                            title="Providing Hope and Nourishment"
                            delay={0.1}
                        />
                        <TestimonialCard
                            quote="Volunteering with Feeding Hope has been an incredibly rewarding experience. I'm proud to be a part of this organization's mission."
                            author="Michael"
                            role="Volunteer"
                            title="Empowering Our Community"
                            delay={0.2}
                        />
                        <TestimonialCard
                            quote="I'm grateful to be able to support Feeding Hope's work. My monthly donation helps ensure families in our community have access to nutritious meals."
                            author="Emily"
                            role="Donor"
                            title="Transforming Lives Through Generosity"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Get Involved Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ways to Support Our Mission</h2>
                        <p className="text-lg text-gray-600">There are many ways you can make a difference and help us fight hunger in our community.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ActionCard
                            title="Monetary Donations"
                            description="Make a one-time or recurring donation to support our programs and operations."
                            buttonText="Donate Now"
                            to="/donate"
                            icon={<Gift className="w-10 h-10 text-white" />}
                            color="bg-emerald-600"
                            delay={0.1}
                        />
                        <ActionCard
                            title="Food Drives"
                            description="Organize a food drive in your community to collect non-perishable items for our food pantry."
                            buttonText="Learn More"
                            to="/food-drives"
                            icon={<Truck className="w-10 h-10 text-white" />}
                            color="bg-orange-500"
                            delay={0.2}
                        />
                        <ActionCard
                            title="Volunteer Opportunities"
                            description="Join our team of volunteers and help us with food distribution, event planning, and more."
                            buttonText="Sign Up"
                            to="/volunteer"
                            icon={<HeartHandshake className="w-10 h-10 text-white" />}
                            color="bg-blue-500"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const ImpactStat = ({ number, label, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
    >
        {icon}
        <h3 className="text-4xl font-bold text-gray-900 mb-2">{number}</h3>
        <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
);

const TestimonialCard = ({ quote, author, role, title, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col h-full"
    >
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 italic mb-6 flex-grow">"{quote}"</p>
        <div className="mt-auto">
            <p className="font-bold text-gray-900">- {author}</p>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
    </motion.div>
);

const ActionCard = ({ title, description, buttonText, to, icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow"
    >
        <div className={`${color} p-8 flex justify-center items-center`}>
            {icon}
        </div>
        <div className="bg-white p-8 flex flex-col flex-grow border-x border-b border-gray-100 rounded-b-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 flex-grow">{description}</p>
            <Link to={to} className={`inline-flex items-center font-semibold ${color.replace('bg-', 'text-')} group-hover:gap-2 transition-all`}>
                {buttonText} <ArrowRight size={18} className="ml-2" />
            </Link>
        </div>
    </motion.div>
);

export default Home;
