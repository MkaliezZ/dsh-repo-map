import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { apply } from '../src/plugin.js'

type Handler = (invocation: { rawInput?: string }) => Promise<{ kind: string; text: string }>

function capture() {
  const commands: Record<string, Handler> = {}
  apply({ commands: { register: (d: { name: string; handler: Handler }) => { commands[d.name] = d.handler } } } as never)
  return commands
}

test('repo-map maps a directory and lists symbols', async () => {
  const dir = await mkdtemp(path.join(process.cwd(), '.repo-map-test-'))
  try {
    await writeFile(path.join(dir, 'sample.ts'), 'export function hello() {}\nexport interface Shape {}\n', 'utf8')
    const result = await capture()['repo-map']!({ rawInput: dir })
    assert.equal(result.kind, 'success')
    assert.match(result.text, /sample\.ts :: hello, Shape/)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
