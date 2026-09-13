import {loadGoogleMaps,PISELL_MAP_STYLE} from './google-maps.js';
let boundaries;
const aliases={'United States of America':'United States'};
const nameOf=f=>aliases[f.getProperty('name')]||f.getProperty('name');
export async function mountFootprint({target,api,projects,regions,selected,showDrawer,esc,openProject}){
 const [google,research,geo]=await Promise.all([loadGoogleMaps(),api('/api/footprint'),boundaries||(boundaries=fetch('/countries.geojson').then(r=>{if(!r.ok)throw Error('Country outlines unavailable.');return r.json();}).catch(e=>{boundaries=null;throw e;}))]);
 if(!target.isConnected)return;
 const countries=new Map(research.countries.map(r=>[r.country,{...r,projects:0}]));
 for(const p of projects){if(!p.country)continue;if(!countries.has(p.country))countries.set(p.country,{country:p.country,venues:0,exhibitions:0,projects:0});countries.get(p.country).projects++;}
 const panel=target.closest('.map-panel');panel.querySelector('[data-footprint-summary]').textContent=`${countries.size} regions with data`;
 const map=new google.maps.Map(target,{center:{lat:18,lng:15},zoom:1,minZoom:0,maxZoom:18,styles:PISELL_MAP_STYLE,mapTypeControl:false,streetViewControl:false,fullscreenControl:true,zoomControl:false,gestureHandling:'cooperative',isFractionalZoomEnabled:true});
 const fit=()=>{map.setCenter({lat:18,lng:15});map.setZoom(Math.max(0,Math.log2(target.clientWidth/256)-.06));};fit();
 map.data.addGeoJson(geo);
 map.data.setStyle(feature=>({visible:countries.has(nameOf(feature)),fillColor:'#EF4323',fillOpacity:nameOf(feature)===selected?.55:.35,strokeColor:'#D74725',strokeWeight:1,strokeOpacity:.8,clickable:true}));
 map.data.addListener('mouseover',e=>map.data.overrideStyle(e.feature,{fillOpacity:.6,strokeWeight:2}));
 map.data.addListener('mouseout',e=>map.data.revertStyle(e.feature));
 map.data.addListener('click',e=>openCountry(nameOf(e.feature)));
 map.addListener('dragstart',()=>document.querySelector('#detail')?.close());
 const chooser=panel.querySelector('[data-footprint-country]');chooser.innerHTML='<option value="">Explore a region…</option>'+[...countries.keys()].sort().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');chooser.onchange=()=>{if(chooser.value)openCountry(chooser.value);};
 class RegionPin extends google.maps.OverlayView{
  constructor(position,country,options={}){super();this.position=position;this.country=country;this.options=options;this.setMap(map);}
  onAdd(){this.button=document.createElement('button');this.button.className='footprint-pin';const r=countries.get(this.country);this.button.setAttribute('aria-label',this.options.label||`${this.country}: ${r.venues} venues, ${r.exhibitions} exhibitions, ${r.projects} projects`);this.button.title=this.button.getAttribute('aria-label');this.button.innerHTML=`<i></i><span>${esc(this.options.label||this.country)}</span>`;this.button.onclick=e=>{e.stopPropagation();(this.options.open||(()=>openCountry(this.country)))();};google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.button);this.getPanes().overlayMouseTarget.append(this.button);}
  draw(){const p=this.getProjection().fromLatLngToDivPixel(this.position);if(this.button&&p){this.button.style.left=p.x+'px';this.button.style.top=p.y+'px';}}
  onRemove(){this.button?.remove();}
 }
 const pins=[];map.data.forEach(f=>{const country=nameOf(f);if(countries.has(country))pins.push(new RegionPin(new google.maps.LatLng(f.getProperty('labelLat'),f.getProperty('labelLng')),country));});
 for(const p of projects.filter(p=>p.latitude!=null&&p.longitude!=null))pins.push(new RegionPin(new google.maps.LatLng(p.latitude,p.longitude),p.country,{label:p.name,open:()=>openProject(p.id)}));
 target.dataset.loaded='true';target.dataset.coloredCountries=String(pins.length);
 async function openCountry(country){const count=countries.get(country);if(!count)return;chooser.value=country;
  const region=regions.find(r=>r.country===country||r.name===country),regionNote=region?.level?`Level ${region.level} · ${region.description||'Regional presence'}`:country==='Australia'?'Level 1 · Established operations':'Regional presence level not confirmed';
  showDrawer('Regional footprint',`<h1>${esc(country)}</h1><p class="meta">${esc(regionNote)}</p><div class="footprint-counts">${[['venues','Venues'],['exhibitions','Exhibitions'],['projects','Work projects']].map(([key,label])=>`<div><strong>${count[key]}</strong><span>${label}</span></div>`).join('')}</div><div id="footprint-records" role="status">Loading records…</div>`);
  const host=document.querySelector('#footprint-records');try{
   const [v,e]=await Promise.all([count.venues?api('/api/venues'):Promise.resolve({venues:[]}),count.exhibitions?api('/api/exhibitions'):Promise.resolve({events:[]})]);if(!host.isConnected)return;
   const groups=[['Venues',v.venues.filter(r=>(r.country||'Australia')===country),'venue'],['Exhibitions',e.events.filter(r=>r.country===country),'exhibition'],['Work projects',projects.filter(r=>r.country===country),'project']];
   host.innerHTML=groups.filter(([,rows])=>rows.length).map(([label,rows,type])=>`<section class="footprint-group"><h2>${label} · ${rows.length}</h2>${rows.map(r=>{const url=type==='venue'?r.sources?.find(s=>/^https?:/.test(s.url))?.url:r.website||r.url||r.officialUrl;return `<article><strong>${type==='project'?`<button class="text-button" data-footprint-project="${esc(r.id)}">${esc(r.name)}</button>`:esc(r.name)}</strong><p class="meta">${esc([r.city||r.suburb,r.start||r.address].filter(Boolean).join(' · '))}</p>${url&&/^https?:/.test(url)?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">View source ↗</a>`:''}</article>`;}).join('')}</section>`).join('');
   host.querySelectorAll('[data-footprint-project]').forEach(b=>b.onclick=()=>openProject(b.dataset.footprintProject));
  }catch(e){if(host.isConnected)host.textContent=e.message;}
 }
 return {zoom:direction=>direction==='reset'?fit():map.setZoom(map.getZoom()+(direction==='in'?1:-1)),destroy:()=>{pins.forEach(p=>p.setMap(null));google.maps.event.clearInstanceListeners(map);}};
}
