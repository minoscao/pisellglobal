import {identityKeys} from '../worker/venue-identity.mjs';
const q=v=>v==null?'NULL':"'"+String(v).replaceAll("'","''")+"'";
export function venueStatements(v,sourceIds=[]) {
  const keys=identityKeys(v),matches=keys.map(q).join(',');
  const row={id:v.id,name:v.name,country:v.country||'Australia',city:v.suburb||'Melbourne',address:v.address,physical_stage:v.phase||'unknown',confidence:v.confidence||'low',latitude:v.location?.lat??v.coordinates?.lat??null,longitude:v.location?.lng??v.coordinates?.lng??null,payload:JSON.stringify(v)};
  const canonical=`COALESCE((SELECT id FROM venues WHERE id=${q(v.id)}),(SELECT venue_id FROM venue_identity_keys WHERE key IN (${matches}) ORDER BY venue_id LIMIT 1))`;
  return [
    `INSERT INTO venues (${Object.keys(row).join(',')}) SELECT ${Object.values(row).map(q).join(',')} WHERE NOT EXISTS (SELECT 1 FROM venue_identity_keys WHERE key IN (${matches})) ON CONFLICT(id) DO NOTHING;`,
    ...keys.map(key=>`INSERT INTO venue_identity_keys (key,venue_id) VALUES (${q(key)},${canonical}) ON CONFLICT DO NOTHING;`),
    ...sourceIds.map(id=>`INSERT INTO venue_sources (venue_id,source_id) VALUES (${canonical},${q(id)}) ON CONFLICT DO NOTHING;`)
  ];
}
