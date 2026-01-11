import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import type { Provider } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ShieldCheck, ShieldAlert, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
export function DirectoryPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [zip, setZip] = useState('');
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const url = `/api/providers?query=${encodeURIComponent(query)}&zip=${encodeURIComponent(zip)}`;
        const data = await api<Provider[]>(url);
        setProviders(data);
      } catch (error) {
        console.error('Failed to fetch providers', error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProviders, 300);
    return () => clearTimeout(timer);
  }, [query, zip]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">PA Provider Directory</h1>
            <p className="text-muted-foreground">
              Search Pennsylvania healthcare facilities and track their compliance with Price Transparency laws.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search facility name (e.g. UPMC, AHN)..." 
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Input 
                placeholder="Zip Code" 
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground">No facilities found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p) => (
                <Card key={p.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-[10px] uppercase">{p.type}</Badge>
                      {p.isCompliant ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Compliant
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Non-Compliant
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {p.city}, PA {p.zip}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium mr-2">Transparency Rating:</span>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < p.transparencyRating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">
                        Rating based on timeliness of machine-readable file updates and accessibility of shoppable services list.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}