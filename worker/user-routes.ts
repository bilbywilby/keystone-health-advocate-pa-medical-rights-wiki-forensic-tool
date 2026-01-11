import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, WikiEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Keystone Health Advocate API' }}));
  // WIKI
  app.get('/api/wiki', async (c) => {
    await WikiEntity.ensureSeed(c.env);
    const page = await WikiEntity.list(c.env);
    return ok(c, page.items);
  });
  app.get('/api/wiki/:slug', async (c) => {
    const article = await WikiEntity.findBySlug(c.env, c.req.param('slug'));
    if (!article) return notFound(c, 'Article not found');
    return ok(c, article);
  });
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const page = await ChatBoardEntity.list(c.env);
    return ok(c, page);
  });
}