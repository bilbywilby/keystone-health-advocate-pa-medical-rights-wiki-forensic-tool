import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, AlertTriangle, CheckCircle2, Copy, Zap, Info } from 'lucide-react';
import { calculatePBMSavings } from '@/lib/calculations';
import { toast } from 'sonner';
const MOCK_DRUGS = [
  { name: 'Humira (40mg)', ndc: '00074-3799', cash: 6200, tier: 4 },
  { name: 'Ozempic (1mg)', ndc: '0169-4132', cash: 950, tier: 4 },
  { name: 'Atorvastatin (20mg)', ndc: '00071-0156', cash: 12, tier: 1 },
  { name: 'Advair Diskus', ndc: '00173-0719', cash: 320, tier: 3 }
];
export function PharmacyAuditor() {
  const [query, setQuery] = useState('');
  const [copay, setCopay] = useState('');
  const [selected, setSelected] = useState<typeof MOCK_DRUGS[0] | null>(null);
  const results = selected ? calculatePBMSavings(Number(copay), selected.cash, selected.tier) : null;
  const copyScript = () => {
    const text = `I am inquiring about compliance with PA Act 77 regarding this prescription (${selected?.name}). Act 77 requires PBM transparency. My copay is $${copay}, which appears to exceed the net cash price after statutory rebate pass-throughs. Please verify the "Lesser Of" pricing and rebate credit for this claim.`;
    navigator.clipboard.writeText(text);
    toast.success('Pharmacist script copied');
  };
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Pill className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Act 77 Transparency</span>
            </div>
            <CardTitle>Prescription PBM Audit</CardTitle>
            <CardDescription>Detect hidden PBM markups and verify rebate pass-throughs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Medication (NDC or Name)</Label>
              <div className="relative">
                <Input 
                  placeholder="e.g. Humira or 00074..." 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                />
                {query.length > 1 && !selected && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                    {MOCK_DRUGS.filter(d => d.name.toLowerCase().includes(query.toLowerCase())).map(d => (
                      <button 
                        key={d.ndc} 
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                        onClick={() => { setSelected(d); setQuery(d.name); }}
                      >
                        {d.name} (NDC: {d.ndc})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Copay Amount ($)</Label>
              <Input type="number" value={copay} onChange={e => setCopay(e.target.value)} placeholder="e.g. 50" />
            </div>
            {selected && (
              <div className="p-3 bg-slate-50 rounded-lg border flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Tier {selected.tier} Medication</span>
                <Badge variant="outline" className="text-[10px]">{selected.ndc}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
        {results && (
          <Card className={results.isOvercharged ? 'border-amber-200 bg-amber-50/30' : 'border-emerald-200 bg-emerald-50/30'}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {results.isOvercharged ? <AlertTriangle className="text-amber-600" /> : <CheckCircle2 className="text-emerald-500" />}
                <span className="font-bold text-sm">
                  {results.isOvercharged ? 'Optimization Identified' : 'Optimal Pricing'}
                </span>
              </div>
              <CardTitle className="text-3xl font-black">
                ${results.potentialSavings.toFixed(2)} <span className="text-xs font-normal text-muted-foreground uppercase">Est. Monthly Loss</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-white border rounded-lg">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Cash Price</div>
                  <div className="text-sm font-bold">${selected?.cash}</div>
                </div>
                <div className="p-3 bg-white border rounded-lg">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Est. Rebate</div>
                  <div className="text-sm font-bold text-emerald-600">-${results.estimatedRebate.toFixed(2)}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {results.isOvercharged 
                  ? "Act 77 requires PBMs to pass through a portion of manufacturer rebates to the consumer at the point of sale for specialty drugs. Your copay exceeds the estimated net cost."
                  : "Your copay is currently below the estimated cash and rebate-adjusted price for this medication."}
              </p>
              <Button onClick={copyScript} className="w-full bg-slate-900 text-white" disabled={!results.isOvercharged}>
                <Copy className="w-4 h-4 mr-2" /> Copy Pharmacist Script
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row gap-6 items-center">
        <Zap className="w-12 h-12 text-amber-500 flex-shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold uppercase tracking-widest">Act 77 "Lesser Of" Clause</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            In Pennsylvania, pharmacists are prohibited from charging a copay that exceeds the cash price of the drug. If you encounter a "Clawback" where the copay is $50 but the cash price is $15, the pharmacy MUST charge you the lower $15.
          </p>
        </div>
      </div>
    </div>
  );
}