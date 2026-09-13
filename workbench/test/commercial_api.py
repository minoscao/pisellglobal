import urllib.request,urllib.error,json,pathlib,uuid
BASE='http://127.0.0.1:8789';cookie=''
def req(path,method='GET',data=None):
 r=urllib.request.Request(BASE+path,method=method,headers={'Origin':BASE,'Content-Type':'application/json','Cookie':cookie},data=json.dumps(data).encode() if data is not None else None)
 try:
  with urllib.request.urlopen(r) as x:return x.status,json.load(x),x.headers
 except urllib.error.HTTPError as e:return e.code,json.load(e),e.headers
assert req('/api/customers')[0]==401
c=json.loads((pathlib.Path(__file__).resolve().parents[1]/'access.local.json').read_text());r=req('/api/login','POST',c);assert r[0]==200;cookie=r[2]['Set-Cookie'].split(';')[0]
cs=req('/api/customers')[1]['records'];assert len(cs)==12
x=req('/api/customers/customer-minoland')[1];o=x['orders'][0];assert o['summary']['balance'] is None
form=dict(amount='1000.25',currency='AUD',reference='Local validation contract',scope='Local validation only',signedAt='2026-09-01',paymentsComplete=True,revision=o['revision'])
assert req('/api/orders/'+o['id'],'PUT',form)[0]==200
assert req('/api/orders/'+o['id'],'PUT',form)[0]==409
o=req('/api/customers/customer-minoland')[1]['orders'][0]
payment=dict(id=str(uuid.uuid4()),amount='250.10',currency='AUD',receivedAt='2026-09-02',reference='Local receipt '+str(uuid.uuid4()),nature='service_payment',revision=o['revision'])
assert req('/api/orders/'+o['id']+'/payments','POST',payment)[0]==201
assert req('/api/orders/'+o['id']+'/payments','POST',payment)[0]==409
s=req('/api/customers/customer-minoland')[1]['orders'][0]['summary'];assert s['received']['AUD']>=25010 and s['balance']==s['contractAmount']-s['received']['AUD']
f=req('/api/footprint')[1]['countries'];assert next(c for c in f if c['country']=='United States')['leads'] is None
assert next(c for c in f if c['country']=='Australia')['projects']>=10
print('Passed: 12 customers, unknown amounts, precise payment totals, stale updates, duplicate receipts and unresearched-country nulls.')
