import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {filterByFingerprints} from './import-guard.mjs';
const snapshot=process.argv[2];if(!snapshot)throw Error('A fresh complete D1 snapshot is required.');
const before=JSON.parse(await readFile(snapshot,'utf8'));
if(!before.complete||Date.now()-Date.parse(before.readAt)>30*60*1000)throw Error('Read a fresh complete exclusion ledger before importing.');
const data=JSON.parse(await readFile(new URL('../data/venues.json',import.meta.url),'utf8'));
const ledger={version:1,fingerprints:before.exclusion_keys.map(r=>createHash('sha256').update(r.key).digest('hex'))};
const {accepted,skipped}=filterByFingerprints(data.venues,ledger);
const q=v=>v==null?'NULL':"'"+String(v).replaceAll("'","''")+"'";
const sql=[];
for(const v of accepted){const old=before.venues.find(r=>r.id===v.id);if(!old)continue;
 sql.push(`UPDATE venues SET payload=json_set(payload,'$.socialInfo',json(${q(JSON.stringify(v.socialInfo))}),'$.revenueInfo',json(${q(JSON.stringify(v.revenueInfo))})),revision=revision+1,updated_at=CURRENT_TIMESTAMP WHERE id=${q(v.id)} AND revision=${old.revision} AND NOT EXISTS(SELECT 1 FROM exclusions WHERE id=${q(v.id)}) AND NOT EXISTS(SELECT 1 FROM venue_identity_keys k JOIN exclusion_keys e ON e.key=k.key WHERE k.venue_id=${q(v.id)});`);
}
const {venues,...meta}=data;
sql.push(`UPDATE dataset_metadata SET payload=${q(JSON.stringify(meta))},imported_at=CURRENT_TIMESTAMP WHERE key='venues';`);
await writeFile(new URL('../refresh.seed.sql',import.meta.url),sql.join('\n'));
console.log(JSON.stringify({accepted:accepted.length,excluded:skipped.length,notes:'preserved',updates:sql.length-1}));
