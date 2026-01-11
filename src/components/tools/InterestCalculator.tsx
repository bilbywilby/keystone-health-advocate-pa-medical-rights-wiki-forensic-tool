import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
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
    const interestAmount = total - principal;
    if (interestAmount <= 0) {
      setResult({ rate: 0, overcharge: 0, isIllegal: false });
      return;
    }
    // Simple annual interest approximation: (I / P) / (T/12)
    const annualRate = (interestAmount / principal) / (months / 12);
    const maxLegalInterest = principal * (0.06 * (months / 12));
    const overcharge = Math.max(0, interestAmount - maxLegalInterest);
    setResult({
      rate: annualRate * 100,
      overcharge,
      isIllegal: annualRate > 0.061 // Buffer for minor rounding
    });
  };
  const saveToVault = async () => {
    if (!result) return;
    await addToVault({
      type: 'Calculation',
      date: new Date().toISOString(),
      title: 'Interest Rate Audit',
      content: `Principal: $${originalDebt}\nCurrent: $${currentBalance}\nEstimated Rate: ${result.rate.toFixed(2)}%\nOvercharge: $${result.overcharge.toFixed(2)}`,
      metadata: { originalDebt, currentBalance, result }
    });
    toast.success('Saved to Privacy Vault');
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Interest Audit (Act 6)</CardTitle>
          <CardDescription>Detect predatory interest rates on medical collections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Original Debt Amount ($)</Label>
            <Input type="number" value={originalDebt} onChange={e => setOriginalDebt(e.target.value)} placeholder="e.g. 1000" />
          </div>
          <div className="space-y-2">
            <Label>Current Balance ($)</Label>
            <Input type="number" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} placeholder="e.g. 1200" />
          </div>
          <div className="space-y-2">
            <Label>Months Since First Bill</Label>
            <Input type="number" value={monthsElapsed} onChange={e => setMonthsElapsed(e.target.value)} placeholder="e.g. 12" />
          </div>
          <Button onClick={calculate} className="w-full">Calculate Audit</Button>
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
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-sm text-muted-foreground">Estimated Overcharge</div>
              <div className={`text-2xl font-bold ${result.overcharge > 0 ? 'text-red-600' : ''}`}>
                ${result.overcharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.isIllegal 
                ? "This interest rate appears to exceed the Pennsylvania Act 6 cap of 6% per annum. You may have grounds to dispute the entire interest portion of this bill."
                : "This interest rate is within the standard 6% cap permitted by PA Act 6 for non-mortgage consumer debts."}
            </p>
            <div className="flex gap-2">
              <Button onClick={saveToVault} variant="outline" className="flex-1">Save to Vault</Button>
              {result.isIllegal && (
                <Button className="flex-1 bg-red-600 hover:bg-red-700">Generate Dispute</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}