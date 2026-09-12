"""Project-scoped provisioning. Uses the existing Wrangler login without copying credentials."""
import json, os, sys, tomllib, urllib.request, urllib.error, pathlib, secrets, hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
ACCOUNT='660184157223097c9afd3d253ec86ce6'
CONFIG=pathlib.Path(os.environ['APPDATA'])/'xdg.config/.wrangler/config/default.toml'
token=tomllib.loads(CONFIG.read_text(encoding='utf-8'))['oauth_token']
def call(path,method='GET',data=None):
    req=urllib.request.Request('https://api.cloudflare.com/client/v4/accounts/'+ACCOUNT+'/'+path,method=method,headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'},data=json.dumps(data).encode() if data is not None else None)
    try:
        with urllib.request.urlopen(req,timeout=60) as r: result=json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError(str(e.code)+' '+e.read().decode()[:1000]) from None
    if not result.get('success'):raise RuntimeError(str(result.get('errors')))
    return result['result']
if sys.argv[1]=='provision':
    databases=call('d1/database'); db=next((d for d in databases if d['name']=='pisellglobal-db'),None)
    if not db:db=call('d1/database','POST',{'name':'pisellglobal-db'})
    buckets=call('r2/buckets')['buckets']
    if not any(b['name']=='pisellglobal-files' for b in buckets):call('r2/buckets','POST',{'name':'pisellglobal-files'})
    conf=json.loads((ROOT.parent/'wrangler.jsonc').read_text(encoding='utf-8'));conf['d1_databases'][0]['database_id']=db['uuid'];(ROOT.parent/'wrangler.jsonc').write_text(json.dumps(conf,indent=2)+'\n',encoding='utf-8')
    print('Project D1 database and private R2 bucket configured.')
elif sys.argv[1]=='owner':
    conf=json.loads((ROOT.parent/'wrangler.jsonc').read_text(encoding='utf-8'));dbid=conf['d1_databases'][0]['database_id']
    existing=call('d1/database/'+dbid+'/query','POST',{'sql':'SELECT id FROM users WHERE email=?','params':['minoscao@gmail.com']})
    if existing[0]['results']:print('Owner already exists; credentials unchanged.');sys.exit(0)
    password=secrets.token_urlsafe(18);salt=secrets.token_hex(16);hash=hashlib.pbkdf2_hmac('sha256',password.encode(),salt.encode(),100000).hex()
    call('d1/database/'+dbid+'/query','POST',{'sql':'INSERT INTO users(id,email,name,password_hash,password_salt,role) VALUES(?,?,?,?,?,?)','params':['minos','minoscao@gmail.com','Minos',hash,salt,'admin']})
    (ROOT/'access.local.json').write_text(json.dumps({'url':'https://pisellglobal.minoscao.workers.dev','email':'minoscao@gmail.com','password':password},indent=2),encoding='utf-8')
    print('Owner created. Credentials stored in ignored access.local.json.')
elif sys.argv[1]=='verify':
    conf=json.loads((ROOT.parent/'wrangler.jsonc').read_text(encoding='utf-8'));dbid=conf['d1_databases'][0]['database_id']
    for table in ['users','exhibitions','venues','sources','work_projects','files']:
        r=call('d1/database/'+dbid+'/query','POST',{'sql':'SELECT count(*) n FROM '+table});print(table,r[0]['results'][0]['n'])
