import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildRepoMap } from '../src/core.js';

test('maps files and symbols deterministically', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'rm-'));
  await mkdir(path.join(dir, 'src'));
  await writeFile(path.join(dir, 'src/a.js'), 'export function hello(){}');
  const map = await buildRepoMap(dir);
  assert.equal(map.files[0].path, 'src/a.js');
  assert.deepEqual(map.files[0].symbols, ['hello']);
  await rm(dir, { recursive: true });
});
