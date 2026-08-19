import { buildRepoMap, renderRepoMap } from './core.js'

export const name = 'repo-map'
export const inject = ['commands']

export interface Config { root?: string }

export function apply(ctx: any, config: Config = {}): void {
  ctx.commands.register({
    name: 'repo-map',
    description: 'Read-only repository structure and symbol map.',
    input: { hint: '[repository path]' },
    recordInput: false,
    async handler(invocation: any) {
      const root = String(invocation.rawInput ?? '').trim() || config.root || process.cwd()
      try {
        const map = await buildRepoMap(root)
        return { kind: 'success', text: renderRepoMap(map) }
      } catch (error) {
        return { kind: 'error', text: `repo-map failed: ${error instanceof Error ? error.message : String(error)}` }
      }
    },
  })
}