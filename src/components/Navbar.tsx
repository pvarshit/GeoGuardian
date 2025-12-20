import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, Globe, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Live Map', path: '/map' },
        { name: 'Explorer', path: '/explorer' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-brand-primary/20 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Globe className="h-8 w-8 text-brand-primary group-hover:animate-spin-slow transition-transform" />
                        <span className="text-xl font-heading font-bold tracking-wide group-hover:text-brand-primary transition-colors">
                            GeoGuardian
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-brand-primary",
                                    location.pathname === link.path ? "text-brand-primary" : "text-gray-300"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center">
                        <Link
                            to="/login"
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/50 text-brand-primary transition-all active:scale-95"
                        >
                            <User className="w-4 h-4" />
                            <span className="text-sm font-semibold">Login</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-brand-dark border-t border-brand-primary/20">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center mt-4 px-5 py-3 rounded-md font-bold bg-brand-primary/20 text-brand-primary border border-brand-primary/50"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
