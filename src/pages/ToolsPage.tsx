import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterestCalculator } from '@/components/tools/InterestCalculator';
import { FMVLookup } from '@/components/tools/FMVLookup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function ToolsPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Forensic Billing Toolkit</h1>
            <p className="text-muted-foreground">
              Interactive tools to audit medical bills and interest rates based on Pennsylvania statutes.
            </p>
          </div>
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Privacy Notice</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400/80">
              All calculations are performed locally in your browser. Your financial data is never sent to our servers.
            </AlertDescription>
          </Alert>
          <Tabs defaultValue="interest" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="interest">Interest Audit</TabsTrigger>
              <TabsTrigger value="fmv">Fair Price Lookup</TabsTrigger>
            </TabsList>
            <TabsContent value="interest">
              <InterestCalculator />
            </TabsContent>
            <TabsContent value="fmv">
              <FMVLookup />
            </TabsContent>
          </Tabs>
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Legal Basis for Audit
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                <strong>PA Act 6 of 1974:</strong> Establishes a 6% maximum interest rate on many consumer debts. If a medical collection agency is charging 12-18%, they may be in violation of state law.
              </p>
              <p>
                <strong>Fair Market Value (FMV):</strong> While PA doesn't have a single price cap, "Balance Billing" protections and transparency laws allow patients to challenge bills that significantly exceed the 80th percentile of regional benchmarks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}