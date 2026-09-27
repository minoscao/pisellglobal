// The browser Maps SDK needs a browser key at runtime. Keep its source of truth
// in a Worker Secret, never in published static assets or repository files.
export function mapsConfigRoute(request, env, user) {
  if (new URL(request.url).pathname !== '/venues/maps-config.js') return null;
  const headers = {
    'content-type':'text/javascript; charset=utf-8',
    'cache-control':'private, no-store',
    'x-content-type-options':'nosniff',
    'vary':'Cookie',
  };
  if (!user) return new Response('/* Please sign in to load the map. */', {status:401, headers});
  if (!['GET','HEAD'].includes(request.method)) return new Response(null, {status:405, headers:{...headers, allow:'GET, HEAD'}});
  const key = env.GOOGLE_MAPS_BROWSER_KEY;
  if (typeof key !== 'string' || !/^[A-Za-z0-9_-]{20,200}$/.test(key)) {
    return new Response('/* Map configuration unavailable. */', {status:503, headers});
  }
  return new Response(request.method === 'HEAD' ? null : `window.PISELL_MAPS_KEY = ${JSON.stringify(key)};\n`, {headers});
}
