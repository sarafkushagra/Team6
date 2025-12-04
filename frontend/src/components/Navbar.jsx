import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MapPin, User, Menu } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-green-500 to-emerald-600 p-2 rounded-lg text-white">
                            <Heart size={20} fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            FoodLink
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/" active={isActive('/')}>Home</NavLink>
                        <NavLink to="/volunteer" active={isActive('/volunteer')}>Volunteer</NavLink>
                        <NavLink to="/map" active={isActive('/map')}>Map</NavLink>
                        <NavLink to="/donor" active={isActive('/donor')}>Donate</NavLink>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/login">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                            <User size={20} />
                        </button>
                            </Link>
                        <button className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`text-sm font-medium transition-colors ${active ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
            }`}
    >
        {children}
    </Link>
);

export default Navbar;
