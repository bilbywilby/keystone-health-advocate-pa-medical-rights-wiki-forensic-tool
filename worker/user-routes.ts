import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, WikiEntity, ProviderEntity, PriceBenchmarkEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
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
  // PROVIDERS
  app.get('/api/providers', async (c) => {
    await ProviderEntity.ensureSeed(c.env);
    const query = c.req.query('query');
    const zip = c.req.query('zip');
    const providers = await ProviderEntity.search(c.env, query, zip);
    return ok(c, providers);
  });
  // BENCHMARKS
  app.get('/api/benchmarks/stats', async (c) => {
    await PriceBenchmarkEntity.ensureSeed(c.env);
    const stats = await PriceBenchmarkEntity.getGlobalStats(c.env);
    return ok(c, stats);
  });
  app.get('/api/benchmarks/:cpt', async (c) => {
    await PriceBenchmarkEntity.ensureSeed(c.env);
    const stats = await PriceBenchmarkEntity.getStatsForCode(c.env, c.req.param('cpt'));
    if (!stats) return notFound(c, 'No data for this CPT code');
    return ok(c, stats);
  });
  app.post('/api/benchmarks/submit', async (c) => {
    const body = await c.req.json();
    if (!body.cptCode || !body.billedAmount || !body.zip) {
      return bad(c, 'Missing required fields');
    }
    const point = {
      id: crypto.randomUUID(),
      cptCode: body.cptCode,
      amount: body.billedAmount,
      zipPrefix: body.zip.substring(0, 3),
      facilityType: body.facilityType || 'Hospital',
      timestamp: Date.now()
    };
    await PriceBenchmarkEntity.create(c.env, point);
    return ok(c, { message: 'Submission received and sanitized' });
  });
  // USERS / CHATS (Legacy/Boilerplate support)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
}