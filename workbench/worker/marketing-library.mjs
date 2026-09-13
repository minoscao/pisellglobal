import {uid} from './model.mjs';
import {MARKETING as CONFIG} from '../public/marketing-config.js';
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const rows=async(db,sql,...v)=>(await db.prepare(sql).bind(...v).all()).results;
const base=`SELECT m.*,f.name file_name,f.bytes file_bytes,f.content_type,u.name owner_name FROM marketing_items m JOIN files f ON f.id=m.file_id LEFT JOIN users u ON u.id=m.owner_id`;
export async function marketingRecords(db){const [items,links]=await Promise.all([rows(db,base+' ORDER BY m.updated_at DESC,m.id'),rows(db,'SELECT * FROM marketing_derivations')]);return items.map(m=>({...m,assetIds:links.filter(l=>l.material_id===m.id).map(l=>l.asset_id),usedIn:links.filter(l=>l.asset_id===m.id).map(l=>l.material_id)}));}
export async function marketingRoutes(req,env,user){
 const db=env.DB,url=new URL(req.url),path=url.pathname;
 if(!path.startsWith('/api/marketing'))return null;
 if(req.method!=='GET'&&user.role==='viewer')return json({error:'Editing access is required.'},403);
 if(path==='/api/marketing/uploads'&&req.method==='POST'){
  const v=await req.json();if(typeof v.name!=='string'||!v.name.trim()||v.name.length>200||typeof v.contentType!=='string'||v.contentType.length>150||!Number.isSafeInteger(v.bytes)||v.bytes<1||v.bytes>CONFIG.maxBytes)return json({error:'Choose a file up to 250 MB with a valid name.'},400);
  const id=uid(),key='marketing/'+id,upload=await env.FILES.createMultipartUpload(key,{httpMetadata:{contentType:v.contentType}});
  try{await db.prepare('INSERT INTO marketing_uploads(id,object_key,upload_id,name,content_type,bytes,owner_id) VALUES(?,?,?,?,?,?,?)').bind(id,key,upload.uploadId,v.name,v.contentType,v.bytes,user.id).run();}catch(e){await upload.abort();throw e;}return json({id,chunkBytes:CONFIG.chunkBytes},201);
 }
 const uploadPath=path.match(/^\/api\/marketing\/uploads\/([^/]+)\/(parts|complete)$/);
 if(uploadPath){
  const u=await db.prepare('SELECT * FROM marketing_uploads WHERE id=? AND owner_id=?').bind(uploadPath[1],user.id).first();if(!u)return json({error:'Upload not found.'},404);
  const upload=env.FILES.resumeMultipartUpload(u.object_key,u.upload_id),partCount=Math.ceil(u.bytes/CONFIG.chunkBytes);
  if(uploadPath[2]==='parts'&&req.method==='PUT'){
   if(u.file_id)return json({error:'This upload is already complete.'},409);
   const number=Number(url.searchParams.get('part')),expected=number===partCount?u.bytes-(partCount-1)*CONFIG.chunkBytes:CONFIG.chunkBytes;
   if(!Number.isInteger(number)||number<1||number>partCount||Number(req.headers.get('content-length'))>CONFIG.chunkBytes)return json({error:'Upload part is invalid.'},400);
   const bytes=await req.arrayBuffer();if(bytes.byteLength!==expected)return json({error:'Upload part is incomplete. Retry this file.'},400);
   const part=await upload.uploadPart(number,bytes);await db.prepare('INSERT INTO marketing_upload_parts(upload_id,part_number,etag,bytes) VALUES(?,?,?,?) ON CONFLICT(upload_id,part_number) DO UPDATE SET etag=excluded.etag,bytes=excluded.bytes').bind(u.id,number,part.etag,bytes.byteLength).run();return json({part:number});
  }
  if(uploadPath[2]==='complete'&&req.method==='POST'){
   if(u.file_id)return json({id:u.file_id});
   const parts=await rows(db,'SELECT * FROM marketing_upload_parts WHERE upload_id=? ORDER BY part_number',u.id);if(parts.length!==partCount||parts.reduce((n,p)=>n+p.bytes,0)!==u.bytes)return json({error:'The file is not fully uploaded. Retry the upload.'},400);
   // A completed R2 object allows retry after an interrupted D1 finalisation.
   if(!await env.FILES.head(u.object_key))await upload.complete(parts.map(p=>({partNumber:p.part_number,etag:p.etag})));
   const fileId='marketing-file-'+u.id;
   await db.batch([db.prepare("INSERT INTO files(id,object_key,name,content_type,bytes,sha256,owner_id,category) VALUES(?,?,?,?,?,'',?,'marketing') ON CONFLICT(id) DO NOTHING").bind(fileId,u.object_key,u.name,u.content_type,u.bytes,user.id),db.prepare('UPDATE marketing_uploads SET file_id=? WHERE id=?').bind(fileId,u.id)]);return json({id:fileId},201);
  }
  return json({error:'Upload action unavailable.'},405);
 }
 const item=path.match(/^\/api\/marketing\/items\/([^/]+)(?:\/(file|preview|thumbnail))?$/);
 if(item?.[2]&&req.method==='GET'){
  const m=await db.prepare('SELECT * FROM marketing_items WHERE id=?').bind(item[1]).first();if(!m)return json({error:'Material not found.'},404);
  const fileId=item[2]==='file'?m.file_id:item[2]==='thumbnail'?(m.thumbnail_file_id||m.preview_file_id||m.file_id):(m.preview_file_id||m.file_id),f=await db.prepare('SELECT * FROM files WHERE id=?').bind(fileId).first();if(!f)return json({error:'Preview unavailable.'},404);
  const object=await env.FILES.get(f.object_key);if(!object)return json({error:'File temporarily unavailable.'},503);
  const safe=/^(image\/(png|jpeg|webp|gif)|video\/(mp4|webm)|application\/pdf)$/.test(f.content_type),download=item[2]==='file'||url.searchParams.has('download')||!safe;
  return new Response(object.body,{headers:{'content-type':safe?f.content_type:'application/octet-stream','content-disposition':`${download?'attachment':'inline'}; filename*=UTF-8''${encodeURIComponent(f.name)}`,'cache-control':'private, max-age=300','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'; sandbox"}});
 }
 if(path==='/api/marketing/items'&&req.method==='GET')return json({records:await marketingRecords(db)});
 if((path==='/api/marketing/items'&&req.method==='POST')||(item&&!item[2]&&req.method==='PUT')){
  const v=await req.json(),existing=item?await db.prepare('SELECT * FROM marketing_items WHERE id=?').bind(item[1]).first():null;
  if(item&&!existing)return json({error:'Material not found.'},404);if(existing&&v.revision!==existing.revision)return json({error:'This record changed. Reopen it before saving.'},409);
  for(const [field,config]of [['kind','kinds'],['category','categories'],['language','languages'],['format','formats'],['status','statuses']])if(!Object.hasOwn(CONFIG[config],v[field]))return json({error:'Choose a valid '+field+'.'},400);
  if(existing&&v.kind!==existing.kind)return json({error:'Assets and materials keep their original type.'},400);
  if(typeof v.title!=='string'||!v.title.trim()||v.title.length>200||typeof v.description!=='string'||v.description.length>5000||typeof v.sourceNote!=='string'||v.sourceNote.length>5000||typeof v.version!=='string'||!v.version.trim()||v.version.length>40||!Array.isArray(v.assetIds)||v.assetIds.length>100||new Set(v.assetIds).size!==v.assetIds.length)return json({error:'Check the title, description, version and source assets.'},400);
  for(const id of [v.fileId,v.previewFileId,v.thumbnailFileId].filter(Boolean))if(typeof id!=='string'||!await db.prepare('SELECT id FROM files WHERE id=?').bind(id).first())return json({error:'Upload the file before saving.'},400);
  if(!v.fileId)return json({error:'Add the original file.'},400);
  for(const field of ['previewFileId','thumbnailFileId'])if(v[field]){const f=await db.prepare('SELECT content_type FROM files WHERE id=?').bind(v[field]).first();if(!/^image\/(jpeg|png|webp|gif)$/.test(f.content_type))return json({error:'Choose a PNG, JPG, WebP or GIF preview.'},400);}
  if(v.kind==='asset'&&v.assetIds.length)return json({error:'Only materials can be created from source assets.'},400);
  for(const id of v.assetIds)if(typeof id!=='string'||!await db.prepare("SELECT id FROM marketing_items WHERE id=? AND kind='asset'").bind(id).first())return json({error:'Choose existing source assets.'},400);
  const id=existing?.id||uid(),values=[v.title.trim(),v.category,v.language,v.format,v.status,v.version.trim(),v.description,v.sourceNote,v.fileId,v.previewFileId||null,v.thumbnailFileId||null];
  const save=existing?db.prepare('UPDATE marketing_items SET title=?,category=?,language=?,format=?,status=?,version=?,description=?,source_note=?,file_id=?,preview_file_id=?,thumbnail_file_id=?,revision=CASE WHEN revision=? THEN revision+1 ELSE NULL END,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values,v.revision,id):db.prepare('INSERT INTO marketing_items(title,category,language,format,status,version,description,source_note,file_id,preview_file_id,thumbnail_file_id,id,kind,owner_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(...values,id,v.kind,user.id);
  try{await db.batch([save,db.prepare('DELETE FROM marketing_derivations WHERE material_id=?').bind(id),...v.assetIds.map(asset=>db.prepare('INSERT INTO marketing_derivations(material_id,asset_id) VALUES(?,?)').bind(id,asset)),db.prepare("INSERT INTO activity(id,entity_type,entity_id,action,user_id,detail) VALUES(?,'marketing',?,?,?,?)").bind(uid(),id,existing?'Material updated':'Material added',user.id,JSON.stringify({kind:v.kind,assetIds:v.assetIds}))]);}catch(e){if(/NOT NULL.*revision/.test(e.message))return json({error:'This record changed. Reopen it before saving.'},409);throw e;}
  return json({id,revision:(existing?.revision||0)+1},existing?200:201);
 }
 return json({error:'Library action unavailable.'},404);
}
