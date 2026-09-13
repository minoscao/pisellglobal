import {readFile,writeFile} from 'node:fs/promises';
const input=process.argv[2];if(!input)throw Error('Pass a reviewed customer import file.');
const data=JSON.parse(await readFile(input,'utf8')),q=v=>v==null?'NULL':"'"+String(v).replaceAll("'","''")+"'";
const sql=[];
for(const r of data.records){
 if(!r.id||!r.name||!r.statusEvidence||!r.country)throw Error('Each customer needs an identity, country and service confirmation.');
 const c='customer-'+r.id,p='service-'+r.id,o='opportunity-'+p,order='order-'+p;
 sql.push(`INSERT INTO companies(id,name,website,customer_type) VALUES(${q(c)},${q(r.name)},${q(r.website)},'venue_management') ON CONFLICT(id) DO NOTHING;`);
 sql.push(`INSERT INTO customer_profiles(company_id,source_system,external_id,service_status,country,city,address,location_precision,latitude,longitude,industry,cover_url,profile_json,status_evidence) VALUES(${[c,data.sourceSystem,r.id,'servicing',r.country,r.city,r.address,r.locationPrecision,r.latitude,r.longitude,r.industry,r.coverUrl,JSON.stringify(r),r.statusEvidence].map(q).join(',')}) ON CONFLICT DO NOTHING;`);
 if(r.venueId)sql.push(`UPDATE venues SET company_id=${q(c)} WHERE id=${q(r.venueId)} AND company_id IS NULL AND NOT EXISTS(SELECT 1 FROM exclusions WHERE id=${q(r.venueId)});`);
 sql.push(`INSERT INTO opportunities(id,company_id,venue_id,name,owner_id,next_action) VALUES(${[o,c,r.venueId,r.name+' · Existing service',data.confirmedBy,'Complete the contract and payment history from source documents.'].map(q).join(',')}) ON CONFLICT(id) DO NOTHING;`);
 sql.push(`INSERT INTO milestone_confirmations(id,opportunity_id,milestone,evidence,confirmed_by,confirmed_at) VALUES(${[o+'-v3',o,'V3',r.statusEvidence,data.confirmedBy,data.confirmedAt].map(q).join(',')}) ON CONFLICT DO NOTHING;`);
 sql.push(`INSERT INTO orders(id,opportunity_id,company_id) VALUES(${[order,o,c].map(q).join(',')}) ON CONFLICT(id) DO NOTHING;`);
 sql.push(`INSERT INTO work_projects(id,name,workstream,work_type,status,owner_id,country,next_action,company_id,latitude,longitude) VALUES(${[p,r.name+' · Ongoing service','target_customers','customer_service','active',data.confirmedBy,r.country,'Complete the contract and payment history from source documents.',c,r.latitude,r.longitude].map(q).join(',')}) ON CONFLICT(id) DO NOTHING;`);
 sql.push(`INSERT INTO customer_projects(project_id,order_id,service_status,source_system,external_id) VALUES(${[p,order,'servicing',data.sourceSystem,r.id].map(q).join(',')}) ON CONFLICT DO NOTHING;`);
}
await writeFile(new URL('../customers.seed.sql',import.meta.url),sql.join('\n'));console.log(JSON.stringify({customers:data.records.length,paymentsImported:0,mode:'additive'}));
