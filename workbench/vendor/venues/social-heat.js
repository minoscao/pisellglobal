export const SOCIAL_CONFIG={
 version:'social-heat-v1',benchmarkId:'au-melbourne-rainbow-town-play-centre-glen-waverley',
 benchmarkName:'Rainbow Town · Glen Waverley',reference:100,windowDays:30,
 metrics:[{key:'interactions',label:'Likes + comments',weight:.5},{key:'mentions',label:'Distinct customer / creator mentions',weight:.3},{key:'posts',label:'Venue posts',weight:.2}],
 platforms:['Instagram','Facebook','TikTok','RedNote']
};
const day=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')?Date.parse(s+'T00:00:00Z'):NaN;
function valid(s){return s&&s.method===SOCIAL_CONFIG.version&&s.scope==='venue'&&s.branchVerified===true&&s.coverage==='reviewed_sample'&&s.protocolId&&Number.isFinite(day(s.observedOn))&&day(s.observedOn)>=day(s.windowEnd)&&day(s.windowEnd)-day(s.windowStart)===(SOCIAL_CONFIG.windowDays-1)*86400000&&Array.isArray(s.platforms)&&s.platforms.length>0&&new Set(s.platforms.map(p=>p.name)).size===s.platforms.length&&s.platforms.every(p=>SOCIAL_CONFIG.platforms.includes(p.name)&&p.sources?.length&&p.sources.every(u=>/^https?:\/\//.test(u))&&SOCIAL_CONFIG.metrics.every(m=>Number.isFinite(p.metrics?.[m.key])&&p.metrics[m.key]>=0));}
export function socialIndex(record,records){
 const reference=records.find(r=>r.id===SOCIAL_CONFIG.benchmarkId);
 const empty={score:null,status:'Awaiting comparable sample',platforms:[],trend:null};
 if(!reference)return {...empty,status:'Reference unavailable'};
 const baseSamples=(reference.socialInfo?.samples||[]).filter(valid).sort((a,b)=>b.windowEnd.localeCompare(a.windowEnd));
 if(record.id===SOCIAL_CONFIG.benchmarkId)return {score:100,status:baseSamples.length?'Reference · sampled':'Reference only · sample pending',platforms:baseSamples[0]?.platforms.map(p=>p.name)||[],sample:baseSamples[0]||null,trend:null,reference:true};
 const candidates=(record.socialInfo?.samples||[]).filter(valid).sort((a,b)=>b.windowEnd.localeCompare(a.windowEnd));
 const results=[];
 for(const s of candidates){
  const names=s.platforms.map(p=>p.name).sort().join('|');
  const b=baseSamples.find(b=>b.windowStart===s.windowStart&&b.windowEnd===s.windowEnd&&b.observedOn===s.observedOn&&b.protocolId===s.protocolId&&b.platforms.map(p=>p.name).sort().join('|')===names);
  if(!b||b.platforms.some(p=>SOCIAL_CONFIG.metrics.some(m=>p.metrics[m.key]<=0)))continue;
  const score=100*s.platforms.reduce((sum,p)=>{const bp=b.platforms.find(x=>x.name===p.name);return sum+SOCIAL_CONFIG.metrics.reduce((a,m)=>a+m.weight*p.metrics[m.key]/bp.metrics[m.key],0)},0)/s.platforms.length;
  results.push({score:Math.round(score),status:'Observed sample index',platforms:s.platforms.map(p=>p.name),sample:s,reference:false,trend:null});
 }
 if(!results.length)return empty;
 const result=results[0],previous=results.find(x=>x.sample.windowEnd<result.sample.windowStart&&x.sample.protocolId===result.sample.protocolId&&x.platforms.slice().sort().join('|')===result.platforms.slice().sort().join('|'));
 if(previous)result.trend=result.score-previous.score;
 return result;
}
export const SOCIAL_BANDS=[{id:'above',label:'Above reference (>100)',color:'#9a71d5'},{id:'reference',label:'Reference / equal (100)',color:'#c1a4e4'},{id:'below',label:'Below reference (<100)',color:'#dfd2ef'},{id:'unknown',label:'Awaiting sample',color:'#87919c'}];
export function socialBand(result){return result.score===null?SOCIAL_BANDS[3]:result.score>100?SOCIAL_BANDS[0]:result.score===100?SOCIAL_BANDS[1]:SOCIAL_BANDS[2];}
