import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, WikiArticle, Provider } from "@shared/types";
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
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
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