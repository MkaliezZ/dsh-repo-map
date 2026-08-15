import { buildRepoMap, renderRepoMap } from './core.js';

interface CommandContext {
  command?: (name: string, handler: (...args: string[]) => unknown | Promise<unknown>) => unknown;
}
interface RepoMapPluginOptions { root?: string; }

export function registerRepoMap(ctx: CommandContext, { root = process.cwd() }: RepoMapPluginOptions = {}): void {
  ctx.command?.('repo-map', async () => renderRepoMap(await buildRepoMap(root)));
}
