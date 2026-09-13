export const CHANNELS=['Instagram','Facebook','TikTok','RedNote','YouTube'];
export const CHANNEL_METRICS=[['followers','Followers'],['page_likes','Page likes'],['posts','Lifetime posts'],['checkins','Check-ins'],['talking_about','Talking about']];
export function primaryChannel(record,platform){return (record.socialInfo?.channels||[]).filter(c=>c.platform===platform).sort((a,b)=>(b.metrics?.length||0)-(a.metrics?.length||0))[0]||null;}
export function metricValue(channel,key){const m=channel?.metrics?.find(m=>m.metric===key);return m&&Number.isFinite(m.value)&&m.value>=0?m:null;}
export function channelSummary(record){return [['Instagram','followers','IG followers'],['Facebook','page_likes','FB page likes']].map(([p,k,label])=>{const m=metricValue(primaryChannel(record,p),k);return m?{...m,label}:null}).filter(Boolean);}
export function barPair(value,reference){const max=Math.max(value??0,reference??0,1);return {value:value===null?null:value/max*100,reference:reference===null?null:reference/max*100};}
