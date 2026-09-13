CREATE TABLE approach_plans (
 id TEXT PRIMARY KEY,
 venue_id TEXT REFERENCES venues(id),
 project_id TEXT REFERENCES work_projects(id),
 version INTEGER NOT NULL CHECK(version > 0),
 title TEXT NOT NULL,
 summary TEXT NOT NULL DEFAULT '',
 content_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(content_json)),
 status TEXT NOT NULL CHECK(status IN ('draft','ready')),
 pdf_file_id TEXT REFERENCES files(id),
 prepared_in TEXT NOT NULL DEFAULT 'GPT',
 prepared_at TEXT NOT NULL,
 created_by TEXT NOT NULL REFERENCES users(id),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK((venue_id IS NOT NULL) != (project_id IS NOT NULL)),
 CHECK(status != 'ready' OR pdf_file_id IS NOT NULL)
);
CREATE UNIQUE INDEX approach_venue_version ON approach_plans(venue_id,version) WHERE venue_id IS NOT NULL;
CREATE UNIQUE INDEX approach_project_version ON approach_plans(project_id,version) WHERE project_id IS NOT NULL;
