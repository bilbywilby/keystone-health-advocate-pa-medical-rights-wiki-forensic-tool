import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterestCalculator } from '@/components/tools/InterestCalculator';
import { FMVLookup } from '@/components/tools/FMVLookup';
import { PricingContribution } from '@/components/tools/PricingContribution';
import { FinancialDefense } from '@/components/tools/FinancialDefense';
import { PremiumNavigator } from '@/components/tools/PremiumNavigator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info, Users, ShieldCheck, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function ToolsPage() {
  return (
    <AppLayout>
      <div className="space-y-12">
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight">Forensic Advocacy Toolkit</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                2026 PA Financial Defense Suite. Audit bills, screen for assistance, and protect against medical debt.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Zap className="w-4 h-4 text-indigo-500" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">SB 371 Active: 3% Cap</div>
            </div>
          </div>
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 max-w-2xl">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Privacy Notice</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400/80">
              All audits are performed locally. Your personal data never leaves your device. HIPAA-compliant by design.
            </AlertDescription>
          </Alert>
        </section>
        <Tabs defaultValue="defense" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="defense">Defense</TabsTrigger>
            <TabsTrigger value="pennie">Premiums</TabsTrigger>
            <TabsTrigger value="fmv">Prices</TabsTrigger>
            <TabsTrigger value="interest">Interest</TabsTrigger>
            <TabsTrigger value="contribute">Share</TabsTrigger>
          </TabsList>
          <TabsContent value="defense">
            <FinancialDefense />
          </TabsContent>
          <TabsContent value="pennie">
            <PremiumNavigator />
          </TabsContent>
          <TabsContent value="interest">
            <InterestCalculator />
          </TabsContent>
          <TabsContent value="fmv">
            <FMVLookup />
          </TabsContent>
          <TabsContent value="contribute">
            <div className="max-w-3xl mx-auto">
              <PricingContribution />
            </div>
          </TabsContent>
        </Tabs>
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-500">
                <ShieldCheck className="w-4 h-4" />
                2026 Regulatory Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p><strong>HB 79 (Financial Assistance):</strong> Enforced. Hospitals must offer assistance if debt exceeds 5% of income or income is below 400% FPL.</p>
              <p><strong>SB 371 (Louisa Carman Act):</strong> Enforced. Maximum medical interest rate is 3%. Wage garnishment blocked for households under 600% FPL.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-500">
                <AlertCircle className="w-4 h-4" />
                Legal Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              If a provider refuses to honor the SB 371 interest cap or HB 79 screening mandate, contact the <strong>PA Attorney General’s Health Care Section</strong> or the Insurance Department Consumer Bureau at 1-877-881-6388.
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}