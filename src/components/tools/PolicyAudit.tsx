import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, AlertCircle, TrendingUp, Landmark, Calculator, FileText, Zap } from 'lucide-react';
import { savePolicyAudit } from '@/lib/db';
import { toast } from 'sonner';
export function PolicyAudit() {
  const [policy, setPolicy] = useState({
    planName: '',
    deductible: 1500,
    moop: 5000,
    coinsurance: 20,
    ytdSpent: 0,
    premium: 450
  });
  const [exclusions, setExclusions] = useState([
    { name: 'Case Management Available', checked: true },
    { name: 'External Review Rights', checked: true },
    { name: 'Specialty Tier (Tier 4) Active', checked: false },
    { name: 'Step Therapy Mandated', checked: false }
  ]);
  const stats = useMemo(() => {
    const remainingDeductible = Math.max(0, policy.deductible - policy.ytdSpent);
    const remainingMOOP = Math.max(0, policy.moop - policy.ytdSpent);
    const deductibleTrap = policy.coinsurance > 30 && policy.deductible < 2000;
    const pharmacyROI = (policy.premium * 12) / (policy.moop || 1);
    return { remainingDeductible, remainingMOOP, deductibleTrap, pharmacyROI };
  }, [policy]);
  const handleSave = async () => {
    await savePolicyAudit({
      id: crypto.randomUUID(),
      planName: policy.planName || 'Unnamed Plan',
      deductible: policy.deductible,
      moop: policy.moop,
      coinsurance: policy.coinsurance,
      isPremiumShockRisk: stats.pharmacyROI > 1.5,
      exclusions: exclusions.filter(e => e.checked).map(e => e.name),
      ytdSpent: policy.ytdSpent,
      pharmacyROI: stats.pharmacyROI,
      timestamp: Date.now()
    });
    toast.success('Policy Audit saved to Vault');
  };
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Calculator className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">SBC Policy Decomposer</span>
            </div>
            <CardTitle>Policy Breakdown</CardTitle>
            <CardDescription>Enter values from your Summary of Benefits & Coverage (SBC).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input placeholder="e.g. Keystone Blue Silver" value={policy.planName} onChange={e => setPolicy({...policy, planName: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Deductible ($)</Label>
                <Input type="number" value={policy.deductible} onChange={e => setPolicy({...policy, deductible: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>OOP Max (MOOP) ($)</Label>
                <Input type="number" value={policy.moop} onChange={e => setPolicy({...policy, moop: Number(e.target.value)})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coinsurance (%)</Label>
                <Input type="number" value={policy.coinsurance} onChange={e => setPolicy({...policy, coinsurance: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>YTD Spent ($)</Label>
                <Input type="number" value={policy.ytdSpent} onChange={e => setPolicy({...policy, ytdSpent: Number(e.target.value)})} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="w-full bg-slate-900">Save Audit to ValleyDB</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Exclusion & Right Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exclusions.map((exc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                  <span className="text-sm font-medium">{exc.name}</span>
                  <input 
                    type="checkbox" 
                    checked={exc.checked} 
                    onChange={() => {
                      const next = [...exclusions];
                      next[idx].checked = !next[idx].checked;
                      setExclusions(next);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="bg-slate-900 text-white border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Policy Shield Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Remaining Deductible</div>
                <div className="text-2xl font-black">${stats.remainingDeductible.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Distance to MOOP</div>
                <div className="text-2xl font-black">${stats.remainingMOOP.toLocaleString()}</div>
              </div>
            </div>
            <div className="space-y-4">
              {stats.deductibleTrap && (
                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-red-400 uppercase">Deductible Trap Detected</div>
                    <p className="text-[10px] text-red-200/80 leading-relaxed">
                      Your coinsurance is high ({policy.coinsurance}%) despite a moderate deductible. Expect significant bills even after meeting the deductible.
                    </p>
                  </div>
                </div>
              )}
              <div className="p-4 bg-indigo-900/30 border border-indigo-500/50 rounded-xl flex items-start gap-3">
                <Zap className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-indigo-400 uppercase">Pharmacy ROI Metric</div>
                  <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                    Plan Cost Efficiency Score: <strong>{stats.pharmacyROI.toFixed(2)}</strong>. 
                    {stats.pharmacyROI > 1 ? " Premium costs are high relative to maximum out-of-pocket protection." : " Good balance of premium vs. protection."}
                  </p>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="text-slate-400 text-[10px] font-bold uppercase">Milestone</TableHead>
                  <TableHead className="text-slate-400 text-[10px] font-bold uppercase text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs">Deductible Utilization</TableCell>
                  <TableCell className="text-right font-bold text-emerald-400">
                    {Math.round((policy.ytdSpent / policy.deductible) * 100)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs">MOOP Completion</TableCell>
                  <TableCell className="text-right font-bold text-indigo-400">
                    {Math.round((policy.ytdSpent / policy.moop) * 100)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-2 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-slate-500 tracking-widest">AI Placeholder Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              All generated letters use [[DOUBLE_BRACKET]] placeholders. This allows local LLMs (like Gemini Nano) to easily scan and substitute your private vault data into final PDF exports without sending PII to the cloud.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}