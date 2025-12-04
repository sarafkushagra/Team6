import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
