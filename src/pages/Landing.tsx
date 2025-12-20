import { Activity, Droplets, Factory, Users, ShieldCheck, Cpu, Database } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import { Link } from 'react-router-dom';

export default function Landing() {
    const features = [
        {
            title: "Air Monitoring",
            description: "Real-time PM2.5, NO2, and CO2 tracking using dispersed IoT sensors and satellite data fusion.",
            icon: Activity
        },
        {
            title: "Water Quality",
            description: "AI analysis of turbidity and pH levels in key water bodies to detect contamination early.",
            icon: Droplets
        },
        {
            title: "Industrial Activity",
            description: "Correlating factory emission schedules with local pollution spikes for accountability.",
            icon: Factory
        },
        {
            title: "Citizen Reports",
            description: "Empowering communities to report hazards, verified by our Document Intelligence Agent.",
            icon: Users
        }
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-primary/30">
            <Navbar />

            <Hero />

            <FeatureGrid features={features} />

            {/* Trust / Impact Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-y border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div className="p-4">
                            <div className="flex justify-center mb-3 text-brand-secondary"><Cpu className="w-8 h-8" /></div>
                            <div className="text-3xl font-heading font-bold text-white mb-1">120+</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Active Sensors</div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-center mb-3 text-emerald-400"><ShieldCheck className="w-8 h-8" /></div>
                            <div className="text-3xl font-heading font-bold text-white mb-1">100%</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">City-wide Coverage</div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-center mb-3 text-brand-accent"><Database className="w-8 h-8" /></div>
                            <div className="text-3xl font-heading font-bold text-white mb-1">Open Data</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">API Ready</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-brand-dark py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-2xl font-heading font-bold tracking-tight">
                        Geo<span className="text-brand-primary">Guardian</span>
                    </div>
                    <div className="flex space-x-8 text-sm text-gray-400 font-medium">
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                        <Link to="/about" className="hover:text-white transition-colors">Transparency</Link>
                        <a href="https://github.com/pvarshit/GeoGuardian" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <div className="text-xs text-gray-600">
                        © 2024 GeoGuardian. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
