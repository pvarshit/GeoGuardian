import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { BRANDING } from '../config/branding';

export default function Login() {
    const navigate = useNavigate();

    const handleGuestLogin = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative">
            {/* Blurred Map Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-30 blur-sm"
                style={{ backgroundImage: `url(${BRANDING.heroImage})` }}
            />

            <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to access the GeoGuardian platform</p>
                </div>

                {/* Form Mock */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                placeholder="researcher@institute.org"
                                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button className="w-full py-3 px-4 bg-brand-primary hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-95">
                        Log In
                    </button>

                    <div className="flex items-center gap-4 my-4">
                        <div className="h-px flex-1 bg-gray-700"></div>
                        <span className="text-gray-500 text-xs uppercase">or</span>
                        <div className="h-px flex-1 bg-gray-700"></div>
                    </div>

                    <button
                        onClick={handleGuestLogin}
                        className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-lg transition-all active:scale-95"
                    >
                        Continue as Guest
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
