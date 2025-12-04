import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        quote: "Your donations have been a lifeline for my family. We are so grateful for the meals and support you've provided.",
        author: "Sarah",
        role: "Recipient",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
        id: 2,
        quote: "Volunteering with Feeding Hope has been an incredibly rewarding experience. I'm proud to be a part of this mission.",
        author: "Michael",
        role: "Volunteer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
        id: 3,
        quote: "I'm grateful to be able to support Feeding Hope's work. My monthly donation helps ensure families have access to meals.",
        author: "Emily",
        role: "Donor",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Voices of Our Community</h2>
                    <p className="text-lg text-gray-600">Hear from the people who make our mission possible.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 relative"
                        >
                            <Quote className="w-10 h-10 text-emerald-100 absolute top-8 right-8" />
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={item.image}
                                    alt={item.author}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.author}</h4>
                                    <p className="text-sm text-emerald-600 font-medium">{item.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic leading-relaxed">"{item.quote}"</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
