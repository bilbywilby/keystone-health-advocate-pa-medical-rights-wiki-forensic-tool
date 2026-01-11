import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Gavel, Calculator, Globe, Zap, TrendingUp, AlertTriangle, Pill, Heart, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WikiSearch } from '@/components/WikiSearch';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { CommunityStats } from '@shared/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
export function HomePage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api<CommunityStats>('/api/benchmarks/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return (
    <AppLayout>
      <div className="space-y-24 md:space-y-32">
        {/* Urgent Regulatory Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-black uppercase tracking-widest text-amber-500">2026 Legal Update</div>
              <div className="text-sm font-bold">Act 77 & HB 79: PBM Transparency and Debt Relief enforced statewide.</div>
            </div>
          </div>
          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black">
            <Link to="/tools">Audit My Pharmacy</Link>
          </Button>
        </motion.div>
        {/* Hero Section */}
        <section className="text-center space-y-12 max-w-5xl mx-auto pt-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-100 text-slate-900 dark:bg-slate-900/50 dark:text-slate-100 text-[11px] font-black uppercase tracking-[0.2em] shadow-inner border">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Keystone Defensive Suite v2026.2
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] py-4">
            Protect Your <br /> <span className="text-amber-500">Medical Rights</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed font-medium">
            Forensic tools to audit pharmacy PBMs, block illegal medical debt, and secure Medicaid coverage. 100% Private. Local-First.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-xl mx-auto">
            <WikiSearch />
          </motion.div>
        </section>
        {/* Defense Readiness Center */}
        <section className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center gap-2 border-b pb-4">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Defense Readiness Center</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Privacy Vault', icon: Lock, status: 'Active', desc: 'ValleyDB Encrypted', color: 'bg-emerald-500' },
              { label: 'Debt Shield', icon: Gavel, status: 'Pending', desc: 'HB79 Screening Required', color: 'bg-amber-500' },
              { label: 'PBM Audit', icon: Pill, status: 'Inactive', desc: 'Act 77 Check Pending', color: 'bg-slate-300' },
              { label: 'MA Guard', icon: Heart, status: 'Inactive', desc: 'Work Log Empty', color: 'bg-slate-300' }
            ].map((mod, i) => (
              <Card key={i} className="group hover:border-indigo-500 transition-all border-slate-200">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <mod.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-black ${mod.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>{mod.status}</Badge>
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase">{mod.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{mod.desc}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        {/* Live Consensus Stats */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Consensus Price Benchmarks
              </h2>
              <p className="text-[10px] text-muted-foreground font-bold">REAL-TIME ANONYMOUS COST AGGREGATION FOR PENNSYLVANIA</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />)}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">+512 AUDITS TODAY</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {loading ? (
               Array(4).fill(0).map((_, i) => (
                 <Skeleton key={i} className="h-32 w-full rounded-2xl" />
               ))
             ) : (
               <>
                 {stats?.legislativePulse.map((pulse, i) => (
                   <Card key={i} className="bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 hover:border-amber-500 transition-colors group">
                      <CardContent className="pt-6 space-y-4">
                        <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0 text-[9px] font-black">{pulse.status}</Badge>
                        <div>
                          <div className="font-black text-sm text-slate-800 dark:text-slate-200 uppercase">{pulse.label}</div>
                          <div className="text-[10px] text-muted-foreground leading-tight mt-1 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{pulse.impact}</div>
                        </div>
                      </CardContent>
                   </Card>
                 ))}
                 <Card className="bg-slate-900 text-white overflow-hidden relative min-h-[140px]">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><TrendingUp className="w-20 h-20" /></div>
                    <CardContent className="pt-6 flex flex-col justify-between h-full relative z-10">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Savings Identified</div>
                        <div className="text-3xl font-black text-amber-500 tracking-tighter">
                          ${stats ? stats.totalSavingsIdentified.toLocaleString() : '---'}
                        </div>
                      </div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase mt-4">Threshold: Consensus Reached</div>
                    </CardContent>
                 </Card>
               </>
             )}
          </div>
        </section>
        {/* Feature Grid */}
        <section className="grid md:grid-cols-2 gap-8">
           <Card className="bg-slate-50 border-2 border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center hover:border-indigo-500 transition-all">
              <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-black">Dispute Suite</h3>
                <p className="text-sm text-muted-foreground">One-click legal templates for Act 146, Act 77, and SB 371 violations. Cites exact PA statutes.</p>
                <Button asChild variant="link" className="p-0 h-auto font-black text-indigo-600 uppercase tracking-widest text-[10px]">
                  <Link to="/disputes">Launch Dispute Engine <ArrowRight className="w-3 h-3 ml-2" /></Link>
                </Button>
              </div>
           </Card>
           <Card className="bg-slate-50 border-2 border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center hover:border-amber-500 transition-all">
              <div className="bg-amber-500 p-4 rounded-2xl shadow-xl shadow-amber-200 dark:shadow-none">
                <Calculator className="w-8 h-8 text-slate-900" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-black">Forensic Toolkit</h3>
                <p className="text-sm text-muted-foreground">Audit interest rates, calculate FPL eligibility for HB 79 screening, and check PBM prescription copays.</p>
                <Button asChild variant="link" className="p-0 h-auto font-black text-amber-600 uppercase tracking-widest text-[10px]">
                  <Link to="/tools">Audit My Bill <ArrowRight className="w-3 h-3 ml-2" /></Link>
                </Button>
              </div>
           </Card>
        </section>
        {/* Footer Disclaimer */}
        <footer className="border-t pt-20 pb-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6 text-amber-500" />
                 <span className="text-xl font-black uppercase tracking-tighter">Keystone Health Advocate</span>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed max-w-xl italic border-l-2 pl-4 border-slate-200">
                 The Keystone Health Advocate is a 2026 open-source advocacy platform designed to empower Pennsylvania healthcare consumers. We provide forensic auditing tools and citation-backed templates to assist in navigating medical billing disputes and coverage denials.
               </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Legal Access</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/wiki" className="text-sm font-bold hover:text-amber-600 transition-colors">Regulatory Wiki</Link>
                <Link to="/emergency" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">Emergency Rights (ER)</Link>
                <Link to="/directory" className="text-sm font-bold hover:text-amber-600 transition-colors">Provider Compliance Map</Link>
              </nav>
            </div>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border flex flex-col md:flex-row gap-6 items-start md:items-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 flex-shrink-0" />
            <div className="space-y-1">
              <h5 className="text-sm font-black uppercase">Mandatory Legal Disclaimer</h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                NOT LEGAL OR MEDICAL ADVICE. This tool is for educational and advocacy purposes only. It does not establish an attorney-client relationship. While we strive for accuracy regarding 2026 PA statutes, laws are subject to change and judicial interpretation. Always review generated communications with a qualified legal professional for complex litigation or significant financial exposure.
              </p>
            </div>
          </div>
          <div className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            AGPL v3 Open Source • Built for Pennsylvania • 2026
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}