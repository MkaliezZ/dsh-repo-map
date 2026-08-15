import {buildRepoMap,renderRepoMap} from './core.js'; export function registerRepoMap(ctx,{root=process.cwd()}={}){ctx.command?.('repo-map',async()=>renderRepoMap(await buildRepoMap(root)));}
