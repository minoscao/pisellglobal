import {uid} from './model.mjs';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const rows=async(db,sql,...v)=>(await db.prepare(sql).bind(...v).all()).results;
export function financialSummary(order,payments){
 const received={};for(const p of payments)received[p.currency]=(received[p.currency]||0)+p.amount_minor;
 const sameCurrency=Object.keys(received).every(c=>c===order.currency),complete=!!order.payments_complete;
 return {contractAmount:order.amount_minor,currency:order.currency,received,complete,balance:order.amount_minor!=null&&order.currency&&complete&&sameCurrency?order.amount_minor-(received[order.currency]||0):null};
}
export function parseMoney(value,currency){
 if(!Intl.supportedValuesOf('currency').includes(currency))throw Error('Choose a supported currency.');
 const digits=new Intl.NumberFormat('en',{style:'currency',currency}).resolvedOptions().maximumFractionDigits;
 if(typeof value!=='string'||!new RegExp('^\\d+(?:\\.\\d{1,'+Math.max(1,digits)+'})?$').test(value)||(digits===0&&value.includes('.')))throw Error('Enter a valid amount for this currency.');
 const [whole,fraction='']=value.split('.'),n=Number(whole)*10**digits+Number(fraction.padEnd(digits,'0'));
 if(!Number.isSafeInteger(n)||n>1e14)throw Error('This amount is too large.');return n;
}
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s).toISOString().slice(0,10)===s;
export async function commercialRecords(db){
 const [orders,payments]=await Promise.all([rows(db,'SELECT o.*,cp.project_id,cp.service_status FROM orders o JOIN customer_projects cp ON cp.order_id=o.id'),rows(db,'SELECT * FROM payments ORDER BY received_at DESC')]);
 return orders.map(o=>{const p=payments.filter(p=>p.order_id===o.id);return {...o,payments:p,summary:financialSummary(o,p)};});
}
export async function attachCommercial(db,projects){const orders=await commercialRecords(db);return projects.map(p=>({...p,commercial:orders.find(o=>o.project_id===p.id)||null}));}
export async function customerRoutes(req,env,user){const db=env.DB,path=new URL(req.url).pathname;
 if(path==='/api/customers'&&req.method==='GET'){
  const [records,projects,orders]=await Promise.all([rows(db,"SELECT DISTINCT c.*,cp.service_status,cp.country,cp.city,cp.industry,cp.cover_url FROM companies c JOIN opportunities o ON o.company_id=c.id JOIN milestone_confirmations m ON m.opportunity_id=o.id LEFT JOIN customer_profiles cp ON cp.company_id=c.id WHERE m.milestone='V3' AND m.revoked_at IS NULL ORDER BY c.name"),rows(db,'SELECT * FROM work_projects WHERE company_id IS NOT NULL'),commercialRecords(db)]);
  return json({records:records.map(c=>({...c,projects:projects.filter(p=>p.company_id===c.id),orders:orders.filter(o=>o.company_id===c.id)}))});
 }
 const customer=path.match(/^\/api\/customers\/([^/]+)$/);
 if(customer&&req.method==='GET'){const c=await db.prepare('SELECT c.*,p.service_status,p.country,p.city,p.address,p.location_precision,p.industry,p.cover_url,p.profile_json,p.status_evidence FROM companies c LEFT JOIN customer_profiles p ON p.company_id=c.id WHERE c.id=?').bind(decodeURIComponent(customer[1])).first();if(!c)return json({error:'Customer not found.'},404);const [projects,contacts,orders]=await Promise.all([rows(db,'SELECT * FROM work_projects WHERE company_id=?',c.id),rows(db,'SELECT * FROM contacts WHERE company_id=?',c.id),commercialRecords(db)]);return json({...c,profile:JSON.parse(c.profile_json||'{}'),profile_json:undefined,projects,contacts,orders:orders.filter(o=>o.company_id===c.id)});}
 const route=path.match(/^\/api\/orders\/([^/]+)(\/payments)?$/);if(!route)return null;
 const order=await db.prepare('SELECT * FROM orders WHERE id=?').bind(decodeURIComponent(route[1])).first();if(!order)return json({error:'Order not found.'},404);
 if(req.method==='PUT'&&!route[2]){
  const v=await req.json();if(v.revision!==order.revision)return json({error:'The commercial record changed. Reopen it before saving.'},409);
  if(typeof v.paymentsComplete!=='boolean'||typeof v.reference!=='string'||v.reference.length>1000||typeof v.scope!=='string'||v.scope.length>5000)throw Error('Check the contract fields.');
  if(v.currency&&!Intl.supportedValuesOf('currency').includes(v.currency))throw Error('Choose a supported currency.');
  const amount=v.amount===''?null:parseMoney(v.amount,v.currency);if(amount!=null&&!v.reference.trim())throw Error('Add the contract or quotation reference for this amount.');
  if(v.signedAt&&!validDate(v.signedAt))throw Error('Choose a valid signed date.');
  const r=await db.prepare('UPDATE orders SET amount_minor=?,currency=?,amount_reference=?,approved_scope=?,signed_at=?,payments_complete=?,revision=revision+1 WHERE id=? AND revision=?').bind(amount,v.currency||null,v.reference.trim()||null,v.scope.trim()||null,v.signedAt||null,+v.paymentsComplete,order.id,v.revision).run();if(!r.meta.changes)return json({error:'The commercial record changed. Reopen it before saving.'},409);
  await db.prepare("INSERT INTO activity(id,entity_type,entity_id,action,user_id,detail) VALUES(?,'order',?,'Commercial details updated',?,?)").bind(uid(),order.id,user.id,JSON.stringify({amount_minor:amount,currency:v.currency,reference:v.reference})).run();return json({ok:true});
 }
 if(req.method==='POST'&&route[2]){
  const v=await req.json(),amount=parseMoney(v.amount,v.currency);if(amount<=0||!validDate(v.receivedAt)||typeof v.reference!=='string'||!v.reference.trim()||v.reference.length>500||!['deposit','service_payment','balance','other'].includes(v.nature)||typeof v.id!=='string'||!/^[-a-z0-9]{10,80}$/.test(v.id))throw Error('Enter the received amount, date and receipt reference.');
  const existing=await db.prepare('SELECT * FROM payments WHERE id=? OR (order_id=? AND reference=?)').bind(v.id,order.id,v.reference.trim()).first();if(existing)return json({error:'This receipt is already recorded. Check the existing payment.'},409);
  if(v.revision!==order.revision)return json({error:'The commercial record changed. Reopen it before saving.'},409);
  const r=await db.batch([db.prepare('INSERT INTO payments(id,order_id,opportunity_id,amount_minor,currency,nature,verified_by,received_at,reference) SELECT ?,?,?,?,?,?,?,?,? FROM orders WHERE id=? AND revision=?').bind(v.id,order.id,order.opportunity_id,amount,v.currency,v.nature,user.id,v.receivedAt,v.reference.trim(),order.id,v.revision),db.prepare('UPDATE orders SET revision=revision+1 WHERE id=? AND revision=?').bind(order.id,v.revision)]);if(!r[0].meta.changes)return json({error:'The commercial record changed. Reopen it before saving.'},409);return json({ok:true},201);
 }
 return null;
}
