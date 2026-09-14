// Reject stale release bases and serialize cooperating project deployments.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {checkReleaseContract} from './check-release-assets.mjs';
const root=fileURLToPath(new URL('../..',import.meta.url));
const args=process.argv.slice(2),get=k=>args[args.indexOf(k)+1];
if(!args.includes('--config')||!args.includes('--base-version'))throw Error('Use --config <reviewed staging config> --base-version <production version used to prepare it>.');
const config=path.resolve(get('--config')),expected=get('--base-version');
const lockDir=path.join(root,'.wrangler');await fs.mkdir(lockDir,{recursive:true});
const lockPath=path.join(lockDir,'reviewed-deployment.lock');let lock;
try{lock=await fs.open(lockPath,'wx');}catch{throw Error('Another reviewed deployment holds the project lock. Wait for it to finish, then rebuild from its resulting version.');}
try{
 await lock.writeFile(JSON.stringify({pid:process.pid,started:new Date().toISOString(),config,expected}));
 const contract=JSON.parse(await fs.readFile(path.join(root,'workbench/release-contract.json'),'utf8'));
 const cfg=JSON.parse(await fs.readFile(config,'utf8'));
 const assetRoot=path.resolve(path.dirname(config),cfg.assets.directory);
 await checkReleaseContract(assetRoot,contract);
 const cli=path.join(root,'workbench/node_modules/wrangler/bin/wrangler.js');
 const r=spawnSync(process.execPath,[cli,'deployments','list','--config',config,'--json'],{encoding:'utf8'});
 if(r.status!==0)throw Error('Could not verify production version. '+r.stderr);
 const deployments=JSON.parse(r.stdout);deployments.sort((a,b)=>a.created_on.localeCompare(b.created_on));
 const latest=deployments.at(-1),versions=latest?.versions||[];
 if(versions.length!==1||versions[0].version_id!==expected||versions[0].percentage!==100)throw Error('Production changed after release preparation. Expected '+expected+'; current '+versions.map(v=>v.version_id).join(', ')+'. Rebase the release; do not overwrite the newer work.');
 if(args.includes('--check-only'))console.log('Release base matches current production: '+expected);
 else{const publish=spawnSync(process.execPath,[cli,'deploy','--config',config],{stdio:'inherit'});if(publish.status!==0)throw Error('Deployment failed.');}
}finally{await lock.close();await fs.unlink(lockPath);}
