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
      { name: 'Fair Value', value: benchmark.fmv, color: '#10b981' },
      { name: 'PA Average', value: benchmark.avg, color: '#f59e0b' },
      { name: 'Your Bill', value: billedVal, color: billedVal > benchmark.avg ? '#ef4444' : '#6366f1' },
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
            <Button onClick={handleLookup} disabled={!MOCK_CPT_DATA[cpt]}>Compare Prices</Button>
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
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis prefix="$" />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Alert className={parseFloat(billed) > MOCK_CPT_DATA[cpt].avg ? 'border-red-200' : 'border-emerald-200'}>
              <TrendingDown className="h-4 w-4" />
              <AlertTitle>Audit Result</AlertTitle>
              <AlertDescription className="text-sm">
                Your bill is {((parseFloat(billed) / MOCK_CPT_DATA[cpt].fmv) * 100).toFixed(0)}% of the Fair Market Value.
              </AlertDescription>
            </Alert>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                Advocacy Strategy
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cite the <strong>Fair Market Value</strong> benchmarks in your appeal. Hospitals are often willing to settle for 150-200% of Medicare rates, which typically aligns with our "Fair Value" metric.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}