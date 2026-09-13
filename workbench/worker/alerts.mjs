import {TRIGGERS,mergeTriggers,PRIORITIES} from '../vendor/venues/intelligence-rules.js';
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const rows=async(db,sql,...params)=>(await db.prepare(sql).bind(...params).all()).results;
const notExcluded=`NOT EXISTS(SELECT 1 FROM exclusions e WHERE e.id=v.id) AND NOT EXISTS(SELECT 1 FROM venue_identity_keys k JOIN exclusion_keys e ON e.key=k.key WHERE k.venue_id=v.id)`;
export async function alertRoutes(req,env,user){
 const db=env.DB,p=new URL(req.url).pathname;
 if(p==='/api/triggers'&&req.method==='GET'){
  const overrides=await rows(db,'SELECT * FROM trigger_settings');
  return json({triggers:mergeTriggers(overrides).map(t=>({...t,revision:overrides.find(r=>r.id===t.id)?.revision||0})),monitorConnected:false});
 }
 const trigger=p.match(/^\/api\/triggers\/([a-z-]+)$/);
 if(trigger&&req.method==='PUT'){
  const id=trigger[1],v=await req.json();
  if(!TRIGGERS.some(t=>t.id===id)||typeof v.enabled!=='boolean'||!PRIORITIES[v.priority]||!Number.isInteger(v.revision)||v.revision<0)return json({error:'Choose a valid saved trigger and priority.'},400);
  const result=await db.prepare(`INSERT INTO trigger_settings(id,enabled,priority,updated_by) SELECT ?,?,?,? WHERE ?=0 ON CONFLICT(id) DO UPDATE SET enabled=excluded.enabled,priority=excluded.priority,updated_by=excluded.updated_by,revision=trigger_settings.revision+1,updated_at=CURRENT_TIMESTAMP WHERE trigger_settings.revision=?`).bind(id,+v.enabled,v.priority,user.id,v.revision,v.revision).run();
  // Existing rows need an UPDATE when the caller supplies a positive revision.
  let changes=result.meta.changes;
  if(v.revision>0){const r=await db.prepare('UPDATE trigger_settings SET enabled=?,priority=?,updated_by=?,updated_at=CURRENT_TIMESTAMP,revision=revision+1 WHERE id=? AND revision=?').bind(+v.enabled,v.priority,user.id,id,v.revision).run();changes=r.meta.changes;}
  if(!changes)return json({error:'This setting changed elsewhere. Reload the saved rules before editing.'},409);
  const saved=await db.prepare('SELECT * FROM trigger_settings WHERE id=?').bind(id).first();
  return json({...saved,enabled:!!saved.enabled});
 }
 if(p==='/api/alerts'&&req.method==='GET'){
  const records=await rows(db,`SELECT a.*,v.payload venue,r.status,r.note,r.owner_id,r.next_action,r.revision review_revision,r.updated_at reviewed_at FROM alert_events a JOIN venues v ON v.id=a.venue_id LEFT JOIN alert_reviews r ON r.alert_id=a.id WHERE ${notExcluded} AND lower(v.country) NOT IN ('china','cn') ORDER BY a.observed_on DESC,a.id`);
  const metadata=await db.prepare("SELECT payload FROM dataset_metadata WHERE key='alerts'").first();
  const users=await rows(db,'SELECT id,name FROM users');
  return json({...JSON.parse(metadata?.payload||'{}'),users,records:records.map(r=>({...JSON.parse(r.payload),venue:JSON.parse(r.venue),review:{status:r.status||'new',note:r.note||'',ownerId:r.owner_id||'',nextAction:r.next_action||'',revision:r.review_revision||0,updatedAt:r.reviewed_at}}))});
 }
 const review=p.match(/^\/api\/alerts\/([^/]+)\/review$/);
 if(review&&req.method==='PUT'){
  const id=decodeURIComponent(review[1]),v=await req.json();
  if(!['new','reviewed','snoozed','resolved'].includes(v.status)||typeof v.note!=='string'||v.note.length>5000||typeof v.nextAction!=='string'||v.nextAction.length>2000||!Number.isInteger(v.revision)||v.revision<0)return json({error:'Check the review fields and try again.'},400);
  if(!await db.prepare('SELECT id FROM alert_events WHERE id=?').bind(id).first())return json({error:'Alert not found.'},404);
  if(v.ownerId&&!await db.prepare('SELECT id FROM users WHERE id=?').bind(v.ownerId).first())return json({error:'Choose a team member.'},400);
  const existing=await db.prepare('SELECT revision FROM alert_reviews WHERE alert_id=?').bind(id).first();
  if((existing?.revision||0)!==v.revision)return json({error:'This review changed elsewhere. Reopen it to see the latest notes.'},409);
  try{await db.prepare(`INSERT INTO alert_reviews(alert_id,status,note,owner_id,next_action,updated_by) VALUES(?,?,?,?,?,?) ON CONFLICT(alert_id) DO UPDATE SET status=excluded.status,note=excluded.note,owner_id=excluded.owner_id,next_action=excluded.next_action,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP,revision=CASE WHEN alert_reviews.revision=? THEN alert_reviews.revision+1 ELSE NULL END`).bind(id,v.status,v.note,v.ownerId||null,v.nextAction,user.id,v.revision).run();}catch(e){if(/NOT NULL/.test(e.message))return json({error:'This review changed elsewhere. Reopen it before saving.'},409);throw e;}
  return json({ok:true,revision:v.revision+1});
 }
 if(p.startsWith('/api/venues/')&&req.method==='GET'){
  const r=await db.prepare(`SELECT v.payload FROM venues v WHERE v.id=? AND ${notExcluded}`).bind(decodeURIComponent(p.slice('/api/venues/'.length))).first();
  return r?json(JSON.parse(r.payload)):json({error:'Venue unavailable or excluded.'},404);
 }
 return null;
}
