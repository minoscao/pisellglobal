import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {eventIdentity} from '../worker/model.mjs';
import {identityKeys} from '../worker/venue-identity.mjs';
const read=async f=>JSON.parse(await readFile(new URL('../data/'+f+'.json',import.meta.url),'utf8'));
const exhibitions=await read('exhibitions'),venues=await read('venues');
const q=v=>v==null?'NULL':"'"+String(v).replaceAll("'","''")+"'";
const sql=[];
function insert(table,row,conflict='DO NOTHING'){sql.push(`INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${Object.values(row).map(q).join(',')}) ON CONFLICT ${conflict};`);}
const sourceByUrl=new Map();const sourceIdMap=new Map();
for(const s of exhibitions.sources){const id=sourceByUrl.get(s.url)||s.id;sourceIdMap.set(s.id,id);if(sourceByUrl.has(s.url))continue;sourceByUrl.set(s.url,id);insert('sources',{id,url:s.url,publisher:s.name||'',payload:JSON.stringify(s)});insert('source_collections',{collection:'exhibitions',source_id:id});}
for(const raw of exhibitions.events){const e={...raw,sourceIds:[...new Set(raw.sourceIds.map(id=>sourceIdMap.get(id)||id))]};insert('exhibitions',{id:e.id,identity_key:eventIdentity(e),name:e.name,country:e.country,city:e.city,venue:e.venue,start_date:e.start,end_date:e.end,confidence:'confirmed',payload:JSON.stringify(e)});for(const id of e.sourceIds)insert('exhibition_sources',{exhibition_id:e.id,source_id:id});}
for(const v of venues.venues){insert('venues',{id:v.id,name:v.name,country:v.country||'Australia',city:v.suburb||'Melbourne',address:v.address,physical_stage:v.phase||'unknown',confidence:v.confidence||'low',latitude:v.location?.lat||v.coordinates?.lat||null,longitude:v.location?.lng||v.coordinates?.lng||null,payload:JSON.stringify(v)});for(const key of identityKeys(v))insert('venue_identity_keys',{key,venue_id:v.id});for(const s of v.sources||[]){if(!s.url)continue;let id=sourceByUrl.get(s.url);if(!id){id='vs-'+createHash('sha256').update(s.url).digest('hex').slice(0,24);sourceByUrl.set(s.url,id);insert('sources',{id,url:s.url,publisher:s.publisher||s.name||'',payload:JSON.stringify({...s,id})});}insert('venue_sources',{venue_id:v.id,source_id:id});}}
const {events,sources,notes,...exhibitionMeta}=exhibitions;
const {venues:rows,...venueMeta}=venues;
insert('dataset_metadata',{key:'exhibitions',payload:JSON.stringify(exhibitionMeta)},'(key) DO UPDATE SET payload=excluded.payload,imported_at=CURRENT_TIMESTAMP');
insert('dataset_metadata',{key:'venues',payload:JSON.stringify(venueMeta)},'(key) DO UPDATE SET payload=excluded.payload,imported_at=CURRENT_TIMESTAMP');
await writeFile(new URL('../seed.sql',import.meta.url),sql.join('\n'));
console.log(JSON.stringify({exhibitions:events.length,venues:rows.length,sources:sourceByUrl.size,statements:sql.length}));
