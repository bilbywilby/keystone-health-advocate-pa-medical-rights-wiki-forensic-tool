import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { WikiArticle } from '@shared/types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, ChevronRight, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
export function WikiPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [list, setList] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articles, detail] = await Promise.all([
          api<WikiArticle[]>('/api/wiki'),
          slug ? api<WikiArticle>(`/api/wiki/${slug}`) : Promise.resolve(null)
        ]);
        setList(articles);
        setArticle(detail);
      } catch (e) {
        console.error('Failed to load wiki', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Snippet copied to clipboard');
  };
  if (loading) {
    return (
      <AppLayout>
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex-1 space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }
  if (!slug) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">PA Rights Wiki</h1>
            <p className="text-muted-foreground">Standard Operating Procedures (SOPs) for medical advocacy in Pennsylvania.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((a) => (
              <Link key={a.id} to={`/wiki/${a.slug}`}>
                <div className="p-4 border rounded-lg hover:border-amber-500 hover:shadow-sm transition-all group h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                    <h3 className="font-semibold group-hover:text-amber-600 transition-colors">{a.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                  </div>
                  <div className="pt-4 flex items-center text-xs text-amber-600 font-medium">
                    Read SOP <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <aside className="lg:w-64 lg:sticky lg:top-24 h-fit space-y-4 order-2 lg:order-1">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Table of Contents</div>
            <nav className="space-y-2">
              {list.map(a => (
                <Link 
                  key={a.id} 
                  to={`/wiki/${a.slug}`}
                  className={`block text-sm py-1 transition-colors hover:text-amber-500 ${a.slug === slug ? 'text-amber-600 font-semibold' : 'text-muted-foreground'}`}
                >
                  {a.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <article className="flex-1 order-1 lg:order-2">
          {article ? (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">Last updated: {article.lastUpdated}</span>
              </div>
              <h1 className="text-4xl font-extrabold mb-8">{article.title}</h1>
              <div className="wiki-content">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{article.content}</ReactMarkdown>
              </div>
              <div className="mt-12 p-6 border-t border-dashed bg-slate-50 dark:bg-slate-900 rounded-xl">
                <h4 className="flex items-center gap-2 text-sm font-bold mb-2">
                  <BookOpen className="w-4 h-4" /> Professional Advocacy Tip
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  Always cite specific sections of PA statutes when communicating with insurance grievance departments. This forces them to involve their legal/compliance teams.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl font-bold">Article Not Found</h2>
              <Link to="/wiki" className="text-amber-600 hover:underline">Return to index</Link>
            </div>
          )}
        </article>
      </div>
    </AppLayout>
  );
}