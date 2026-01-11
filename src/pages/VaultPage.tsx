import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getVaultItems, deleteVaultItem, VaultItem } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Download, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
export function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const data = await getVaultItems();
    setItems(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const handleDelete = async (id: string) => {
    await deleteVaultItem(id);
    toast.success('Record deleted from local storage');
    load();
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">My Privacy Vault</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Lock className="w-4 h-4" /> Locally stored advocacy records. No data leaves your device.
              </p>
            </div>
            <Badge variant="outline" className="h-fit py-1 px-3 bg-emerald-50 text-emerald-700 border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1" /> HIPAA-Safe Local-First
            </Badge>
          </div>
          {items.length === 0 && !loading ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium">Your Vault is Empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                Calculations and generated dispute letters will appear here once you save them.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <Card key={item.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] uppercase">{item.type}</Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(item.date), 'MMM d, yyyy')}</span>
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toast.info('Export coming soon')}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded border font-mono whitespace-pre-wrap text-muted-foreground">
                      {item.content}
                    </pre>
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