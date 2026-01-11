import Dexie, { type Table } from 'dexie';
export interface VaultItem {
  id: string;
  type: 'EOB' | 'Letter' | 'Calculation' | 'Record';
  date: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}
export interface BillingRecord {
  id: string;
  provider: string;
  amount: number;
  date: string;
  status: 'pending' | 'disputed' | 'resolved';
  cptCode?: string;
}
export class ValleyDB extends Dexie {
  vault!: Table<VaultItem>;
  billingRecords!: Table<BillingRecord>;
  constructor() {
    super('ValleyDB');
    this.version(1).stores({
      vault: 'id, type, date, title',
      billingRecords: 'id, provider, date, status'
    });
  }
}
export const db = new ValleyDB();
export async function addToVault(item: Omit<VaultItem, 'id'>) {
  const id = crypto.randomUUID();
  await db.vault.add({ ...item, id });
  return id;
}
export async function getVaultItems() {
  return db.vault.orderBy('date').reverse().toArray();
}
export async function deleteVaultItem(id: string) {
  return db.vault.delete(id);
}