import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MapPlaceholder from '../components/MapPlaceholder';
import { Send, Camera, MapPin } from 'lucide-react';

export default function ReportIssue() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
                <div className="bg-gray-800 border border-white/10 p-8 rounded-2xl max-w-md w-full text-center space-y-4 animate-fade-in-up">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Report Submitted</h2>
                    <p className="text-gray-400">
                        Thank you for being a GeoGuardian. Our Document Intelligence Agent is verifying your report and will update the map shortly.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark text-white pt-16 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] overflow-hidden">
                <h1 className="text-2xl font-bold font-heading mb-6">Report Environmental Hazard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                    {/* Form */}
                    <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Air Pollution', 'Water Contamination', 'Illegal Dumping', 'Bad Odor'].map((cat) => (
                                        <button type="button" key={cat} className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:border-brand-primary hover:text-brand-primary transition-all text-left">
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe what you see or smell..."
                                    className="w-full bg-gray-800 border-none rounded-lg text-white p-4 focus:ring-2 focus:ring-brand-primary resize-none placeholder-gray-500"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Evidence</label>
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:border-brand-primary hover:bg-gray-800/50 cursor-pointer transition-colors">
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-sm">Click to upload photo or video</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full py-3 bg-brand-primary hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Submit Report
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Map Picker */}
                    <div className="hidden lg:flex flex-col h-full pb-20">
                        <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 group">
                            <MapPlaceholder />
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl border border-white/10 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-brand-secondary" />
                                Click map to pin location
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>Selected: 34.0522° N, 118.2437° W (Mock)</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
