import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, Landmark, Zap, Gavel, Search } from 'lucide-react';
import { calculateFPLStatus, checkSB752Eligibility } from '@/lib/calculations';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
const HOSPITALS = [
  { name: 'UPMC Presbyterian', isNonProfit: true },
  { name: 'Allegheny General', isNonProfit: true },
  { name: 'Main Line Health', isNonProfit: true },
  { name: 'St. Mary Medical Center', isNonProfit: true }
];
export function FinancialDefense() {
  const [income, setIncome] = useState('');
  const [household, setHousehold] = useState('1');
  const [debt, setDebt] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[0]);
  const fpl = useMemo(() =>
    calculateFPLStatus(Number(income) || 0, Number(household), Number(debt) || 0),
    [income, household, debt]
  );
  const sb752 = useMemo(() => 
    checkSB752Eligibility(selectedHospital.isNonProfit, Number(debt) || 0),
    [selectedHospital, debt]
  );
  const saveHB79Request = async () => {
    const letter = `Subject: Mandatory Financial Assistance Screening Request (HB 79 / SB 752)
Dear Billing Department at ${selectedHospital.name},
Under PA HB 79 and the non-profit debt-block provisions of SB 752, I am requesting a formal screening for financial assistance.
As my debt exceeds 5% of my household income or my income is below 400% FPL, state law mandates a collection stay during this review.
Please pause all interest accrual and collection activities immediately.`;
    await addToVault({
      type: 'Letter',
      date: new Date().toISOString(),
      title: `HB 79/SB 752 Demand - ${selectedHospital.name}`,
      content: letter
    });
    toast.success('SB 752 Legal Demand saved to Vault');
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="border-slate-200 flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Landmark className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">HB 79 Auditor</span>
          </div>
          <CardTitle>Financial Assistance & SB 752</CardTitle>
          <CardDescription>Screening mandates for non-profit PA hospitals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <div className="space-y-2">
            <Label>Select Facility</Label>
            <select 
              className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
              onChange={(e) => setSelectedHospital(HOSPITALS.find(h => h.name === e.target.value) || HOSPITALS[0])}
            >
              {HOSPITALS.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
            </select>
          </div>
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
              <div className="flex items-center gap-2 font-bold mb-1 text-sm">
                {fpl.isEligible ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {fpl.isEligible ? 'Eligible for Mandatory Assistance' : 'Standard Hardship Only'}
              </div>
              <p className="text-[10px] leading-tight opacity-80">{fpl.reason || 'Consider SB 752 protection if collections are active.'}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveHB79Request} className="w-full bg-slate-900 text-white" disabled={!fpl.isEligible}>
            <FileText className="w-4 h-4 mr-2" /> Generate Cease & Desist
          </Button>
        </CardFooter>
      </Card>
      <Card className="border-slate-200 bg-amber-50/30 flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Louisa Carman Protection</span>
          </div>
          <CardTitle>Credit Reporting & Liens</CardTitle>
          <CardDescription>SB 371 specific rules for medical debt under $500.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
           <div className="p-4 bg-white rounded-xl border shadow-sm space-y-4 dark:bg-slate-950">
              <div className="flex justify-between items-start text-sm">
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> Credit Shield</div>
                  <div className="text-[10px] text-muted-foreground">Debt under $500 cannot be reported.</div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-start text-sm">
                <div className="space-y-0.5">
                  <div className="font-bold">Primary Residence Lien Ban</div>
                  <div className="text-[10px] text-muted-foreground">No liens for debt &lt; $10k (SB 371).</div>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700">ENFORCED</Badge>
              </div>
           </div>
           <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 pl-3 border-amber-300">
             "FCEUA Protections: Creditors must provide a 30-day notice before any adverse credit reporting, and must verify the 3% interest cap has been honored."
           </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full border-amber-200 bg-white hover:bg-amber-100 text-xs">
            <Gavel className="w-3 h-3 mr-2" /> FCEUA Verification Letter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}