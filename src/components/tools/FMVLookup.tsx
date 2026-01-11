import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, TrendingDown } from 'lucide-react';
const MOCK_CPT_DATA: Record<string, { name: string; fmv: number; avg: number }> = {
  '99213': { name: 'Office Visit (Level 3)', fmv: 95, avg: 115 },
  '70551': { name: 'MRI Brain w/o Contrast', fmv: 450, avg: 850 },
  '45378': { name: 'Colonoscopy (Diagnostic)', fmv: 650, avg: 1200 },
  '90686': { name: 'Flu Vaccine', fmv: 25, avg: 40 },
};
export function FMVLookup() {
  const [cpt, setCpt] = useState('');
  const [billed, setBilled] = useState('');
  const [data, setData] = useState<any[] | null>(null);
  const handleLookup = () => {
    const benchmark = MOCK_CPT_DATA[cpt];
    if (!benchmark) return;
    const billedVal = parseFloat(billed);
    setData([
      { name: 'Fair Value', value: benchmark.fmv, color: '#f59e0b' }, // Amber
      { name: 'PA Average', value: benchmark.avg, color: '#64748b' }, // Slate
      { name: 'Your Bill', value: billedVal, color: billedVal > benchmark.avg ? '#ef4444' : '#0f172a' },
    ]);
  };
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Fair Market Value Audit</CardTitle>
          <CardDescription>Compare your billed amounts against PA regional benchmarks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>CPT Code</Label>
              <Input placeholder="e.g. 70551" value={cpt} onChange={e => setCpt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Billed Amount ($)</Label>
              <Input type="number" placeholder="e.g. 1500" value={billed} onChange={e => setBilled(e.target.value)} />
            </div>
            <Button onClick={handleLookup} disabled={!MOCK_CPT_DATA[cpt] || !billed}>Compare Prices</Button>
          </div>
          {!MOCK_CPT_DATA[cpt] && cpt.length >= 5 && (
            <p className="text-xs text-amber-600 mt-2">Code not in database yet. Try 70551 or 99213.</p>
          )}
        </CardContent>
      </Card>
      {data && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Price Comparison for {MOCK_CPT_DATA[cpt].name}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value}`, 'Amount']} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Alert className={parseFloat(billed) > MOCK_CPT_DATA[cpt].avg ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50'}>
              <TrendingDown className="h-4 w-4" />
              <AlertTitle>Audit Result</AlertTitle>
              <AlertDescription className="text-sm">
                Your bill is {((parseFloat(billed) / MOCK_CPT_DATA[cpt].fmv) * 100).toFixed(0)}% of the Fair Market Value benchmark.
              </AlertDescription>
            </Alert>
            <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-500" />
                Advocacy Strategy
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                In PA, hospitals often settle for 150-200% of Medicare rates. Cite this "Fair Market Value" benchmark to demand a settlement review from the hospital ombudsman.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}