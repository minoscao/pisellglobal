import {uid} from './model.mjs';
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
export async function approachPlanRoutes(req,env,user){
 const url=new URL(req.url),db=env.DB,path=url.pathname;
 const pdf=path.match(/^\/api\/approach-plans\/([^/]+)\/pdf$/);
 if(pdf&&req.method==='GET'){
  const file=await db.prepare('SELECT f.* FROM approach_plans p JOIN files f ON f.id=p.pdf_file_id WHERE p.id=?').bind(decodeURIComponent(pdf[1])).first();if(!file)return json({error:'Plan PDF not found.'},404);
  const object=await env.FILES.get(file.object_key);if(!object)return json({error:'Plan PDF is temporarily unavailable.'},503);
  return new Response(object.body,{headers:{'content-type':'application/pdf','content-disposition':`${url.searchParams.has('download')?'attachment':'inline'}; filename*=UTF-8''${encodeURIComponent(file.name)}`,'cache-control':'private, no-store','x-content-type-options':'nosniff'}});
 }
 if(path!=='/api/approach-plans')return null;
 if(!['GET','POST'].includes(req.method))return json({error:'This action is not available.'},405);
 const v=req.method==='GET'?Object.fromEntries(url.searchParams):await req.json();
 if(!!v.venueId===!!v.projectId)return json({error:'Choose one venue or project.'},400);
 const id=v.venueId||v.projectId,table=v.venueId?'venues':'work_projects',column=v.venueId?'venue_id':'project_id';
 if(typeof id!=='string'||!await db.prepare(`SELECT id FROM ${table} WHERE id=?`).bind(id).first())return json({error:'Venue or project not found.'},404);
 if(req.method==='GET'){const r=await db.prepare(`SELECT p.*,f.name pdf_name FROM approach_plans p LEFT JOIN files f ON f.id=p.pdf_file_id WHERE p.${column}=? ORDER BY version DESC`).bind(id).all();return json({records:r.results.map(p=>({...p,content:JSON.parse(p.content_json),content_json:undefined})),generationConnected:false});}
 if(user.role==='viewer')return json({error:'Editing access is required.'},403);
 if(typeof v.title!=='string'||!v.title.trim()||v.title.length>200||typeof v.summary!=='string'||v.summary.length>10000||!Number.isSafeInteger(v.version)||v.version<1||!['draft','ready'].includes(v.status)||!validDate(v.preparedAt)||v.pdfFileId&&typeof v.pdfFileId!=='string'||!v.content||typeof v.content!=='object'||Array.isArray(v.content)||JSON.stringify(v.content).length>60000)return json({error:'Check the plan title, version, date and content.'},400);
 if(v.status==='ready'&&!v.pdfFileId)return json({error:'Attach the completed PDF before marking the plan ready.'},400);
 if(v.pdfFileId){const file=await db.prepare('SELECT * FROM files WHERE id=?').bind(v.pdfFileId).first();if(!file||file.content_type!=='application/pdf')return json({error:'Choose an uploaded PDF.'},400);if(file.project_id&&file.project_id!==v.projectId)return json({error:'The PDF belongs to another project.'},400);const object=await env.FILES.get(file.object_key,{range:{offset:0,length:5}});if(!object||await object.text()!=='%PDF-')return json({error:'The uploaded file is not a readable PDF.'},400);}
 const planId=uid();try{await db.batch([db.prepare('INSERT INTO approach_plans(id,venue_id,project_id,version,title,summary,content_json,status,pdf_file_id,prepared_in,prepared_at,created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(planId,v.venueId||null,v.projectId||null,v.version,v.title.trim(),v.summary,JSON.stringify(v.content),v.status,v.pdfFileId||null,'GPT',v.preparedAt,user.id),db.prepare("INSERT INTO activity(id,entity_type,entity_id,action,user_id,detail) VALUES(?,'approach_plan',?,'Plan archived',?,?)").bind(uid(),planId,user.id,JSON.stringify({venueId:v.venueId||null,projectId:v.projectId||null,version:v.version}))]);}catch(e){if(/UNIQUE/.test(e.message))return json({error:'This plan version already exists. Use the next version.'},409);throw e;}
 return json({id:planId,version:v.version},201);
}
