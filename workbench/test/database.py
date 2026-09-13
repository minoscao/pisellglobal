import sqlite3, pathlib, json, unittest, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
class DatabaseTest(unittest.TestCase):
 def setUp(self):
  self.db=sqlite3.connect(':memory:');self.db.executescript((ROOT/'migrations/0001_growth.sql').read_text(encoding='utf-8'));self.db.executescript((ROOT/'seed.sql').read_text(encoding='utf-8'));self.db.executescript((ROOT/'migrations/0002_alerts.sql').read_text(encoding='utf-8'));self.db.executescript((ROOT/'alerts.seed.sql').read_text(encoding='utf-8'));self.db.executescript((ROOT/'migrations/0003_customers.sql').read_text(encoding='utf-8'));self.db.executescript((ROOT/'migrations/0004_approach_plans.sql').read_text(encoding='utf-8'));self.db.execute("INSERT INTO users(id,email,name,password_hash,password_salt,role) VALUES('test','test@example.com','Test','hash','salt','admin')");self.db.commit()
 def test_approach_plan_versions_and_pdf_integrity(self):
  venue=self.db.execute('SELECT id FROM venues LIMIT 1').fetchone()[0]
  insert="INSERT INTO approach_plans(id,venue_id,version,title,status,prepared_at,created_by) VALUES(?,?,?,'Internal approach','draft','2026-09-13','test')"
  self.db.execute(insert,('plan-one',venue,1))
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute(insert,('duplicate',venue,1))
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute(insert,('unlinked',None,1))
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("UPDATE approach_plans SET status='ready' WHERE id='plan-one'")
  self.db.execute(insert,('plan-two',venue,2))
  self.assertEqual(self.db.execute('SELECT count(*) FROM approach_plans').fetchone()[0],2)
 def tearDown(self):self.db.close()
 def marketing_setup(self):
  self.db.executescript((ROOT/'migrations/0005_marketing_library.sql').read_text(encoding='utf-8'))
  self.db.execute("INSERT INTO files(id,object_key,name,content_type,bytes,sha256,owner_id,category) VALUES('art','marketing/art','art.png','image/png',100,'','test','marketing')")
  for ident,kind in [('asset-one','asset'),('asset-two','asset'),('material-one','material')]:
   self.db.execute("INSERT INTO marketing_items(id,kind,title,category,language,format,file_id,owner_id) VALUES(?,?,?,'solution','en','illustration','art','test')",(ident,kind,ident))
  self.db.execute("INSERT INTO marketing_derivations VALUES('material-one','asset-one')");self.db.commit()
 def test_material_sources_have_valid_direction_and_stable_identity(self):
  self.marketing_setup()
  for pair in [('asset-one','material-one'),('material-one','material-one'),('material-one','missing')]:
   with self.assertRaises(sqlite3.IntegrityError):self.db.execute('INSERT INTO marketing_derivations VALUES(?,?)',pair)
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("UPDATE marketing_items SET kind='material' WHERE id='asset-one'")
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("DELETE FROM marketing_items WHERE id='asset-one'")
  self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(),[])
 def test_stale_material_edit_preserves_source_links(self):
  self.marketing_setup()
  with self.assertRaises(sqlite3.IntegrityError):
   with self.db:
    self.db.execute("DELETE FROM marketing_derivations WHERE material_id='material-one'")
    self.db.execute("UPDATE marketing_items SET title='stale',revision=CASE WHEN revision=0 THEN revision+1 ELSE NULL END WHERE id='material-one'")
  self.assertEqual(self.db.execute('SELECT asset_id FROM marketing_derivations').fetchone()[0],'asset-one')
  self.assertEqual(self.db.execute("SELECT title FROM marketing_items WHERE id='material-one'").fetchone()[0],'material-one')
 def test_counts_and_referential_integrity(self):
  self.assertEqual(self.db.execute('SELECT count(*) FROM exhibitions').fetchone()[0],34);self.assertEqual(self.db.execute('SELECT count(*) FROM venues').fetchone()[0],151);self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(),[])
 def test_import_rerun_preserves_notes_and_exclusions(self):
  self.db.execute("INSERT INTO record_notes(entity_type,entity_id,text,review,updated_by) VALUES('exhibition','atm','Manual decision','Shortlisted','test')")
  venue=self.db.execute('SELECT id,payload FROM venues LIMIT 1').fetchone();self.db.execute("INSERT INTO exclusions(id,snapshot,removed_by) VALUES(?,?,'test')",venue);self.db.commit();self.db.executescript((ROOT/'seed.sql').read_text(encoding='utf-8'))
  self.assertEqual(self.db.execute("SELECT text FROM record_notes").fetchone()[0],'Manual decision');self.assertEqual(self.db.execute('SELECT count(*) FROM exclusions').fetchone()[0],1);self.assertEqual(self.db.execute('SELECT count(*) FROM exhibitions').fetchone()[0],34)
 def test_changed_record_id_keeps_excluded_identity(self):
  venue=self.db.execute('SELECT id,payload FROM venues LIMIT 1').fetchone();self.db.execute("INSERT INTO exclusions(id,snapshot,removed_by) VALUES(?,?,'test')",venue);self.db.commit()
  renamed=json.loads(venue[1]);renamed['id']='rediscovered-record'
  statement=subprocess.run(['node','--input-type=module','-e',"import {venueStatements} from './scripts/venue-seed.mjs'; let input='';for await(const chunk of process.stdin)input+=chunk;console.log(venueStatements(JSON.parse(input)).join('\\n'));"],input=json.dumps(renamed),capture_output=True,text=True,encoding="utf-8",cwd=ROOT,check=True).stdout
  self.db.executescript(statement)
  self.assertEqual(self.db.execute('SELECT count(*) FROM venues').fetchone()[0],151)
  self.assertEqual(self.db.execute("SELECT venue_id FROM venue_identity_keys WHERE key='record:rediscovered-record'").fetchone()[0],venue[0])
  self.assertEqual(self.db.execute('SELECT count(*) FROM venues WHERE id NOT IN (SELECT id FROM exclusions)').fetchone()[0],150)
 def test_alert_review_survives_reimport(self):
  event=self.db.execute('SELECT id FROM alert_events LIMIT 1').fetchone()[0]
  self.db.execute("INSERT INTO alert_reviews(alert_id,status,note,updated_by) VALUES(?,'reviewed','Owner note','test')",(event,));self.db.commit()
  self.db.executescript((ROOT/'alerts.seed.sql').read_text(encoding='utf-8'))
  self.assertEqual(self.db.execute('SELECT count(*) FROM alert_events').fetchone()[0],15)
  self.assertEqual(self.db.execute('SELECT note FROM alert_reviews').fetchone()[0],'Owner note')
  self.assertEqual(self.db.execute("SELECT count(*) FROM venue_collections WHERE collection='melbourne'").fetchone()[0],147)
 def test_trigger_revision_and_priority_constraints(self):
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("INSERT INTO trigger_settings(id,enabled,priority) VALUES('bad',1,'high')")
  self.db.execute("UPDATE trigger_settings SET enabled=0,priority='minor' WHERE id='opening-jobs'");self.db.commit()
  self.db.executescript((ROOT/'alerts.seed.sql').read_text(encoding='utf-8'))
  self.assertEqual(self.db.execute("SELECT enabled,priority FROM trigger_settings WHERE id='opening-jobs'").fetchone(),(0,'minor'))
 def test_all_research_references_resolve(self):
  ids={x[0] for x in self.db.execute("SELECT source_id FROM source_collections WHERE collection='exhibitions'")}
  meta=json.loads(self.db.execute("SELECT payload FROM dataset_metadata WHERE key='exhibitions'").fetchone()[0]);
  for v in meta['visas']:
   for source in v.get('sourceIds',[]):self.assertIn(source,ids)
  for payload, in self.db.execute('SELECT payload FROM exhibitions'):
   for source in json.loads(payload)['sourceIds']:self.assertIn(source,ids)
 def test_physical_progress_does_not_create_customer(self):
  self.assertGreater(self.db.execute("SELECT count(*) FROM venues WHERE physical_stage='open'").fetchone()[0],0);self.assertEqual(self.db.execute('SELECT count(*) FROM opportunities').fetchone()[0],0);self.assertEqual(self.db.execute('SELECT count(*) FROM milestone_confirmations').fetchone()[0],0)
 def test_invalid_status_and_orphan_record_rejected(self):
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("INSERT INTO work_projects(id,name,workstream,work_type,status) VALUES('bad','Bad','readiness','general','half_done')")
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("INSERT INTO tasks(id,project_id,title) VALUES('bad','missing','Bad')")
 def test_stale_note_rolls_back_whole_transaction(self):
  self.db.execute("INSERT INTO record_notes(entity_type,entity_id,text,review,updated_by,revision) VALUES('exhibition','atm','Newer note','Shortlisted','test',2)");self.db.commit()
  with self.assertRaises(sqlite3.IntegrityError):
   with self.db:
    self.db.execute("INSERT INTO work_projects(id,name,workstream,work_type) VALUES('rollback','Must roll back','readiness','general')")
    self.db.execute("UPDATE record_notes SET text='Stale',revision=CASE WHEN revision=1 THEN revision+1 ELSE NULL END WHERE entity_id='atm'")
  self.assertEqual(self.db.execute("SELECT text FROM record_notes").fetchone()[0],'Newer note');self.assertIsNone(self.db.execute("SELECT id FROM work_projects WHERE id='rollback'").fetchone())
if __name__=='__main__':unittest.main()
