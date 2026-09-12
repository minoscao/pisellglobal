// Load the existing custom element through a classic script so its asset base stays correct.
if(!customElements.get('exhibition-tracker')){
  const config=await fetch('/venues/maps-config.js').then(r=>r.text());
  const key=config.match(/['"](AIza[A-Za-z0-9_-]+)['"]/)?.[1]||'';
  window.EXHIBITION_CONFIG={googleMapsKey:key,mapId:'DEMO_MAP_ID',aiEndpoint:'',aiToken:''};
  await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/exhibitions/tracker.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});
}
