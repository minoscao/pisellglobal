export const DETAIL_TABS=[['summary','Summary'],['evidence','Evidence'],['approach','Approaching Plan']];
export const detailTabs=(count=0)=>`<nav class="record-detail-tabs" role="tablist" aria-label="Record details">${DETAIL_TABS.map(([id,label],i)=>`<button type="button" role="tab" id="record-tab-${id}" aria-controls="record-panel-${id}" aria-selected="${!i}" tabindex="${i?-1:0}" data-record-tab="${id}">${label}${id==='evidence'?` <span>${count}</span>`:''}</button>`).join('')}</nav>`;
export function bindDetailTabs(root,onSelect=()=>{}){
 const tabs=[...root.querySelectorAll('[data-record-tab]')];
 const select=b=>{tabs.forEach(t=>{const active=t===b;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});root.querySelectorAll('[data-record-panel]').forEach(p=>{p.hidden=p.dataset.recordPanel!==b.dataset.recordTab;p.id='record-panel-'+p.dataset.recordPanel;p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby','record-tab-'+p.dataset.recordPanel);});onSelect(b.dataset.recordTab);};
 tabs.forEach((b,i)=>{b.onclick=()=>select(b);b.onkeydown=e=>{const next=e.key==='ArrowRight'?(i+1)%tabs.length:e.key==='ArrowLeft'?(i+tabs.length-1)%tabs.length:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;if(next!==null){e.preventDefault();select(tabs[next]);tabs[next].focus();}};});if(tabs[0])select(tabs[0]);
}
