import {WORKSTREAMS,PROJECT_STATUS,TASK_STATUS} from '../public/config.js';
export {WORKSTREAMS,PROJECT_STATUS,TASK_STATUS};
export const uid = () => crypto.randomUUID();
export const eventIdentity = e => [e.name,e.country,e.start?.slice(0,4)].map(x=>String(x||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')).join('|');
export const safeUrl = value => {try {const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}};
export function validateProject(p){
 if(typeof p.name!=='string'||!p.name.trim()||p.name.length>200)throw Error('Enter a project name, up to 200 characters.');
 if(!Object.hasOwn(WORKSTREAMS,p.workstream))throw Error('Choose a workstream.');
 if(p.status&&!PROJECT_STATUS.includes(p.status))throw Error('Choose a valid project status.');
 if(p.due_date&&!/^\d{4}-\d{2}-\d{2}$/.test(p.due_date))throw Error('Choose a valid due date.');
 if(p.exhibition_level&&![1,2,3].includes(Number(p.exhibition_level)))throw Error('Choose an exhibition level.');
 for(const k of ['country','next_action','deliverable','outcome','work_type'])if(p[k]!=null&&(typeof p[k]!=='string'||p[k].length>5000))throw Error('The '+k.replaceAll('_',' ')+' is too long.');
 return p;
}
export function exhibitionTasks(level){
 const base=['Confirm objectives, budget and attendee','Confirm visit dates and travel','Prepare target companies and meetings','Record meetings and evidence','Assign follow-up and reconcile costs'];
 if(level>=2)base.splice(2,0,'Confirm booth and demonstration scope','Prepare sales materials and enquiry capture','Check equipment, network and staffing');
 if(level>=3)base.splice(3,0,'Approve booth layout and supplier scope','Confirm shipping and return logistics','Complete build inspection and defect resolution');
 return base;
}
