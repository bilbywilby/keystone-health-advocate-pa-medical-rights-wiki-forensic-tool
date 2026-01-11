import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Gavel, Calculator, Globe, Zap, TrendingUp, AlertTriangle, Pill, Heart, Lock, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WikiSearch } from '@/components/WikiSearch';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { CommunityStats } from '@shared/types';
import { motion, LayoutGroup } from 'framer-motion';
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
      <LayoutGroup>
        <div className="space-y-24 md:space-y-32">
          {/* Urgent Regulatory Banner */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-2 rounded-lg"><Zap className="w-5 h-5 text-amber-500" /></div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-100 text-slate-900 dark:bg-slate-900/50 dark:text-slate-100 text-[11px] font-black uppercase tracking-[0.2em] shadow-inner border">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Keystone Defensive Suite v2026.2
            </motion.div>
            <motion.h1 layoutId="hero-title" className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] py-4">
              Protect Your <br /> <span className="text-amber-500">Medical Rights</span>
            </motion.h1>
            <motion.p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed font-medium">
              Join the 2026 PA Advocacy network. Forensic tools to block illegal medical debt and secure 100% private coverage.
            </motion.p>
            <motion.div className="max-w-xl mx-auto">
              <WikiSearch />
            </motion.div>
          </section>
          {/* Gamification / Impact Layer */}
          <section className="grid lg:grid-cols-3 gap-8 items-stretch">
            <Card className="lg:col-span-2 bg-indigo-600 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute bottom-0 right-0 p-4 opacity-10"><Users className="w-48 h-48" /></div>
              <CardContent className="p-8 space-y-8 relative z-10">
                 <div className="space-y-2">
                    <Badge className="bg-indigo-500 text-white border-none font-bold">Community Consensus</Badge>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Your Advocacy Impact</h2>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                       <div className="text-xs font-bold uppercase text-indigo-200">Help Reached</div>
                       <div className="text-4xl font-black">95%</div>
                       <p className="text-[10px] text-indigo-100 italic">Consensus on CPT 70551 pricing accuracy in PA.</p>
                    </div>
                    <div className="space-y-1">
                       <div className="text-xs font-bold uppercase text-indigo-200">Local Audits</div>
                       <div className="text-4xl font-black">{stats?.totalAudited || 0}</div>
                       <p className="text-[10px] text-indigo-100 italic">Anonymized points contributed to the DB.</p>
                    </div>
                    <div className="space-y-1">
                       <div className="text-xs font-bold uppercase text-indigo-200">Active Shields</div>
                       <div className="text-4xl font-black">5.2k</div>
                       <p className="text-[10px] text-indigo-100 italic">Residents using Privacy Vault for defense.</p>
                    </div>
                 </div>
                 <Button asChild variant="outline" className="border-indigo-400 bg-indigo-500/50 hover:bg-indigo-400 text-white font-bold">
                    <Link to="/vault">View My Achievements <ArrowRight className="ml-2 w-4 h-4" /></Link>
                 </Button>
              </CardContent>
            </Card>
            <Card className="border-slate-200 flex flex-col justify-between">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <h3 className="font-black uppercase text-sm">Unlocked Badges</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><ShieldCheck className="w-5 h-5" /></div>
                       <div>
                          <div className="text-xs font-bold">Shield Bearer</div>
                          <div className="text-[10px] text-muted-foreground">Saved 1st letter to Vault</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-40 grayscale">
                       <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><TrendingUp className="w-5 h-5" /></div>
                       <div>
                          <div className="text-xs font-bold">Verified Forensic</div>
                          <div className="text-[10px] text-muted-foreground">5 contributions needed</div>
                       </div>
                    </div>
                 </div>
              </CardContent>
              <div className="p-4 bg-slate-50 border-t text-[9px] font-black uppercase text-center text-slate-400 tracking-widest">
                Milestones Protected by ValleyDB
              </div>
            </Card>
          </section>
          {/* Feature Grid & Footer */}
          <section className="grid md:grid-cols-2 gap-8">
             <Card className="bg-slate-50 border-2 border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center hover:border-indigo-500 transition-all">
                <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none"><Gavel className="w-8 h-8 text-white" /></div>
                <div className="space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-black">Dispute Suite</h3>
                  <p className="text-sm text-muted-foreground">One-click legal templates for Act 146, Act 77, and SB 371 violations. Cites exact PA statutes.</p>
                  <Button asChild variant="link" className="p-0 h-auto font-black text-indigo-600 uppercase tracking-widest text-[10px]">
                    <Link to="/disputes">Launch Dispute Engine <ArrowRight className="w-3 h-3 ml-2" /></Link>
                  </Button>
                </div>
             </Card>
             <Card className="bg-slate-50 border-2 border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center hover:border-amber-500 transition-all">
                <div className="bg-amber-500 p-4 rounded-2xl shadow-xl shadow-amber-200 dark:shadow-none"><Calculator className="w-8 h-8 text-slate-900" /></div>
                <div className="space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-black">Forensic Toolkit</h3>
                  <p className="text-sm text-muted-foreground">Audit interest rates, calculate FPL eligibility for HB 79 screening, and check PBM prescription copays.</p>
                  <Button asChild variant="link" className="p-0 h-auto font-black text-amber-600 uppercase tracking-widest text-[10px]">
                    <Link to="/tools">Audit My Bill <ArrowRight className="w-3 h-3 ml-2" /></Link>
                  </Button>
                </div>
             </Card>
          </section>
          <footer className="border-t pt-20 pb-12 space-y-12">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border flex flex-col md:flex-row gap-6 items-start md:items-center">
              <AlertTriangle className="w-10 h-10 text-amber-500 flex-shrink-0" />
              <div className="space-y-1">
                <h5 className="text-sm font-black uppercase">Mandatory Legal Disclaimer</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  NOT LEGAL OR MEDICAL ADVICE. This tool is for educational purposes only. While we strive for accuracy regarding 2026 PA statutes, laws are subject to change.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </LayoutGroup>
    </AppLayout>
  );
}