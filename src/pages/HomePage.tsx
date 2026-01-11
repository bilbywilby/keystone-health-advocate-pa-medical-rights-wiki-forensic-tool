import React from 'react';
import { ShieldCheck, ArrowRight, Gavel, Calculator, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { WikiSearch } from '@/components/WikiSearch';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
export function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            Empowering Pennsylvania Patients
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Know Your <span className="text-amber-500">Medical Rights</span> in PA
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Access forensic billing tools and local regulatory guides. Fight denials using PA Act 146 and the Federal No Surprises Act.
          </p>
          <WikiSearch />
        </section>
        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow group">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
                <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Audit Your Bill</CardTitle>
              <CardDescription>Upload an EOB to check for "Fair Market Value" violations in PA.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto group-hover:text-primary transition-colors">
                <Link to="/tools" className="flex items-center gap-2">
                  Launch Toolkit <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow group">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                <Gavel className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle>Dispute a Denial</CardTitle>
              <CardDescription>Generate an appeal letter citing PA-specific statutes and precedents.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto group-hover:text-primary transition-colors">
                <Link to="/wiki" className="flex items-center gap-2">
                  View Law Guides <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow group">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <CardTitle>Privacy Vault</CardTitle>
              <CardDescription>Securely store your medical records locally in your browser. HIPAA-safe by design.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0 h-auto group-hover:text-primary transition-colors">
                <Link to="/vault" className="flex items-center gap-2">
                  Enter Vault <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
        {/* Featured Guide */}
        <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px]" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">New: Act 146 Guide</h2>
              <p className="text-slate-400 text-lg">
                Pennsylvania recently overhauled how prior authorizations work. Learn how to demand "Peer-to-Peer" reviews when your MRI or specialist visit is denied.
              </p>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                <Link to="/wiki/act-146-prior-auth">Read the Master SOP</Link>
              </Button>
            </div>
            <div className="hidden md:flex justify-end">
              <ShieldCheck className="w-48 h-48 text-amber-500/20" />
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}