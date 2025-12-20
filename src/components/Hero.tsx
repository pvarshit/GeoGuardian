import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRANDING } from '../config/branding';

interface HeroProps {
    title?: string;
    subtitle?: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
    // Use config values if props not provided
    const displayTitle = title || BRANDING.heroTitle;
    const displaySubtitle = subtitle || BRANDING.heroSubtitle;

    return (
        <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 transform scale-105 animate-ken-burns"
                style={{ backgroundImage: `url(${BRANDING.heroImage})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/50 to-brand-dark/90 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/50 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">Early Prototype</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">
                    {displayTitle}
                </h1>

                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    {displaySubtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        to="/dashboard"
                        className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-lg shadow-lg shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Open Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        to="/explorer"
                        className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    >
                        View Data Explorer
                    </Link>
                </div>
            </div>

            {/* Scroll indicator (optional polish) */}
            <div className="absolute bottom-10 z-20 animate-bounce">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
            </div>
        </div>
    );
}
