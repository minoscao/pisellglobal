import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {mapsConfigRoute} from '../worker/maps-config.mjs';
const url='https://orbit.test/venues/maps-config.js';
const key='test-browser-key-from-cloudflare-secret';

test('Map key comes only from the secret, for all authenticated members, and cannot be cached', async()=>{
  for (const role of ['admin','account_executive','customer_assistant']) {
    const response=mapsConfigRoute(new Request(url),{GOOGLE_MAPS_BROWSER_KEY:key},{id:1,role});
    assert.equal(response.status,200);
    assert.match(response.headers.get('cache-control'),/no-store/);
    assert.equal(response.headers.get('vary'),'Cookie');
    assert.equal(await response.text(),`window.PISELL_MAPS_KEY = ${JSON.stringify(key)};\n`);
  }
  assert.equal(await mapsConfigRoute(new Request(url,{method:'HEAD'}),{GOOGLE_MAPS_BROWSER_KEY:key},{id:1}).text(),'');
});

test('Signed out, missing secret, invalid secret and unexpected methods never reveal a key', async()=>{
  const denied=mapsConfigRoute(new Request(url),{GOOGLE_MAPS_BROWSER_KEY:key},null);
  assert.equal(denied.status,401);assert.ok(!(await denied.text()).includes(key));
  for(const value of [undefined,'',"';alert(1);//"]){
    const response=mapsConfigRoute(new Request(url),{GOOGLE_MAPS_BROWSER_KEY:value},{id:1});
    assert.equal(response.status,503);assert.equal(await response.text(),'/* Map configuration unavailable. */');
  }
  assert.equal(mapsConfigRoute(new Request(url,{method:'POST'}),{GOOGLE_MAPS_BROWSER_KEY:key},{id:1}).status,405);
  assert.equal(mapsConfigRoute(new Request(url+'/other'),{GOOGLE_MAPS_BROWSER_KEY:key},{id:1}),null);
});

test('Static map config contains no embedded Google key and worker intercepts it before static assets',async()=>{
  const source=await fs.readFile(new URL('../vendor/venues/maps-config.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/AIza[A-Za-z0-9_-]{30,}/);
  assert.doesNotMatch(source,/window\.PISELL_MAPS_KEY\s*=/);
  const worker=await fs.readFile(new URL('../worker/index.mjs',import.meta.url),'utf8');
  assert.ok(worker.indexOf('mapsConfigRoute(req,env,user)')<worker.indexOf('if(!user)'));
});
