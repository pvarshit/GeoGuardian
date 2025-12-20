import Navbar from '../components/Navbar';
import { Send } from 'lucide-react';

export default function About() {

    return (
        <div className="min-h-screen bg-brand-dark text-white pt-24 font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
                        About GeoGuardian
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        The next generation of environmental accountability, powered by autonomous AI agents.
                    </p>
                </div>

                {/* Mission */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-brand-primary pl-4">Our Mission</h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        To democratize access to high-fidelity environmental data. By fusing satellite imagery, dispersed IoT sensor networks, and citizen reports, GeoGuardian creates a real-time living map of our planet's health, holding polluters accountable and empowering communities with actionable insights.
                    </p>
                </section>

                {/* How It Works */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-brand-secondary pl-4">How It Works</h2>

                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
                        {[
                            { title: "Data Collection", desc: "Sensors, satellites, and citizens feed raw data into our ingestion layer." },
                            { title: "Data Fusion", desc: "Our Sensor Fusion Agent correlates disparate signals to validate anomalies." },
                            { title: "Causal Reasoning", desc: "AI models trace pollution back to its likely industrial or natural source." },
                            { title: "Visualization", desc: "Actionable dashboards and alerts are generated for authorities and public." }
                        ].map((step, idx) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-brand-dark bg-gray-800 group-hover:bg-brand-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                    <span className="text-xs font-bold">{idx + 1}</span>
                                </div>

                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
                                    <h3 className="font-bold text-lg mb-2 text-white">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ethics & Roadmap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <ShieldIcon className="w-6 h-6 text-emerald-400" />
                            Data Ethics
                        </h2>
                        <ul className="space-y-4">
                            {['Privacy-first citizen reporting', 'Open source data standards', 'Transparent AI reasoning logs', 'Neutrality in algorithmic detection'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-400">
                                    <CheckIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Send className="w-6 h-6 text-brand-secondary" />
                            Roadmap
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-24 text-sm font-bold text-emerald-400 shrink-0">Phase 1</div>
                                <div>
                                    <h4 className="font-bold text-white">Data Platform</h4>
                                    <p className="text-xs text-gray-500">MVP with raw sensor ingestion and dashboard.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 opacity-75">
                                <div className="w-24 text-sm font-bold text-blue-400 shrink-0">Phase 2</div>
                                <div>
                                    <h4 className="font-bold text-white">AI Detection</h4>
                                    <p className="text-xs text-gray-500">Computer vision for satellite imagery analysis.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 opacity-50">
                                <div className="w-24 text-sm font-bold text-purple-400 shrink-0">Phase 3</div>
                                <div>
                                    <h4 className="font-bold text-white">Autonomous Agents</h4>
                                    <p className="text-xs text-gray-500">Self-triggering investigations and regulatory filing.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}

function ShieldIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}

function CheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
