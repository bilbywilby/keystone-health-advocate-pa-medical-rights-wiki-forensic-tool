import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { calculatePremiumShock } from '@/lib/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
export function PremiumNavigator() {
  const [income, setIncome] = useState(55000);
  const [p25, setP25] = useState(150);
  const [p26, setP26] = useState(280);
  const shock = calculatePremiumShock(income, p25, p26);
  const data = [
    { name: '2025 Cost', value: p25, color: '#10b981' },
    { name: '2026 Cost', value: p26, color: shock.isUnaffordable ? '#ef4444' : '#f59e0b' }
  ];
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pennie Premium Shock Navigator</CardTitle>
          <CardDescription>Analyze the impact of 2026 subsidy changes on your net costs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <label>Annual Income: ${income.toLocaleString()}</label>
                <span className="text-muted-foreground">8.5% Threshold: ${(income * 0.085 / 12).toFixed(0)}/mo</span>
              </div>
              <Slider value={[income]} onValueChange={v => setIncome(v[0])} min={15000} max={150000} step={1000} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">Income Share</span>
                <div className="text-2xl font-black">{shock.incomePercent.toFixed(1)}%</div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (shock.incomePercent / 10) * 100)}%` }} />
                </div>
              </div>
              <div className={`p-4 rounded-xl border space-y-2 ${shock.isUnaffordable ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className="text-xs font-bold text-muted-foreground uppercase">Affordability Status</span>
                <div className={`text-2xl font-black ${shock.isUnaffordable ? 'text-red-700' : 'text-emerald-700'}`}>
                  {shock.isUnaffordable ? 'Unaffordable' : 'Healthy Range'}
                </div>
                {shock.isUnaffordable && <div className="text-[10px] text-red-600 font-bold">Hardship Exemption Eligible</div>}
              </div>
            </div>
          </div>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Q1 Deductible Burn Advisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'MRI (72148)', roi: 'High', burn: 82 },
                { label: 'Colonoscopy (45378)', roi: 'Medium', burn: 45 },
                { label: 'Specialist Lab (Act 1754)', roi: 'High', burn: 91 }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant={item.roi === 'High' ? 'default' : 'secondary'}>{item.roi} ROI</Badge>
                    <span className="text-xs font-bold text-amber-600">{item.burn}% Burn</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Live Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm">2026 Credits Active</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              If your 2026 premium exceeds 8.5% of income, you are exempt from the individual mandate and qualify for a 
              <strong> Hardship Certificate</strong> via Pennie.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}