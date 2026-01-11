import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Gavel, Calculator, FileText, Landmark, Globe, Zap, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WikiSearch } from '@/components/WikiSearch';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { CommunityStats } from '@shared/types';
import { motion } from 'framer-motion';
export function HomePage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  useEffect(() => {
    api<CommunityStats>('/api/benchmarks/stats').then(setStats).catch(() => {});
  }, []);
  return (
    <AppLayout>
      <div className="space-y-20 md:space-y-32">
        {/* Retroactive Credit Alert */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-600 text-white p-3 rounded-2xl flex items-center justify-center gap-4 text-xs font-bold shadow-xl">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>2026 PENNIE ALERT: Retroactive subsidy credits available for households under 8.5% income threshold.</span>
          <Link to="/tools" className="underline hover:text-amber-200 transition-colors">Check Eligibility</Link>
        </motion.div>
        {/* Hero Section */}
        <section className="text-center space-y-10 max-w-4xl mx-auto pt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            2026 PA Financial Defense Suite Active
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[0.9]">
            Audit Your <span className="text-amber-500">Medical Debt</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            The Louisa Carman Act (SB 371) and HB 79 now protect PA residents. Audit 3% interest caps, block garnishments, and fight denials.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <WikiSearch />
          </motion.div>
        </section>
        {/* PA Health Compass Dashboard */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Globe className="w-4 h-4" /> PA Health Compass Dashboard
            </h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600">LIVE REGULATORY FEED</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {stats?.legislativePulse.map((pulse, i) => (
               <Card key={i} className="bg-slate-50/50 border-slate-200">
                  <CardContent className="pt-6">
                    <Badge className="mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">{pulse.status}</Badge>
                    <div className="font-bold text-sm mb-1">{pulse.label}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">{pulse.impact}</div>
                  </CardContent>
               </Card>
             ))}
             <Card className="bg-indigo-900 text-white">
                <CardContent className="pt-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Savings Goal</div>
                    <div className="text-2xl font-black">$12.5M</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-200">
                    <TrendingUp className="w-3 h-3" /> Community Impact
                  </div>
                </CardContent>
             </Card>
          </div>
        </section>
        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-xl">HB 79 Auditor</CardTitle>
              <CardDescription>Mandatory hospital financial assistance screening.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-indigo-600 dark:text-indigo-400 hover:bg-transparent">
                <Link to="/tools" className="flex items-center gap-2">
                  Launch Screener <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Gavel className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-xl">SB 371 Shield</CardTitle>
              <CardDescription>Block medical garnishment & 3% interest audit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-amber-600 dark:text-amber-400 hover:bg-transparent">
                <Link to="/disputes" className="flex items-center gap-2">
                  Defend Debt <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Landmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-xl">Premium ROI</CardTitle>
              <CardDescription>Pennie 2026 subsidy and burn-rate optimizer.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-emerald-600 dark:text-emerald-400 hover:bg-transparent">
                <Link to="/tools" className="flex items-center gap-2">
                  Analyze Plan <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <FileText className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Dispute Suite</CardTitle>
              <CardDescription>One-click templates for all PA medical violations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-slate-900 dark:text-white hover:bg-transparent">
                <Link to="/disputes" className="flex items-center gap-2">
                  Start Dispute <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
        {/* Featured Content Banner */}
        <section className="bg-slate-900 text-white rounded-[2.5rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px]" />
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <Badge className="bg-amber-500 text-slate-950 font-black px-4 py-1">2026 UPDATE</Badge>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">Louisa Carman Act: Medical Interest Capped at 3%</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Pennsylvania Senate Bill 371 has passed. All medical debt interest is now legally capped at 3%. If you are being charged more, your bill is likely illegal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-12 px-8">
                  <Link to="/wiki/sb-371-debt-shield">Read Shield Guide</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-700 hover:bg-slate-800 text-white h-12 px-8">
                  <Link to="/tools">Audit Interest</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
                <ShieldCheck className="w-64 h-64 text-amber-500 relative z-10" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}