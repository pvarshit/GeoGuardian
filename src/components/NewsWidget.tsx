import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface Article {
    title: string;
    url: string;
    source: string;
    published_at: string;
}

interface NewsWidgetProps {
    city: string;
}

export const NewsWidget: React.FC<NewsWidgetProps> = ({ city }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!city) return;

        const fetchNews = async () => {
            setLoading(true);
            setError(false);
            try {
                // Determine base URL (localhost for dev)
                const baseUrl = 'http://localhost:8100';
                const res = await fetch(`${baseUrl}/news?city=${encodeURIComponent(city)}`);
                if (!res.ok) throw new Error('News fetch failed');

                const data = await res.json();
                setArticles(data.articles || []);
            } catch (err) {
                console.error("News widget error:", err);
                setError(true);
                // Fallback to empty list so we don't show broken UI
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [city]);

    if (!city) return null;

    return (
        <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <Newspaper className="w-3 h-3" /> Latest Pollution News
            </h4>

            {loading ? (
                <div className="flex justify-center py-4">
                    <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error || articles.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No recent specific news found for {city}.</p>
            ) : (
                <div className="space-y-3">
                    {articles.map((article, idx) => (
                        <a
                            key={idx}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                        >
                            <h5 className="text-xs font-medium text-gray-200 mb-1 line-clamp-2 leading-relaxed group-hover:text-brand-primary transition-colors">
                                {article.title}
                            </h5>
                            <div className="flex items-center justify-between text-[10px] text-gray-500">
                                <span className="flex items-center gap-1">
                                    {article.source}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> {article.published_at}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};
