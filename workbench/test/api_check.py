"""Run against local Wrangler only. Never writes validation records to production."""
import urllib.request,urllib.error,json,pathlib,uuid
ROOT=pathlib.Path(__file__).resolve().parents[1];BASE='http://127.0.0.1:8789';COOKIE=''
def request(path,method='GET',payload=None,origin=BASE,authenticated=True,raw=None,content_type=None):
 headers={'Origin':origin}
 if authenticated and COOKIE:headers['Cookie']=COOKIE
 if payload is not None:headers['Content-Type']='application/json';raw=json.dumps(payload).encode()
 if content_type:headers['Content-Type']=content_type
 req=urllib.request.Request(BASE+path,method=method,headers=headers,data=raw)
 try:
  with urllib.request.urlopen(req) as r:return r.status,r.read(),r.headers
 except urllib.error.HTTPError as e:return e.code,e.read(),e.headers
def parsed(r):return json.loads(r[1])
assert request('/api/bootstrap',authenticated=False)[0]==401
assert request('/venues/index.html',authenticated=False)[0]==401
assert request('/api/exhibitions',authenticated=False)[0]==401
credentials=json.loads((ROOT/'access.local.json').read_text(encoding='utf-8'))
assert request('/api/login','POST',credentials,origin='https://other.example')[0]==403
r=request('/api/login','POST',credentials);assert r[0]==200,r[1];COOKIE=r[2]['Set-Cookie'].split(';')[0];assert all(x in r[2]['Set-Cookie'] for x in ['HttpOnly','Secure','SameSite=Strict'])
boot=parsed(request('/api/bootstrap'));assert boot['counts']['exhibitions']==34
events=parsed(request('/api/exhibitions'));assert len(events['events'])==34;assert len(events['sources'])==81
all_sources={s['id'] for s in events['sources']};assert all(s in all_sources for v in events['visas'] for s in v.get('sourceIds',[]))
venue_id='au-melbourne-rainbow-braeside';request('/api/exclusions/'+venue_id,'DELETE');assert len(parsed(request('/api/data'))['venues'])==147
assert request('/api/exclusions/'+venue_id,'POST')[0]==200;assert len(parsed(request('/api/data'))['venues'])==146
assert request('/api/exclusions/'+venue_id,'DELETE')[0]==200;assert len(parsed(request('/api/data'))['venues'])==147
note_id='atm';original=events['notes'].get(note_id,{});note={'text':'HTTP validation '+uuid.uuid4().hex,'review':'Shortlisted','revision':original.get('revision',0)}
r=request('/api/exhibitions/save','POST',{'notes':{note_id:note}});assert r[0]==200,r[1]
assert request('/api/exhibitions/save','POST',{'notes':{note_id:{**note,'text':'stale overwrite'}}})[0]==409
assert request('/api/exhibitions/save','POST',{'notes':{note_id:note}},origin='https://other.example')[0]==403
bad={'id':'unsafe','name':'Unsafe','country':'Country','start':'2026-12-01','end':'2026-11-01','sourceIds':['missing']}
assert request('/api/exhibitions/save','POST',{'events':[bad]})[0]==400
project=parsed(request('/api/projects','POST',{'name':'HTTP validation work','workstream':'readiness','owner_id':'minos','next_action':'Review the uploaded test file'}));pid=project['id']
p=parsed(request('/api/projects/'+pid));assert request('/api/projects/'+pid,'PATCH',{**p,'name':'HTTP validation updated'})[0]==200
assert request('/api/projects/'+pid,'PATCH',{**p,'name':'Stale overwrite'})[0]==409
boundary='pisell-'+uuid.uuid4().hex;raw=(f'--{boundary}\r\nContent-Disposition: form-data; name="project_id"\r\n\r\n{pid}\r\n--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="validation.txt"\r\nContent-Type: text/plain\r\n\r\nValidation file in local R2 only.\r\n--{boundary}--\r\n').encode()
r=request('/api/files','POST',raw=raw,content_type='multipart/form-data; boundary='+boundary);assert r[0]==201,r[1];fid=parsed(r)['id'];r=request('/api/files/'+fid);assert r[0]==200 and r[1]==b'Validation file in local R2 only.';assert request('/api/files/'+fid,authenticated=False)[0]==401
assert 'attachment' in r[2]['Content-Disposition']
rules=parsed(request('/api/triggers'))['triggers'];assert len(rules)==35
trigger=next(r for r in rules if r['id']=='opening-jobs');change={'enabled':not trigger['enabled'],'priority':'minor','revision':trigger['revision']}
r=request('/api/triggers/opening-jobs','PUT',change);assert r[0]==200,r[1]
assert request('/api/triggers/opening-jobs','PUT',change)[0]==409
assert request('/api/triggers/opening-jobs','PUT',{**change,'priority':'high'})[0]==400
alerts=parsed(request('/api/alerts'))['records'];assert len(alerts)==15
alert=alerts[0];review={'status':'reviewed','note':'API validation','ownerId':'minos','nextAction':'Check primary source','revision':alert['review']['revision']}
assert request('/api/alerts/'+alert['id']+'/review','PUT',review)[0]==200
assert request('/api/alerts/'+alert['id']+'/review','PUT',review)[0]==409
request('/api/exclusions/'+venue_id,'POST');assert all(a['venueId']!=venue_id for a in parsed(request('/api/alerts'))['records']);request('/api/exclusions/'+venue_id,'DELETE')
assert request('/api/alerts',authenticated=False)[0]==401
assert request('/api/triggers',authenticated=False)[0]==401
assert request('/api/logout','POST',{})[0]==200;assert request('/api/bootstrap')[0]==401
print('HTTP checks passed: authentication, CSRF, data/source integrity, exclusions, note/project conflicts, private R2 upload/download and session revocation.')
