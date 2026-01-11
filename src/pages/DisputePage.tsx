import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Phone, FileText, ArrowRight, Gavel, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const QUICK_DISPUTES = [
  { 
    title: 'Surprise Bill (No Surprises Act)', 
    desc: 'OON bill at in-network facility or Emergency Room.', 
    cites: 'Federal No Surprises Act / CMS-9909-IFC' 
  },
  { 
    title: 'Interest Over 3% (SB 371)', 
    desc: 'Audit and dispute predatory medical collection rates.', 
    cites: 'PA SB 371 (Louisa Carman Act)' 
  },
  { 
    title: 'Financial Assistance Denial', 
    desc: 'Hospital failed to screen for HB 79 eligibility.', 
    cites: 'PA HB 79 / 400% FPL Rule' 
  },
  { 
    title: 'Act 146 Specialty Mismatch', 
    desc: 'GP denied specialist order without peer review.', 
    cites: 'PA Act 146 Section 2116' 
  }
];
export function DisputePage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <section className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight">One-Click Dispute Suite</h1>
            <p className="text-lg text-muted-foreground">
              Rapid response tools for Pennsylvania medical violations. Citation-backed, HIPAA-safe, and ready to send.
            </p>
          </section>
          <div className="grid md:grid-cols-2 gap-6">
            {QUICK_DISPUTES.map((dispute, i) => (
              <Card key={i} className="hover:shadow-lg transition-all group border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Gavel className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dispute.cites}</span>
                  </div>
                  <CardTitle className="text-xl">{dispute.title}</CardTitle>
                  <CardDescription>{dispute.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-slate-900 group-hover:bg-amber-500 transition-colors">
                    <Link to="/appeal-generator">
                      Generate PDF Letter <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <section className="bg-slate-900 text-white p-8 rounded-3xl grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" /> Professional Advocate Hotline
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                If a provider refuses to honor PA statutes, file a formal complaint with the PID or contact the Attorney General Healthcare Section.
              </p>
            </div>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white h-12">
                <a href="tel:1-877-881-6388">
                  <Phone className="w-4 h-4 mr-2" /> 1-877-881-6388 (PID)
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white h-12">
                <a href="https://www.attorneygeneral.gov/health-care-section-complaint/" target="_blank">
                  Contact PA Attorney General
                </a>
              </Button>
            </div>
          </section>
          <section className="max-w-3xl mx-auto space-y-6 pt-10 border-t">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Legal Standing Notice
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              The Keystone Health Advocate is an advocacy tool provided for educational purposes. We do not provide legal advice. Always review generated letters and consult a qualified attorney for complex litigation. All dispute data is stored locally in your Privacy Vault (ValleyDB).
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}