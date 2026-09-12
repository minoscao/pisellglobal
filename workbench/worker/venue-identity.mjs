export const normalize = value => String(value||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
export function identityKeys(record) {
  const keys=['record:'+record.id];
  if(record.placeId) keys.push('place:'+record.placeId);
  const address=normalize(record.address);
  if(address && !/unconfirmed|unknown|notpublished/.test(address)) {
    for(const name of [record.name,...(record.aliases||[])]) keys.push('venue:'+normalize(name)+'@'+address);
  }
  return [...new Set(keys)];
}
export function isExcluded(record,keys) { return identityKeys(record).some(key=>keys.has(key)); }
