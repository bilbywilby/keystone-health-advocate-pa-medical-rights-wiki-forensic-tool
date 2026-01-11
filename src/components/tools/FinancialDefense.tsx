import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, Landmark, ArrowRight, Zap } from 'lucide-react';
import { calculateFPLStatus, calculateSB371Audit } from '@/lib/calculations';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
export function FinancialDefense() {
  const [income, setIncome] = useState('');
  const [household, setHousehold] = useState('1');
  const [debt, setDebt] = useState('');

  const fpl = React.useMemo(() => 
    calculateFPLStatus(Number(income) || 0, Number(household), Number(debt) || 0),
    [income, household, debt]
  );
  const saveHB79Request = async () => {
    const letter = `Subject: Mandatory Financial Assistance Screening Request (HB 79)
Dear Billing Department,
Under PA HB 79, I am requesting a formal screening for financial assistance before any further collection actions are taken. 
My household size is ${household} and I am invoking my right to a 400% FPL eligibility review as mandated by state law.`;
    await addToVault({
      type: 'Letter',
      date: new Date().toISOString(),
      title: 'HB 79 Assistance Demand',
      content: letter
    });
    toast.success('HB 79 Demand saved to Vault');
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="border-slate-200 flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Landmark className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">HB 79 Auditor</span>
          </div>
          <CardTitle>Financial Assistance Screener</CardTitle>
          <CardDescription>Pennsylvania hospitals must screen you before pursuing debt if income < 400% FPL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <div className="space-y-2">
            <Label>Annual Household Income ($)</Label>
            <Input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 45000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Family Size</Label>
              <Input type="number" value={household} onChange={e => setHousehold(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Total Medical Debt</Label>
              <Input type="number" value={debt} onChange={e => setDebt(e.target.value)} />
            </div>
          </div>
          {income && (
            <div className={`p-4 rounded-xl border-2 transition-all ${fpl.isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {fpl.isEligible ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {fpl.isEligible ? 'Eligible for Mandatory Assistance' : 'Outside Automatic Threshold'}
              </div>
              <p className="text-[10px] leading-tight opacity-80">{fpl.reason || 'You may still apply based on special hardship circumstances.'}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveHB79Request} className="w-full bg-slate-900 text-white" disabled={!fpl.isEligible}>
            <FileText className="w-4 h-4 mr-2" /> Generate HB 79 Demand
          </Button>
        </CardFooter>
      </Card>
      <Card className="border-slate-200 bg-amber-50/30 flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">SB 371 Shield Suite</span>
          </div>
          <CardTitle>Interest & Garnishment Defense</CardTitle>
          <CardDescription>The Louisa Carman Act protections for PA residents in 2026.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
           <div className="p-4 bg-white rounded-xl border shadow-sm space-y-3 dark:bg-slate-950">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-500" /> Legal Interest Cap
                </span>
                <span className="font-bold text-emerald-600">3.0%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Garnishment Protection</span>
                <span className="font-bold text-indigo-600">600% FPL</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Credit Report Trigger</span>
                <span className="font-bold text-amber-600">$500 Min</span>
              </div>
           </div>
           <p className="text-xs text-muted-foreground leading-relaxed">
             Under SB 371, wage garnishment is prohibited for households below 600% FPL. Medical interest is capped at 3% for all residents regardless of income.
           </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-[10px] text-muted-foreground text-center mb-1">Verify your debt interest matches the new 3% law</p>
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1 text-xs border-amber-200 bg-white hover:bg-amber-100">
              Audit Interest
            </Button>
            <Button variant="outline" className="flex-1 text-xs border-amber-200 bg-white hover:bg-amber-100">
              Hardship Form
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}