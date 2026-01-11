import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppealWizard } from '@/components/generator/AppealWizard';
import { ShieldCheck, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function AppealGeneratorPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Professional Advocacy
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Appeal Letter Generator</h1>
            <p className="text-lg text-muted-foreground">
              Create legally-backed dispute letters citing PA-specific statutes like Act 146 and the No Surprises Act.
            </p>
          </div>
          <Alert className="bg-slate-50 border-slate-200 max-w-2xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-sm font-bold">Privacy First</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              This tool runs strictly in your browser. Any names, dates, or account numbers you enter stay on your device and are never transmitted to our servers.
            </AlertDescription>
          </Alert>
          <AppealWizard />
          <div className="max-w-2xl mx-auto space-y-6 pt-10 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Next Steps After Generating</h3>
            <div className="grid gap-4">
              {[
                { title: 'Save to Vault', desc: 'Secure the draft in your local Privacy Vault.' },
                { title: 'Send via Certified Mail', desc: 'For legal standing, always send appeals with delivery confirmation.' },
                { title: 'Notify PA Insurance Dept', desc: 'If the provider does not respond in 30 days, file a complaint with the PID.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-none w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}