import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { WikiArticle } from '@shared/types';
import { api } from '@/lib/api-client';
export function WikiSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WikiArticle[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const articles = await api<WikiArticle[]>('/api/wiki');
        const filtered = articles.filter(a => 
          a.title.toLowerCase().includes(query.toLowerCase()) || 
          a.excerpt.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.slice(0, 5));
      } catch (e) {
        console.error('Search failed', e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search PA medical rights, laws, or billing codes..."
          className="pl-10 h-12 bg-background border-slate-200 shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((article) => (
            <button
              key={article.id}
              onClick={() => {
                navigate(`/wiki/${article.slug}`);
                setQuery('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-0"
            >
              <div className="font-medium text-sm">{article.title}</div>
              <div className="text-xs text-muted-foreground truncate">{article.excerpt}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}