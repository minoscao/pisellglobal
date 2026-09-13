import crypto from 'node:crypto';import {identityKeys} from '../worker/venue-identity.mjs';
export async function filterImport(records,siteOrigin='https://pisell-melbourne-venue-intelligence.minos-cao.chatgpt.site'){
 const res=await fetch(siteOrigin+'/api/exclusion-fingerprints',{cache:'no-store'});
 if(!res.ok)throw Error('Cannot check permanent exclusions. Import stopped; retry after the site is available.');
 return filterByFingerprints(records,await res.json());
}
// Also accepts a complete, freshly read Sites D1 ledger exported by the authorised connector.
export function filterByFingerprints(records,data){
 if(data.version!==1||!Array.isArray(data.fingerprints)||!data.fingerprints.every(x=>/^[a-f0-9]{64}$/.test(x)))throw Error('Exclusion response invalid. Import stopped.');
 const excluded=new Set(data.fingerprints),accepted=[],skipped=[];
 for(const record of records){const match=identityKeys(record).some(key=>excluded.has(crypto.createHash('sha256').update(key).digest('hex')));(match?skipped:accepted).push(record)}
 return {accepted,skipped};
}
