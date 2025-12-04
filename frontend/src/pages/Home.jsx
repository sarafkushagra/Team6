import React from 'react';
import Hero from '../components/home/Hero';
import Impact from '../components/home/Impact';
import Testimonials from '../components/home/Testimonials';
import GetInvolved from '../components/home/GetInvolved';

const Home = () => {
    return (
        <div className="flex flex-col w-full">
            {/* The big welcome section at the top */}
            <Hero />

            {/* Showing off our numbers so people know we're legit */}
            <Impact />

            {/* Nice things people have said about us */}
            <Testimonials />

            {/* How people can actually help out */}
            <GetInvolved />
        </div>
    );
};

export default Home;
