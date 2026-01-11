import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, WikiArticle } from "@shared/types";
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