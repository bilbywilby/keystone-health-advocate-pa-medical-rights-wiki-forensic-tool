import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, Landmark } from 'lucide-react';
import { calculateFPLStatus, calculateSB371Audit } from '@/lib/calculations';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
export function FinancialDefense() {
  const [income, setIncome] = useState('');
  const [household, setHousehold] = useState('1');
  const [debt, setDebt] = useState('');
  const fpl = calculateFPLStatus(Number(income) || 0, Number(household), Number(debt) || 0);
  const audit = calculateSB371Audit(Number(debt) || 0, 12, 12); // Sample 12% rate for comparison
  const saveHB79Request = async () => {
    const letter = `Subject: Mandatory Financial Assistance Screening Request (HB 79)
Dear Billing Department,
Under PA HB 79, I am requesting a formal screening for financial assistance before any further collection actions are taken. 
My household size is ${household} and I am invoking my right to a 400% FPL eligibility review.`;
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
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Landmark className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">HB 79 Auditor</span>
          </div>
          <CardTitle>Financial Assistance Screener</CardTitle>
          <CardDescription>Pennsylvania hospitals must screen you before pursuing debt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className={`p-4 rounded-xl border-2 ${fpl.isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {fpl.isEligible ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {fpl.isEligible ? 'Eligible for Mandatory Assistance' : 'Outside Automatic Threshold'}
              </div>
              <p className="text-xs">{fpl.reason || 'You can still apply for hardship exceptions.'}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveHB79Request} className="w-full bg-slate-900" disabled={!fpl.isEligible}>
            <FileText className="w-4 h-4 mr-2" /> Generate HB 79 Demand
          </Button>
        </CardFooter>
      </Card>
      <Card className="border-slate-200 bg-amber-50/30">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">SB 371 Medical Debt Shield</span>
          </div>
          <CardTitle>Interest & Garnishment Defense</CardTitle>
          <CardDescription>Louisa Carman Act (SB 371) protections for 2026.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="p-4 bg-white rounded-xl border shadow-sm space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Legal Interest Cap</span>
                <span className="font-bold text-emerald-600">3.0%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Garnishment Protection</span>
                <span className="font-bold text-indigo-600">600% FPL</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Credit Report Limit</span>
                <span className="font-bold text-amber-600">$500 Min</span>
              </div>
           </div>
           <p className="text-xs text-muted-foreground leading-relaxed">
             Under the Louisa Carman Act, wage garnishment is blocked for households under 600% FPL. Interest on all PA medical debt is now capped at 3%.
           </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1 text-xs">Interest Audit</Button>
          <Button variant="outline" className="flex-1 text-xs">Hardship Affidavit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}