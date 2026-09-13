let loading;
export async function loadGoogleMaps(){
 if(window.google?.maps?.Map)return window.google;
 if(loading)return loading;
 loading=(async()=>{
  if(!window.PISELL_MAPS_KEY)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/venues/maps-config.js';s.onload=resolve;s.onerror=()=>reject(Error('Map configuration unavailable.'));document.head.append(s);});
  await new Promise((resolve,reject)=>{window.pisellGoogleMapReady=resolve;const s=document.createElement('script');s.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(window.PISELL_MAPS_KEY)+'&libraries=marker&loading=async&callback=pisellGoogleMapReady&language=en';s.onerror=()=>reject(Error('Map unavailable. Your records remain available in the lists.'));document.head.append(s);});return window.google;
 })().catch(e=>{loading=null;throw e;});return loading;
}
export const PISELL_MAP_STYLE=[
 {elementType:'geometry',stylers:[{color:'#eeeae7'}]},
 {elementType:'labels.text.fill',stylers:[{color:'#746a65'}]},
 {elementType:'labels.text.stroke',stylers:[{color:'#faf8f6'}]},
 {featureType:'water',elementType:'geometry',stylers:[{color:'#faf9f7'}]},
 {featureType:'administrative.country',elementType:'geometry.stroke',stylers:[{color:'#ffffff'},{weight:1}]},
 {featureType:'administrative.province',elementType:'geometry.stroke',stylers:[{color:'#ded8d4'},{weight:0.5}]},
 {featureType:'road',elementType:'geometry',stylers:[{color:'#ffffff'}]},
 {featureType:'road.highway',elementType:'geometry',stylers:[{color:'#ead3c8'}]},
 {featureType:'poi',stylers:[{visibility:'off'}]},
 {featureType:'transit',stylers:[{visibility:'off'}]}
];

// DOM markers keep the shared branded base map without a cloud map-style ID.
export function createMapMarker({map,position,content,title}){
 class ContentMarker extends google.maps.OverlayView{
  constructor(){super();this.position=position;this.setMap(map);}
  onAdd(){this.element=document.createElement('div');this.element.style.cssText='position:absolute;transform:translate(-50%,-100%);';this.element.append(content);if(title)content.title=title;google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.element);this.getPanes().overlayMouseTarget.append(this.element);}
  draw(){const p=this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(this.position));if(p&&this.element){this.element.style.left=p.x+'px';this.element.style.top=p.y+'px';}}
  onRemove(){this.element?.remove();}
 }
 return new ContentMarker();
}
