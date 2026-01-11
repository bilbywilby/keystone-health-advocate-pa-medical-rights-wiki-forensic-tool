import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { WikiArticle, WikiCategory } from '@shared/types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy, ChevronRight, BookOpen, Flag, Info, Users } from 'lucide-react';
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
  const reportOutlier = () => {
    toast.success('Statute reported for 2026 verification review');
  };
  if (loading) {
    return (
      <AppLayout>
        <div className="flex gap-8"><div className="hidden lg:block w-64 space-y-4"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-full" /></div><div className="flex-1 space-y-6"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40 w-full" /></div></div>
      </AppLayout>
    );
  }
  if (!slug) {
    return (
      <AppLayout>
        <div className="space-y-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black tracking-tight uppercase">PA Rights Wiki</h1>
            <p className="text-muted-foreground text-lg">Standard Operating Procedures for medical advocacy in Pennsylvania.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-indigo-500 bg-indigo-50/30 p-6 flex flex-col justify-between">
               <div className="space-y-2">
                  <Users className="w-8 h-8 text-indigo-600" />
                  <h3 className="font-black text-lg">The Consensus Model</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">How we ensure 2026 price data accuracy through our 'Threshold-Consensus' algorithm (5+ contributors required).</p>
               </div>
               <Button asChild size="sm" className="mt-4 bg-indigo-600">
                  <Link to="/wiki/threshold-consensus">Read Policy</Link>
               </Button>
            </Card>
            {list.map((a) => (
              <Link key={a.id} to={`/wiki/${a.slug}`}>
                <Card className="p-6 border rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all group h-full flex flex-col justify-between bg-white dark:bg-slate-950">
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">{a.category}</Badge>
                    <h3 className="font-black text-xl group-hover:text-amber-600 transition-colors leading-tight">{a.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{a.excerpt}</p>
                  </div>
                  <div className="pt-4 flex items-center text-xs text-amber-600 font-bold uppercase tracking-widest">
                    Read SOP <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-12 relative">
        <aside className="lg:w-72 lg:sticky lg:top-24 h-fit space-y-6 order-2 lg:order-1">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl space-y-4 border">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Regulatory SOPs</div>
            <nav className="space-y-2">
              {list.map(a => (
                <Link key={a.id} to={`/wiki/${a.slug}`} className={cn("block text-sm py-2 px-3 rounded-lg transition-colors hover:bg-white dark:hover:bg-black", a.slug === slug ? 'bg-white dark:bg-black text-amber-600 font-black shadow-sm' : 'text-muted-foreground')}>
                  {a.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-4">
             <h4 className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Statute Verification</h4>
             <p className="text-xs text-amber-700 leading-relaxed italic">Think a 2025 law listed here has been superseded by 2026 regulations?</p>
             <Button onClick={reportOutlier} variant="outline" className="w-full border-amber-300 text-amber-800 text-[10px] font-black">
                <Flag className="w-3 h-3 mr-2" /> REPORT STALE LAW
             </Button>
          </div>
        </aside>
        <article className="flex-1 order-1 lg:order-2 space-y-8">
          {article ? (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="font-black text-[10px] uppercase">{article.category}</Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified: {article.lastUpdated}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[0.9]">{article.title}</h1>
              <div className="wiki-content text-lg leading-relaxed font-serif">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{article.content}</ReactMarkdown>
              </div>
              <div className="mt-16 p-8 border-2 border-dashed bg-slate-50 dark:bg-slate-900 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><BookOpen className="w-32 h-32" /></div>
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-4">
                  <Info className="w-4 h-4 text-indigo-500" /> Advocacy SOP Verification
                </h4>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  This SOP has been vetted by the 2026 PA Advocacy Consensus. Always cite the specific statutory section (§) mentioned above when communicating with a Payer's legal counsel.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed">
               <h2 className="text-2xl font-black uppercase tracking-tighter">Article under review</h2>
               <p className="text-muted-foreground mt-2 mb-6">This content is currently being verified for 2026 regulatory compliance.</p>
               <Button asChild className="bg-slate-900"><Link to="/wiki">Return to Library</Link></Button>
            </div>
          )}
        </article>
      </div>
    </AppLayout>
  );
}