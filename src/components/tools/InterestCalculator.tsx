import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
export function InterestCalculator() {
  const [originalDebt, setOriginalDebt] = useState<string>('');
  const [currentBalance, setCurrentBalance] = useState<string>('');
  const [monthsElapsed, setMonthsElapsed] = useState<string>('');
  const [result, setResult] = useState<{ rate: number; overcharge: number; isIllegal: boolean } | null>(null);
  const calculate = () => {
    const principal = parseFloat(originalDebt);
    const total = parseFloat(currentBalance);
    const months = parseFloat(monthsElapsed);
    if (isNaN(principal) || isNaN(total) || isNaN(months)) {
      toast.error('Please enter valid numbers');
      return;
    }
    if (months <= 0) {
      toast.error('Months elapsed must be at least 1 for rate calculation');
      return;
    }
    const interestAmount = total - principal;
    if (interestAmount <= 0) {
      setResult({ rate: 0, overcharge: 0, isIllegal: false });
      return;
    }
    // SB 371 (Louisa Carman Act) standard: 3% APR
    // Rate = (Interest / Principal) / (Months / 12)
    const annualRate = (interestAmount / principal) / (months / 12);
    const maxLegalInterest = principal * (0.03 * (months / 12));
    const overcharge = Math.max(0, interestAmount - maxLegalInterest);
    setResult({
      rate: annualRate * 100,
      overcharge,
      isIllegal: annualRate > 0.0305 // Flagging if strictly over 3.05%
    });
  };
  const saveToVault = async () => {
    if (!result) return;
    await addToVault({
      type: 'Calculation',
      date: new Date().toISOString(),
      title: 'Interest Rate Audit (SB 371)',
      content: `Principal: $${originalDebt}\nCurrent: $${currentBalance}\nEstimated Rate: ${result.rate.toFixed(2)}%\nLegal Limit: 3.0% (SB 371)\nEstimated Overcharge: $${result.overcharge.toFixed(2)}`,
      metadata: { originalDebt, currentBalance, result }
    });
    toast.success('Saved to Privacy Vault');
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">2026 Legal Standard</span>
          </div>
          <CardTitle>Interest Audit (SB 371)</CardTitle>
          <CardDescription>Detect illegal interest rates above the 3% cap set by the Louisa Carman Act.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Original Debt Amount ($)</Label>
            <Input type="number" value={originalDebt} onChange={e => setOriginalDebt(e.target.value)} placeholder="e.g. 1000" />
          </div>
          <div className="space-y-2">
            <Label>Current Balance ($)</Label>
            <Input type="number" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} placeholder="e.g. 1045" />
          </div>
          <div className="space-y-2">
            <Label>Months Since First Bill</Label>
            <Input type="number" value={monthsElapsed} onChange={e => setMonthsElapsed(e.target.value)} placeholder="e.g. 12" />
          </div>
          <Button onClick={calculate} className="w-full bg-slate-900 text-white">Calculate Audit</Button>
        </CardContent>
      </Card>
      {result && (
        <Card className={result.isIllegal ? 'border-red-200 bg-red-50/30' : 'border-emerald-200 bg-emerald-50/30'}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              {result.isIllegal ? <AlertCircle className="text-red-500" /> : <CheckCircle2 className="text-emerald-500" />}
              <span className={`font-bold ${result.isIllegal ? 'text-red-700' : 'text-emerald-700'}`}>
                {result.isIllegal ? 'Potential Violation Detected' : 'Within Legal Limits'}
              </span>
            </div>
            <CardTitle className="text-4xl font-extrabold">
              {result.rate.toFixed(1)}% <span className="text-sm font-normal text-muted-foreground">APR</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white rounded-lg border shadow-sm dark:bg-slate-950">
              <div className="text-sm text-muted-foreground">Estimated Overcharge (vs 3% limit)</div>
              <div className={`text-2xl font-bold ${result.overcharge > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                ${result.overcharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {result.isIllegal
                ? "This rate exceeds the 3% cap mandated by PA SB 371 (The Louisa Carman Act). Any interest charged above 3% is likely illegal and subject to triple-damage recovery under state consumer protection laws."
                : "This interest rate is within the legal 3% ceiling established for PA medical debt in 2026."}
            </p>
            <div className="flex gap-2">
              <Button onClick={saveToVault} variant="outline" className="flex-1">Save to Vault</Button>
              {result.isIllegal && (
                <Button asChild className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                   <button onClick={() => toast.info('Navigating to Appeal Generator...')}>Generate Dispute</button>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}