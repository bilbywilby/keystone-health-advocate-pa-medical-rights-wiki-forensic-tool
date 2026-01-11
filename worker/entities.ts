import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, WikiArticle, Provider, PricePoint, CommunityStats, BenchmarkStats } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
import { MOCK_WIKI_ARTICLES } from "../src/lib/wiki-content";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
}
export class WikiEntity extends IndexedEntity<WikiArticle> {
  static readonly entityName = "wiki";
  static readonly indexName = "wiki_articles";
  static readonly initialState: WikiArticle = {
    id: "", slug: "", title: "", content: "",
    category: "Regulatory" as any, lastUpdated: "", excerpt: ""
  };
  static seedData = MOCK_WIKI_ARTICLES;
  static async findBySlug(env: any, slug: string): Promise<WikiArticle | null> {
    const { items } = await this.list(env);
    return items.find(a => a.slug === slug) ?? null;
  }
}
export class ProviderEntity extends IndexedEntity<Provider> {
  static readonly entityName = "provider";
  static readonly indexName = "providers";
  static readonly initialState: Provider = {
    id: "", name: "", city: "", zip: "", transparencyRating: 0, isCompliant: false, type: 'Hospital'
  };
  static seedData: Provider[] = [
    { id: "p1", name: "UPMC Presbyterian", city: "Pittsburgh", zip: "15213", transparencyRating: 4, isCompliant: true, type: 'Hospital' },
    { id: "p2", name: "Allegheny General Hospital (AHN)", city: "Pittsburgh", zip: "15212", transparencyRating: 3, isCompliant: true, type: 'Hospital' },
    { id: "p3", name: "Geisinger Medical Center", city: "Danville", zip: "17822", transparencyRating: 5, isCompliant: true, type: 'Hospital' },
    { id: "p4", name: "Hospital of the University of Pennsylvania", city: "Philadelphia", zip: "19104", transparencyRating: 2, isCompliant: false, type: 'Hospital' },
    { id: "p5", name: "Lehigh Valley Hospital", city: "Allentown", zip: "18103", transparencyRating: 4, isCompliant: true, type: 'Hospital' }
  ];
  static async search(env: any, query?: string, zip?: string): Promise<Provider[]> {
    const { items } = await this.list(env);
    return items.filter(p => {
      const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
      const matchZip = !zip || p.zip.startsWith(zip);
      return matchQuery && matchZip;
    });
  }
}
export class PriceBenchmarkEntity extends IndexedEntity<PricePoint> {
  static readonly entityName = "benchmark";
  static readonly indexName = "benchmarks";
  static readonly initialState: PricePoint = {
    id: "", cptCode: "", amount: 0, zipPrefix: "", facilityType: "", timestamp: 0
  };
  static seedData: PricePoint[] = [
    { id: "b1", cptCode: "99213", amount: 110, zipPrefix: "152", facilityType: "Clinic", timestamp: Date.now() },
    { id: "b2", cptCode: "99213", amount: 95, zipPrefix: "152", facilityType: "Clinic", timestamp: Date.now() },
    { id: "b3", cptCode: "70551", amount: 820, zipPrefix: "191", facilityType: "Hospital", timestamp: Date.now() },
    { id: "b4", cptCode: "70551", amount: 480, zipPrefix: "191", facilityType: "Imaging Center", timestamp: Date.now() },
    { id: "b5", cptCode: "45378", amount: 1150, zipPrefix: "178", facilityType: "Hospital", timestamp: Date.now() }
  ];
  static async getStatsForCode(env: any, cptCode: string): Promise<BenchmarkStats | null> {
    const { items } = await this.list(env);
    const filtered = items.filter(i => i.cptCode === cptCode);
    if (filtered.length === 0) return null;
    const amounts = filtered.map(f => f.amount).sort((a, b) => a - b);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const median = amounts[Math.floor(amounts.length / 2)];
    const fmv = amounts[0] * 1.1; 
    return { 
      avg, 
      median, 
      fmv, 
      count: filtered.length,
      confidence: filtered.length >= 5 ? 'High' : 'Low'
    };
  }
  static async getGlobalStats(env: any): Promise<CommunityStats> {
    const { items } = await this.list(env);
    return {
      totalAudited: items.length * 4,
      totalSavingsIdentified: items.length * 1250,
      contributorCount: items.length,
      legislativePulse: [
        { label: "HB 79 Screening", status: "Enforced", impact: "Mandatory assistance check" },
        { label: "SB 371 Interest Cap", status: "Active", impact: "3% ceiling on medical debt" },
        { label: "Act 146 Enforcement", status: "Enforced", impact: "Specialty match required" }
      ]
    };
  }
}