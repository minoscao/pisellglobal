CREATE TABLE customer_profiles (
 company_id TEXT PRIMARY KEY REFERENCES companies(id), source_system TEXT NOT NULL, external_id TEXT NOT NULL,
 service_status TEXT NOT NULL CHECK(service_status IN ('servicing','on_hold','ended')), country TEXT NOT NULL,
 city TEXT, address TEXT, location_precision TEXT, latitude REAL, longitude REAL, industry TEXT, cover_url TEXT,
 profile_json TEXT NOT NULL CHECK(json_valid(profile_json)), status_evidence TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(source_system,external_id)
);
CREATE TABLE customer_projects (
 project_id TEXT PRIMARY KEY REFERENCES work_projects(id), order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
 service_status TEXT NOT NULL CHECK(service_status IN ('servicing','on_hold','ended')), source_system TEXT NOT NULL, external_id TEXT NOT NULL,
 UNIQUE(source_system,external_id)
);
ALTER TABLE orders ADD COLUMN amount_minor INTEGER CHECK(amount_minor IS NULL OR amount_minor>=0);
ALTER TABLE orders ADD COLUMN currency TEXT;
ALTER TABLE orders ADD COLUMN amount_reference TEXT;
ALTER TABLE orders ADD COLUMN payments_complete INTEGER NOT NULL DEFAULT 0 CHECK(payments_complete IN (0,1));
ALTER TABLE orders ADD COLUMN revision INTEGER NOT NULL DEFAULT 1;
CREATE UNIQUE INDEX payment_reference_unique ON payments(order_id,reference);
CREATE TABLE research_coverage (country TEXT PRIMARY KEY, scope TEXT NOT NULL, checked_at TEXT NOT NULL, completeness TEXT NOT NULL CHECK(completeness IN ('partial','complete')));
INSERT INTO research_coverage VALUES ('Australia','Greater Melbourne venue inventory; selected Australian signals','2026-09-13','partial'),('Thailand','Selected sourced venue projects','2026-09-12','partial');
