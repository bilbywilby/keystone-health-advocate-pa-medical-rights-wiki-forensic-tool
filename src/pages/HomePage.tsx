import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Gavel, Calculator, FileText, Landmark, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
      <div className="space-y-24 md:space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-10 max-w-4xl mx-auto pt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            Empowering Pennsylvania Patients Since 2024
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[0.9]">
            Know Your <span className="text-amber-500">Medical Rights</span> in PA
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Audit predatory bills, fight insurance denials, and access local regulatory guides. HIPAA-safe by design.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <WikiSearch />
          </motion.div>
        </section>
        {/* Community Impact Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-slate-100 dark:border-slate-800">
          <div className="text-center space-y-2">
            <div className="text-4xl font-black text-amber-500">{(stats?.totalAudited || 0).toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bills Audited in PA</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-black text-emerald-500">
              ${((stats?.totalSavingsIdentified || 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Savings Identified</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-black text-indigo-500">{(stats?.contributorCount || 0).toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Community Heroes</div>
          </div>
        </section>
        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-xl">Audit Bills</CardTitle>
              <CardDescription>Detect Act 6 violations and predatory interest rates.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-indigo-600 dark:text-indigo-400 hover:bg-transparent">
                <Link to="/tools" className="flex items-center gap-2">
                  Launch Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Gavel className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-xl">Generate Appeals</CardTitle>
              <CardDescription>Cite PA Act 146 in automated legal dispute letters.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-amber-600 dark:text-amber-400 hover:bg-transparent">
                <Link to="/appeal-generator" className="flex items-center gap-2">
                  Create Letter <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Landmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-xl">Directory</CardTitle>
              <CardDescription>Track PA provider price transparency compliance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-emerald-600 dark:text-emerald-400 hover:bg-transparent">
                <Link to="/directory" className="flex items-center gap-2">
                  Find Facility <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all group border-slate-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <FileText className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Privacy Vault</CardTitle>
              <CardDescription>Securely store records locally on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto font-bold text-slate-900 dark:text-white hover:bg-transparent">
                <Link to="/vault" className="flex items-center gap-2">
                  Enter Vault <ArrowRight className="w-4 h-4" />
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
              <Badge className="bg-amber-500 text-slate-950 font-black px-4 py-1">LATEST SOP</Badge>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">Mastering Act 146: Prior Auth Reform</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Pennsylvania law now mandates specialized peer-to-peer reviews for insurance denials. Learn how to demand your rights and overturn clinical rejections.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-12 px-8">
                  <Link to="/wiki/act-146-prior-auth">Read the Full Guide</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-700 hover:bg-slate-800 text-white h-12 px-8">
                  <Link to="/emergency">Emergency Help</Link>
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