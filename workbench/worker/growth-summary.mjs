import {commercialRecords} from './customers.mjs';
import {marketingRecords} from './marketing-library.mjs';
const rows=async(db,sql)=>(await db.prepare(sql).all()).results;
export async function growthSummary(db){
 const [files,types,milestones,totals,partners,commercial,marketing]=await Promise.all([
  rows(db,'SELECT category,count(*) count FROM files GROUP BY category'),
  rows(db,`SELECT c.customer_type,count(DISTINCT c.id) count FROM companies c JOIN opportunities o ON o.company_id=c.id JOIN milestone_confirmations m ON m.opportunity_id=o.id WHERE m.milestone='V3' AND m.revoked_at IS NULL GROUP BY c.customer_type`),
  rows(db,`SELECT milestone,count(*) count FROM (SELECT o.id,max(m.milestone) milestone FROM opportunities o JOIN milestone_confirmations m ON m.opportunity_id=o.id AND m.revoked_at IS NULL WHERE o.disposition='active' GROUP BY o.id) GROUP BY milestone`),
  db.prepare(`SELECT (SELECT count(*) FROM companies) profiles,(SELECT count(*) FROM quote_references) quotes,(SELECT count(*) FROM handovers WHERE accepted_at IS NOT NULL) acceptedPacks,(SELECT count(*) FROM handovers) packs`).first(),
  rows(db,"SELECT type,count(*) count FROM partners WHERE status='active' GROUP BY type"),commercialRecords(db),marketingRecords(db)
 ]);
 const received={};for(const order of commercial)for(const [currency,amount] of Object.entries(order.summary.received))received[currency]=(received[currency]||0)+amount;
 const current=marketing.filter(m=>m.status!=='archived'),materials=current.filter(m=>m.kind==='material');
 return {files,types,milestones,totals,partners,library:{assets:current.filter(m=>m.kind==='asset').length,materials:materials.length,featured:materials.filter(m=>m.thumbnail_file_id||m.preview_file_id||m.content_type.startsWith('image/')).slice(0,2).map(m=>({id:m.id,title:m.title,status:m.status,version:m.version,revision:m.revision})),byFormat:materials.reduce((counts,m)=>({...counts,[m.format]:(counts[m.format]||0)+1}),{})},commercial:{orders:commercial.length,amountsRecorded:commercial.filter(o=>o.amount_minor!=null).length,received},connections:{automaticResearch:false,enquiries:false,referrals:false,quotation:false},updatedAt:new Date().toISOString()};
}
