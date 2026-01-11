import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterestCalculator } from '@/components/tools/InterestCalculator';
import { FMVLookup } from '@/components/tools/FMVLookup';
import { PricingContribution } from '@/components/tools/PricingContribution';
import { FinancialDefense } from '@/components/tools/FinancialDefense';
import { PremiumNavigator } from '@/components/tools/PremiumNavigator';
import { PharmacyAuditor } from '@/components/tools/PharmacyAuditor';
import { MedicaidGuard } from '@/components/tools/MedicaidGuard';
import { PolicyAudit } from '@/components/tools/PolicyAudit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info, ShieldCheck, Zap, Pill, Heart, FileSearch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSearchParams } from 'react-router-dom';
export function ToolsPage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'policy-audit';
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight">Forensic Advocacy Toolkit</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                2026 PA Financial Defense Suite. Audit policies, track pharmacy rebates, and protect Medicaid coverage.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Zap className="w-4 h-4 text-indigo-500" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Act 77 & HB 79 Active</div>
            </div>
          </div>
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 max-w-2xl">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Privacy Notice</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400/80">
              All audits and work logs are stored locally. Your sensitive data never leaves your device. HIPAA-compliant by design.
            </AlertDescription>
          </Alert>
        </section>
        <Tabs defaultValue={defaultTab} className="space-y-8">
          <div className="overflow-x-auto pb-2">
            <TabsList className="flex w-max md:w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 h-auto bg-transparent">
              <TabsTrigger value="policy-audit" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border shrink-0">
                <FileSearch className="w-3 h-3 mr-2" /> Policy Audit
              </TabsTrigger>
              <TabsTrigger value="defense" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border shrink-0">Defense</TabsTrigger>
              <TabsTrigger value="pharmacy" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white border shrink-0"><Pill className="w-3 h-3 mr-2" /> Pharmacy</TabsTrigger>
              <TabsTrigger value="medicaid" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white border shrink-0"><Heart className="w-3 h-3 mr-2" /> Medicaid</TabsTrigger>
              <TabsTrigger value="pennie" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border shrink-0">Premiums</TabsTrigger>
              <TabsTrigger value="fmv" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border shrink-0">Prices</TabsTrigger>
              <TabsTrigger value="interest" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border shrink-0">Interest</TabsTrigger>
              <TabsTrigger value="contribute" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border shrink-0">Share</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="policy-audit">
            <PolicyAudit />
          </TabsContent>
          <TabsContent value="defense">
            <FinancialDefense />
          </TabsContent>
          <TabsContent value="pharmacy">
            <PharmacyAuditor />
          </TabsContent>
          <TabsContent value="medicaid">
            <MedicaidGuard />
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
              <p><strong>Act 77 (Pharmacy Transparency):</strong> Enforced. PBMs must pass through rebates and honor "Lesser Of" pricing at point-of-sale.</p>
              <p><strong>HB 79 (Financial Assistance):</strong> Enforced. Hospitals must offer assistance if debt exceeds 5% of income or income is below 400% FPL.</p>
              <p><strong>Act 146 (Clinical Review):</strong> Enforced. Denials must be signed by a specialty-match physician. Request reviewer credentials in every appeal.</p>
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
              If a PBM refuses an Act 77 audit or a hospital blocks HB 79 screening, contact the <strong>PA Insurance Department</strong> at 1-877-881-6388. Use the [[DOUBLE_BRACKET]] placeholders in your letters to ensure Gemini compatibility.
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}