import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {checkReleaseAssets} from '../scripts/check-release-assets.mjs';

test('release rejects a missing shared dependency even on a dynamically loaded page',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'pisell-release-'));
 try{
  await fs.writeFile(path.join(root,'app.js'),"export const open=()=>import('./alerts.js');");
  await fs.writeFile(path.join(root,'alerts.js'),"import {coverage} from '/research-coverage.js'; console.log(coverage);");
  await assert.rejects(checkReleaseAssets(root),/Missing page dependency/);
  await fs.writeFile(path.join(root,'research-coverage.js'),'export const coverage=[];');
  assert.equal((await checkReleaseAssets(root)).modules,3);
  await fs.writeFile(path.join(root,'alerts.js'),"import './missing-relative.js';");
  await assert.rejects(checkReleaseAssets(root),/missing-relative/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
