import sqlite3, pathlib, json, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
class DatabaseTest(unittest.TestCase):
 def setUp(self):
  self.db=sqlite3.connect(':memory:');self.db.executescript((ROOT/'migrations/0001_growth.sql').read_text(encoding='utf-8'));self.db.executescript((ROOT/'seed.sql').read_text(encoding='utf-8'));self.db.execute("INSERT INTO users(id,email,name,password_hash,password_salt,role) VALUES('test','test@example.com','Test','hash','salt','admin')");self.db.commit()
 def tearDown(self):self.db.close()
 def test_counts_and_referential_integrity(self):
  self.assertEqual(self.db.execute('SELECT count(*) FROM exhibitions').fetchone()[0],34);self.assertEqual(self.db.execute('SELECT count(*) FROM venues').fetchone()[0],147);self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(),[])
 def test_import_rerun_preserves_notes_and_exclusions(self):
  self.db.execute("INSERT INTO record_notes(entity_type,entity_id,text,review,updated_by) VALUES('exhibition','atm','Manual decision','Shortlisted','test')")
  venue=self.db.execute('SELECT id,payload FROM venues LIMIT 1').fetchone();self.db.execute("INSERT INTO exclusions(id,snapshot,removed_by) VALUES(?,?,'test')",venue);self.db.commit();self.db.executescript((ROOT/'seed.sql').read_text(encoding='utf-8'))
  self.assertEqual(self.db.execute("SELECT text FROM record_notes").fetchone()[0],'Manual decision');self.assertEqual(self.db.execute('SELECT count(*) FROM exclusions').fetchone()[0],1);self.assertEqual(self.db.execute('SELECT count(*) FROM exhibitions').fetchone()[0],34)
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
