import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {venueStatements} from './venue-seed.mjs';
const data=JSON.parse(await readFile(new URL('../data/alerts.json',import.meta.url),'utf8'));
const q=v=>v==null?'NULL':"'"+String(v).replaceAll("'","''")+"'";
const sql=[];
const inventory=JSON.parse(await readFile(new URL('../data/venues.json',import.meta.url),'utf8'));
for(const v of inventory.venues)sql.push(`INSERT INTO venue_collections(venue_id,collection) SELECT id,'melbourne' FROM venues WHERE id=${q(v.id)} ON CONFLICT DO NOTHING;`);
for(const v of data.extraVenues)sql.push(...venueStatements(v));
const initial=JSON.parse(await readFile(new URL('../data/trigger-initial.json',import.meta.url),'utf8'));
for(const t of initial.settings)sql.push(`INSERT INTO trigger_settings(id,enabled,priority) VALUES(${q(t.id)},${+t.enabled},${q(t.priority)}) ON CONFLICT DO NOTHING;`);
for(const a of data.records){
 sql.push(`INSERT INTO alert_events(id,venue_id,event_key,trigger_id,observed_on,payload) VALUES(${[a.id,a.venueId,a.eventKey,a.triggerId,a.observedOn,JSON.stringify(a)].map(q)}) ON CONFLICT DO NOTHING;`);
 for(const s of a.evidence.filter(s=>s.url)){
  const id='as-'+createHash('sha256').update(s.url).digest('hex').slice(0,24);
  sql.push(`INSERT INTO sources(id,url,publisher,payload) VALUES(${[id,s.url,s.publisher,JSON.stringify(s)].map(q)}) ON CONFLICT DO NOTHING;`);
  sql.push(`INSERT INTO alert_sources(alert_id,source_id) SELECT ${q(a.id)},id FROM sources WHERE url=${q(s.url)} ON CONFLICT DO NOTHING;`);
 }
}
sql.push(`INSERT INTO dataset_metadata(key,payload) VALUES('alerts',${q(JSON.stringify({asOf:data.asOf,coverage:data.coverage,monitorConnected:false}))}) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload;`);
await writeFile(new URL('../alerts.seed.sql',import.meta.url),sql.join('\n'));
console.log(`${data.records.length} sourced alerts; existing review state preserved.`);
