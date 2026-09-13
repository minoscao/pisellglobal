// One catalogue for the settings UI, saved preferences and research runs.
export const PRIORITIES={important:'Important',medium:'Medium',minor:'Minor'};
const rule=(id,group,title,priority,signal,sources,verify)=>({id,group,title,priority,enabled:true,signal,sources,verify});
export const TRIGGERS=[
 rule('founder-intent','Planning','Founder announcement','important','An identifiable operator says they are starting a play venue.','Founder interviews · LinkedIn · Instagram · TikTok · Facebook','Retain the original statement and date. Aspirations are not a secured site.'),
 rule('site-search','Planning','Site search','important','An operator requests a warehouse, mall unit or site for indoor play.','Commercial agents · Operator posts · Public property requests','Connect the request to an operator and target region; do not invent an address.'),
 rule('franchise-project','Planning','Franchise commitment','medium','A named franchisee or territory has a proposed new location.','Brand news · Franchise announcements · Interviews','Generic franchise advertising is not a specific project.'),
 rule('project-funding','Planning','Project funding','medium','Funding, investors or crowdfunding are announced for a named venue.','Operator announcements · Public funding pages · Local news','Link funds to this project. Fundraising is not secured finance.'),
 rule('lease-signed','Planning','Lease / tenant agreement','important','A landlord or operator announces a signed tenancy.','Mall leasing news · Commercial agents · Operator posts','Identify tenant, address and intended use; tenant handover is not opening.'),
 rule('planning-application','Planning','Planning application','important','An application names indoor recreation, children’s play or a similar use.','Council planning portals · Public notices · Application documents','Check proposed use, applicant, site and application status; exclude unrelated recreation.'),
 rule('planning-decision','Planning','Approval / conditions','important','A relevant application is approved, refused or materially amended.','Council decisions · Permit conditions · Public meeting minutes','Record the decision separately from construction. A permit is not proof of site work.'),
 rule('design-release','Planning','Drawings / renders','important','A site-specific layout, architect appointment or render is published.','Architects · Operators · Mall presentations · Supplier portfolios','Confirm the site and original date. Concept renders are not construction photos.'),
 rule('fitout-tender','Planning','Fit-out / systems tender','important','A named venue requests equipment, fit-out, booking or POS suppliers.','Public tenders · Operator requests · Contractors · LinkedIn','Check scope, closing date and whether supplier selection is still open.'),
 rule('site-works','Construction','Site works','important','Dated site photos show actual fit-out for the named venue.','Contractor posts · Instagram · TikTok · Operator updates','Match site and tenant; mall shell construction alone is insufficient.'),
 rule('equipment-installation','Construction','Equipment installation','important','A supplier shows installation or site-specific delivery.','Equipment suppliers · Installers · Social video','Confirm this site and date; exclude old showcases, factory demos and reused clips.'),
 rule('signage','Construction','New signage','medium','Branded hoarding or signage appears at a matched location.','Mall posts · Street photos · Google Maps photos · Social','Confirm photo timing and branch. Signage alone does not establish opening.'),
 rule('systems-selection','Construction','Software / hardware selection','important','The operator publicly asks for or tests operational systems.','Operator posts · Vendor announcements · Public procurement','Record requested functions and buying window; a vendor logo alone is not an active tender.'),
 rule('opening-jobs','Pre-opening','Opening team recruitment','important','A job listing explicitly refers to a new site or opening team.','SEEK · Indeed · LinkedIn · Operator careers · Social','Verify branch and listing date; routine replacement hiring is not a new opening.'),
 rule('opening-date','Pre-opening','Opening announcement / date change','important','The operator announces, postpones or confirms an opening window.','Operator website · Social accounts · Mall announcements','Store old and new dates plus precision; do not convert a month into an exact day.'),
 rule('presales','Pre-opening','Presales / bookings','important','Opening memberships, first party bookings or tickets become available.','Operator booking page · Ticketing · Social campaigns','Distinguish bookable dates from actual trading; do not complete a purchase.'),
 rule('soft-opening','Pre-opening','Soft / partial opening','important','An invitation, trial opening or only one venue zone opens.','Operator posts · Local media · Visitor posts','Name the open zone; courts or a café do not establish that children’s play is open.'),
 rule('training','Pre-opening','Team training / commissioning','medium','Staff training or operational commissioning is shown.','Operator posts · Equipment vendors · Social video','Verify venue and timing; general staff training is not proof of an imminent opening.'),
 rule('actual-opening','Operating','Actual opening','important','The venue is confirmed trading at the identified location.','Operator confirmation · Bookable sessions · Recent visitor evidence','Separate reported opening day from first evidence of operation.'),
 rule('booking-friction','Operating','Booking / entry problems','important','Specific recent reports describe lost bookings, duplicate bookings or entry failures.','Google reviews · Public social comments · Operator responses','Retain date and wording; one complaint is a review candidate, not a proven systemic defect.'),
 rule('payment-friction','Operating','Payment / refund problems','important','Reports describe duplicate charges, payment mismatches or failed refunds.','Public reviews · Operator responses · Public support posts','Do not infer a software cause without corroboration or operator confirmation.'),
 rule('membership-friction','Operating','Membership / party problems','important','Reports describe missing entitlements, party administration or waiver mismatches.','Public reviews · Social comments · Operator responses','Identify concrete behaviour and recency; poor service alone is not a systems fault.'),
 rule('multiple-tools','Operating','Multiple systems observed','minor','Public pages show different booking, POS, membership or waiver providers.','Official website · Public booking and waiver flows · Vendor case studies','Record providers as observations only; multiple tools do not prove unsynchronised data.'),
 rule('data-disconnection','Operating','Evidence of disconnected data','important','The operator or specific evidence describes re-entry, mismatched records or manual reconciliation.','Operator interviews · Public job descriptions · Vendor migration case studies','A job description is a clue; establish an actual integration gap before qualification.'),
 rule('upgrade-intent','Expansion & change','Upgrade / replacement intent','important','The operator states an intention to replace or upgrade systems or facilities.','Operator posts · Tenders · Public interviews','Check scope, decision maker and timing; venue age alone is not upgrade intent.'),
 rule('new-branch','Expansion & change','New branch / relocation','important','An existing operator announces a new site, relocation or larger premises.','Brand website · Mall news · Commercial agents · Social','Create a linked project; never reuse the old branch address for an unknown new site.'),
 rule('new-modules','Expansion & change','New business modules','important','A venue adds a café, sports zone, memberships or other operating activity.','Operator announcements · Planning documents · Website changes','Differentiate a planned module from one already operating.'),
 rule('ownership-change','Expansion & change','Sale / ownership change','medium','A named venue is for sale or has an announced new owner.','Business sale listings · Operator announcements · Public registers','Match branch explicitly. An anonymous business listing cannot be assigned by similarity.'),
 rule('group-integration','Expansion & change','Group integration','important','A group acquires venues or announces shared operations across businesses.','Corporate announcements · Annual reports · Operator interviews','Record group and sites separately; do not assume every site needs replacement.'),
 rule('closure-relaunch','Expansion & change','Closure / relaunch','medium','A site pauses, closes, rebrands or announces a reopening.','Operator updates · Mall statements · Recent public evidence','Check permanent versus temporary closure; retain identity history and exclusions.'),
 rule('turnover-disclosure','Commercial intelligence','Turnover disclosure','medium','A named venue publishes sales figures or an owner-authorised financial statement is supplied.','Public sale memorandum · Operator report · Authorised accounts','Retain period, AUD, branch identity, scope and evidence type. Asking price is not turnover.'),
 rule('financial-publication','Commercial intelligence','Entity / group financial report','minor','A matched legal entity publishes accounts or appears in an ATO transparency report.','ATO public corporate report · Company annual report','Keep entity total income distinct from venue turnover; never spread group income over branches.'),
 rule('conflicting-evidence','Evidence changes','Conflicting claims','important','New evidence contradicts a critical address, opening or project-status claim.','All original source channels','Retain both claims and seek a newer primary source; do not silently overwrite.'),
 rule('new-discovery-pattern','Evidence changes','New discovery pattern','medium','Several genuine leads share a new phrase, source or project characteristic.','Cross-source comparisons from the current research run','Propose an additional search pattern with examples; do not override saved switches or priority.'),
 rule('stale-critical-claim','Evidence changes','Missed milestone / stale claim','medium','A reported opening or critical milestone passes without corroboration.','Existing timeline · Operator and mall re-check','A missed date triggers verification, not an assertion that the project failed.')
];
export function mergeTriggers(overrides=[]){const saved=new Map(overrides.map(x=>[x.id,x]));return TRIGGERS.map(t=>{const s=saved.get(t.id);return {...t,enabled:s?!!s.enabled:t.enabled,priority:s&&PRIORITIES[s.priority]?s.priority:t.priority,updatedAt:s?.updated_at||null}})}
export function evaluateTrigger(signal,settings){
 const t=settings.find(x=>x.id===signal.triggerId);
 if(!t||!t.enabled||signal.excluded||!signal.inScope||!signal.materialChange||!signal.projectId||!signal.evidence?.length)return null;
 return {projectId:signal.projectId,triggerId:t.id,priority:t.priority,evidence:signal.evidence,confidence:signal.confidence||'unverified',reviewRequired:true};
}
export const REVENUE_BANDS=[
 {id:'million',label:'A$1m+',min:1000000,color:'#dc2626'},
 {id:'half',label:'A$500k–<1m',min:500000,color:'#f28b24'},
 {id:'mid',label:'A$200k–<500k',min:200000,color:'#24834b'},
 {id:'small',label:'Under A$200k',min:0,color:'#b8e6b2'},
 {id:'unknown',label:'Unknown / not comparable',color:'#87919c'}
];
export function revenueBand(r){
 const a=r?.revenueInfo;
 const valid=a&&a.currency==='AUD'&&a.scope==='venue'&&a.metric==='turnover'&&a.periodType==='year'&&a.periodLabel&&['verified','reported'].includes(a.status)&&/^https?:\/\//.test(a.source||'');
 if(!valid)return REVENUE_BANDS[4];
 const low=a.amount??a.min,high=a.amount??a.max;
 if(!Number.isFinite(low)||!Number.isFinite(high)||low<0||high<low)return REVENUE_BANDS[4];
 const pick=n=>REVENUE_BANDS.find(b=>b.min!==undefined&&n>=b.min);
 return pick(low).id===pick(high).id?pick(low):REVENUE_BANDS[4];
}
