import { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Loader2, X, User, Bot, Sparkles } from 'lucide-react';
import { askAgent, type AskResponse } from '../services/agentApi';
import { clsx } from 'clsx';

interface Message {
    id: string | number;
    text: string;
    sender: 'user' | 'agent';
    data?: AskResponse;
}

interface AiChatProps {
    onNavigate?: (lat: number, lon: number, name: string) => void;
    embedded?: boolean;
    className?: string; // Allow custom positioning
}

export function AiChat({ onNavigate, embedded = false, className }: AiChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = query;
        setQuery('');

        if (!embedded) {
            // Only open chat if not embedded mode (floating mode)
            setIsOpen(true);
        }

        // Use a temporary ID
        const userMsgId = Date.now();
        setMessages(prev => [...prev, { id: userMsgId, text: userMsg, sender: 'user' }]);
        setIsLoading(true);

        try {
            const response = await askAgent(userMsg);
            if (response) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: response.answer,
                    sender: 'agent',
                    data: response
                }]);

                // Auto-navigate if location is present
                if (response.location && onNavigate) {
                    onNavigate(response.location.lat, response.location.lon, response.location.name);
                }
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm having trouble connecting to the sensor network. Please try again.", sender: 'agent' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Error processing your request.", sender: 'agent' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // EMBEDDED RENDER
    if (embedded) {
        return (
            <div className="w-full">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. 'Is Tokyo air safe?'..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="absolute right-2 top-1.5 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    </button>
                    {/* Minimal response display for embedded mode if needed, usually map update is enough
                        but let's show the last answer if it was recent? Or maybe not to keep it clean.
                    */}
                </form>
                {messages.length > 0 && messages[messages.length - 1].sender === 'agent' && (
                    <div className="mt-2 p-2 bg-white/5 rounded border border-white/5 text-[10px] text-gray-300 max-h-20 overflow-y-auto">
                        <p className="line-clamp-3">{messages[messages.length - 1].text}</p>
                    </div>
                )}
            </div>
        );
    }

    // FLOATING RENDER (Legacy / Alternative)
    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={clsx(
                        "absolute z-[1001] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-lg shadow-blue-900/50 transition-all hover:scale-110 flex items-center justify-center border border-white/10",
                        className || "bottom-8 left-8"
                    )}
                    title="Ask GeoGuardian AI"
                >
                    <Sparkles className="w-6 h-6 animate-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={clsx(
                    "absolute z-[1001] w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col max-h-[600px] h-[500px] overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in",
                    className || "bottom-8 left-8"
                )}>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/30">
                        <div className="flex items-center gap-2 text-white font-semibold">
                            <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                                GeoGuardian AI
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-3">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50 mb-2">
                                    <Bot className="w-8 h-8 text-blue-400/50" />
                                </div>
                                <div>
                                    <h3 className="text-slate-300 font-medium mb-1">How can I help?</h3>
                                    <p className="text-xs max-w-[200px] mx-auto leading-relaxed">
                                        Ask regarding weather, air quality, or find a safe place to go.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    <button onClick={() => setQuery("What's the weather in Tokyo?")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700/50 px-3 py-1.5 rounded-full transition-colors">
                                        Tokyo weather?
                                    </button>
                                    <button onClick={() => setQuery("Where is air quality good?")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700/50 px-3 py-1.5 rounded-full transition-colors">
                                        Safe places?
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={clsx(
                                "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                                msg.sender === 'user' ? "flex-row-reverse" : "flex-row"
                            )}>
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                                    msg.sender === 'user' ? "bg-blue-600" : "bg-emerald-600"
                                )}>
                                    {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                </div>

                                <div className={clsx(
                                    "p-3.5 rounded-2xl text-sm max-w-[85%] shadow-sm",
                                    msg.sender === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none"
                                )}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    {msg.data?.location && (
                                        <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                                            <MapPin className="w-3 h-3" />
                                            <span>Navigated to {msg.data.location.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-emerald-600/50 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-white/50" />
                                </div>
                                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
                        <div className="relative group">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask GeoGuardian..."
                                className="w-full bg-slate-900/80 border border-slate-600 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={!query.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600/80 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
