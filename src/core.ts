import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SKIP = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next']);
export interface RepoMapEntry { path: string; symbols: string[]; }
export interface RepoMap { root: string; files: RepoMapEntry[]; }
export interface RepoMapOptions { maxFiles?: number; }

export async function buildRepoMap(root: string, { maxFiles = 500 }: RepoMapOptions = {}): Promise<RepoMap> {
  const out: RepoMapEntry[] = [];
  async function walk(dir: string): Promise<void> {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (out.length >= maxFiles) return;
      if (SKIP.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const rel = path.relative(root, full).replaceAll('\\', '/');
      if (entry.isDirectory()) {
        await walk(full);
      } else {
        let symbols: string[] = [];
        if (/\.(js|ts|tsx|jsx|py|rs|go)$/.test(entry.name)) {
          const text = (await readFile(full, 'utf8')).slice(0, 200000);
          symbols = [...text.matchAll(/(?:export\s+)?(?:async\s+)?(?:function|class|def|struct|interface|type)\s+([A-Za-z_][A-Za-z0-9_]*)/g)]
            .map((match) => match[1])
            .slice(0, 30);
        }
        out.push({ path: rel, symbols });
      }
    }
  }
  await walk(root);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return { root: path.basename(root), files: out };
}

export function renderRepoMap(map: RepoMap): string {
  return map.files.map((file) => `${file.path}${file.symbols.length ? ` :: ${file.symbols.join(', ')}` : ''}`).join('\n');
}
