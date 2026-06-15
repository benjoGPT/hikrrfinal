const CACHE='shire-steppers-v4';
const SHELL=['./index.html','./model.js','./manifest.json',
  'https://unpkg.com/three@0.160.0/build/three.module.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=>new Request(u,{mode:'cors'})))).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=e.request.url;
  if(u.includes('index.html')||u.includes('model.js')||u.includes('manifest.json')||u.includes('three')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));}
});
