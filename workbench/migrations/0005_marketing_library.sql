CREATE TABLE marketing_items (
 id TEXT PRIMARY KEY,
 kind TEXT NOT NULL CHECK(kind IN ('asset','material')),
 title TEXT NOT NULL,
 category TEXT NOT NULL,
 language TEXT NOT NULL,
 format TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','ready','archived')),
 version TEXT NOT NULL DEFAULT 'v1',
 description TEXT NOT NULL DEFAULT '',
 source_note TEXT NOT NULL DEFAULT '',
 file_id TEXT NOT NULL REFERENCES files(id),
 preview_file_id TEXT REFERENCES files(id),
 thumbnail_file_id TEXT REFERENCES files(id),
 owner_id TEXT NOT NULL REFERENCES users(id),
 revision INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX marketing_filters ON marketing_items(kind,category,language,format,status);
CREATE TABLE marketing_derivations (
 material_id TEXT NOT NULL REFERENCES marketing_items(id),
 asset_id TEXT NOT NULL REFERENCES marketing_items(id),
 PRIMARY KEY(material_id,asset_id),CHECK(material_id!=asset_id)
);
CREATE TRIGGER marketing_derivation_types BEFORE INSERT ON marketing_derivations
WHEN (SELECT kind FROM marketing_items WHERE id=NEW.material_id)!='material' OR (SELECT kind FROM marketing_items WHERE id=NEW.asset_id)!='asset'
BEGIN SELECT RAISE(ABORT,'Materials must reference source assets'); END;
CREATE TRIGGER marketing_kind_immutable BEFORE UPDATE OF kind ON marketing_items WHEN NEW.kind!=OLD.kind
BEGIN SELECT RAISE(ABORT,'Item kind cannot change'); END;
CREATE TABLE marketing_uploads (
 id TEXT PRIMARY KEY,object_key TEXT NOT NULL,upload_id TEXT NOT NULL,name TEXT NOT NULL,content_type TEXT NOT NULL,
 bytes INTEGER NOT NULL,owner_id TEXT NOT NULL REFERENCES users(id),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 file_id TEXT REFERENCES files(id)
);
CREATE TABLE marketing_upload_parts (
 upload_id TEXT NOT NULL REFERENCES marketing_uploads(id),part_number INTEGER NOT NULL,etag TEXT NOT NULL,bytes INTEGER NOT NULL,
 PRIMARY KEY(upload_id,part_number)
);
