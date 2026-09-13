CREATE TABLE trigger_settings (
 id TEXT PRIMARY KEY, enabled INTEGER NOT NULL CHECK(enabled IN (0,1)),
 priority TEXT NOT NULL CHECK(priority IN ('important','medium','minor')),
 revision INTEGER NOT NULL DEFAULT 1, updated_by TEXT REFERENCES users(id),
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE alert_events (
 id TEXT PRIMARY KEY, venue_id TEXT NOT NULL REFERENCES venues(id),
 event_key TEXT NOT NULL, trigger_id TEXT NOT NULL,
 observed_on TEXT NOT NULL, payload TEXT NOT NULL CHECK(json_valid(payload)),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(venue_id,event_key)
);
CREATE INDEX alert_events_latest ON alert_events(observed_on DESC);
CREATE TABLE venue_collections (venue_id TEXT NOT NULL REFERENCES venues(id), collection TEXT NOT NULL, PRIMARY KEY(venue_id,collection));
INSERT INTO venue_collections SELECT id,'melbourne' FROM venues;
CREATE TABLE alert_reviews (
 alert_id TEXT PRIMARY KEY REFERENCES alert_events(id),
 status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewed','snoozed','resolved')),
 note TEXT NOT NULL DEFAULT '', owner_id TEXT REFERENCES users(id), next_action TEXT NOT NULL DEFAULT '',
 revision INTEGER NOT NULL DEFAULT 1, updated_by TEXT NOT NULL REFERENCES users(id),
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE alert_sources (
 alert_id TEXT NOT NULL REFERENCES alert_events(id), source_id TEXT NOT NULL REFERENCES sources(id),
 PRIMARY KEY(alert_id,source_id)
);
