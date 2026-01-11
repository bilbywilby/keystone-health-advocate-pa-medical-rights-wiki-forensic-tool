import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterestCalculator } from '@/components/tools/InterestCalculator';
import { FMVLookup } from '@/components/tools/FMVLookup';
import { PricingContribution } from '@/components/tools/PricingContribution';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function ToolsPage() {
  return (
    <AppLayout>
      <div className="space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Forensic Billing Toolkit</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Interactive tools to audit medical bills and interest rates based on Pennsylvania statutes. Powered by community data.
          </p>
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 max-w-2xl">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Privacy Notice</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400/80">
              All audits are performed locally. Your personal data never leaves your device unless you explicitly choose to contribute scrubbed, anonymous data.
            </AlertDescription>
          </Alert>
        </section>
        <Tabs defaultValue="interest" className="space-y-8">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="interest">Interest Audit</TabsTrigger>
            <TabsTrigger value="fmv">Fair Price Lookup</TabsTrigger>
            <TabsTrigger value="contribute" className="flex items-center gap-2">
              <Users className="w-3 h-3" /> Crowdsource
            </TabsTrigger>
          </TabsList>
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
                <AlertCircle className="w-4 h-4" />
                Legal Basis: Interest Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              <strong>PA Act 6 of 1974:</strong> Establishes a 6% maximum interest rate on many consumer debts under $50,000. If a medical collection agency or hospital is charging 12-18% interest, they are likely in violation of state law. Use the Interest Audit tool to calculate your specific overcharge.
            </CardContent>
          </Card>
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-500">
                <Info className="w-4 h-4" />
                Legal Basis: Price Gouging
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              While PA doesn't have a universal price cap, the <strong>No Surprises Act</strong> and <strong>Act 146</strong> require transparency. Bills exceeding the 80th percentile of regional benchmarks (Fair Market Value) are often negotiable via the hospital ombudsman.
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}