import {loadGoogleMaps,PISELL_MAP_STYLE} from './google-maps.js';
let boundaries;
const aliases={'United States of America':'United States'};
const nameOf=f=>aliases[f.getProperty('name')]||f.getProperty('name');
export async function mountFootprint({target,api,projects,regions,selected,showDrawer,esc,openProject}){
 const [google,research,geo]=await Promise.all([loadGoogleMaps(),api('/api/footprint'),boundaries||(boundaries=fetch('/countries.geojson').then(r=>{if(!r.ok)throw Error('Country outlines unavailable.');return r.json();}).catch(e=>{boundaries=null;throw e;}))]);
 if(!target.isConnected)return;
 const countries=new Map(research.countries.map(r=>[r.country,{...r,projects:r.coverage?0:null}]));
 for(const p of projects){if(!p.country)continue;if(!countries.has(p.country))countries.set(p.country,{country:p.country,projects:0,leads:null,leadVenueIds:[],coverage:null});countries.get(p.country).projects=(countries.get(p.country).projects||0)+1;}
 for(const f of geo.features){const name=aliases[f.properties.name]||f.properties.name;if(!countries.has(name))countries.set(name,{country:name,projects:null,leads:null,leadVenueIds:[],coverage:null});}
 const countText=n=>n==null?'Not available':String(n);
 const panel=target.closest('.map-panel');panel.querySelector('[data-footprint-summary]').textContent=`${projects.length} existing projects · ${research.countries.reduce((n,r)=>n+(r.leads||0),0)} leads / opportunities`;
 const shade=r=>r?.projects>0?{fillOpacity:Math.min(.78,.42+Math.log2(r.projects+1)*.08),strokeWeight:1.2}:r?.leads>0?{fillOpacity:.22,strokeWeight:1}:{fillOpacity:0,strokeWeight:0};
 const map=new google.maps.Map(target,{center:{lat:18,lng:15},zoom:1,minZoom:0,maxZoom:18,styles:PISELL_MAP_STYLE,mapTypeControl:false,streetViewControl:false,fullscreenControl:true,zoomControl:false,gestureHandling:'cooperative',isFractionalZoomEnabled:true});
 const fit=()=>{map.setCenter({lat:18,lng:15});map.setZoom(Math.max(0,Math.log2(target.clientWidth/256)-.06));};fit();
 map.data.addGeoJson(geo);
 map.data.setStyle(feature=>({visible:true,fillColor:'#EF4323',strokeColor:'#C43214',strokeOpacity:.8,clickable:true,...shade(countries.get(nameOf(feature)))}));
 map.data.addListener('mouseover',e=>map.data.overrideStyle(e.feature,{fillOpacity:countries.get(nameOf(e.feature))?.projects>0?.8:.35,strokeWeight:2}));
 map.data.addListener('mouseout',e=>map.data.revertStyle(e.feature));
 map.data.addListener('click',e=>openCountry(nameOf(e.feature)));
 map.addListener('dragstart',()=>document.querySelector('#detail')?.close());
 const chooser=panel.querySelector('[data-footprint-country]');chooser.innerHTML='<option value="">Explore a region…</option>'+[...countries.keys()].sort().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');chooser.onchange=()=>{if(chooser.value)openCountry(chooser.value);};
 class RegionPin extends google.maps.OverlayView{
  constructor(position,country,options={}){super();this.position=position;this.country=country;this.options=options;this.setMap(map);}
  onAdd(){this.button=document.createElement('button');this.button.className='footprint-pin';const r=countries.get(this.country);this.button.setAttribute('aria-label',this.options.label||`${this.country}: ${countText(r.projects)} existing projects; ${countText(r.leads)} leads / opportunities`);this.button.title=this.button.getAttribute('aria-label');this.button.innerHTML=`<i></i><span>${esc(this.options.label||this.country)}${this.options.label?'':`<br>${countText(r.projects)} projects · ${countText(r.leads)} leads`}</span>`;this.button.onclick=e=>{e.stopPropagation();(this.options.open||(()=>openCountry(this.country)))();};google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.button);this.getPanes().overlayMouseTarget.append(this.button);}
  draw(){const p=this.getProjection().fromLatLngToDivPixel(this.position);if(this.button&&p){this.button.style.left=p.x+'px';this.button.style.top=p.y+'px';}}
  onRemove(){this.button?.remove();}
 }
 const pins=[];map.data.forEach(f=>{const country=nameOf(f);if(countries.get(country)?.projects>0||countries.get(country)?.leads>0)pins.push(new RegionPin(new google.maps.LatLng(f.getProperty('labelLat'),f.getProperty('labelLng')),country));});
 for(const p of projects.filter(p=>p.latitude!=null&&p.longitude!=null))pins.push(new RegionPin(new google.maps.LatLng(p.latitude,p.longitude),p.country,{label:p.name,open:()=>openProject(p.id)}));
 target.dataset.loaded='true';target.dataset.coloredCountries=String(pins.length);
 async function openCountry(country){const count=countries.get(country);if(!count)return;chooser.value=country;
  const region=regions.find(r=>r.country===country||r.name===country),regionNote=region?.level?`Level ${region.level} · ${region.description||'Regional presence'}`:country==='Australia'?'Level 1 · Established operations':'Regional presence level not confirmed';
  showDrawer('Regional footprint',`<h1>${esc(country)}</h1><p class="meta">${esc(regionNote)}</p><div class="footprint-counts">${[['projects','Existing projects'],['leads','Leads / opportunities']].map(([key,label])=>`<div><strong>${countText(count[key])}</strong><span>${label}</span></div>`).join('')}</div><p class="meta">${count.coverage?esc(count.coverage.scope)+' · Checked '+esc(count.coverage.checked_at):'Venue research has not been recorded for this region.'}</p><div id="footprint-records" role="status">Loading records…</div>`);
  const host=document.querySelector('#footprint-records');try{
   const v=count.leads?await api('/api/venues'):{venues:[]};if(!host.isConnected)return;
   const groups=[['Existing projects',projects.filter(r=>r.country===country),'project'],['Leads / opportunities',v.venues.filter(r=>count.leadVenueIds.includes(r.id)),'venue']];
   host.innerHTML=groups.filter(([,rows])=>rows.length).map(([label,rows,type])=>`<section class="footprint-group"><h2>${label} · ${rows.length}</h2>${rows.map(r=>{const url=type==='venue'?r.sources?.find(s=>/^https?:/.test(s.url))?.url:r.website||r.url||r.officialUrl;return `<article><strong>${type==='project'?`<button class="text-button" data-footprint-project="${esc(r.id)}">${esc(r.name)}</button>`:esc(r.name)}</strong><p class="meta">${esc([r.city||r.suburb,r.start||r.address].filter(Boolean).join(' · '))}</p>${url&&/^https?:/.test(url)?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">View source ↗</a>`:''}</article>`;}).join('')}</section>`).join('')||'<p class="meta">No recorded projects or researched leads are available for this region.</p>';
   host.querySelectorAll('[data-footprint-project]').forEach(b=>b.onclick=()=>openProject(b.dataset.footprintProject));
  }catch(e){if(host.isConnected)host.textContent=e.message;}
 }
 return {zoom:direction=>direction==='reset'?fit():map.setZoom(map.getZoom()+(direction==='in'?1:-1)),destroy:()=>{pins.forEach(p=>p.setMap(null));google.maps.event.clearInstanceListeners(map);}};
}
