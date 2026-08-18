/* Astra service worker — push delivery and offline shell */
const CACHE='astra-v1';
self.addEventListener('install',e=>{ self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });

self.addEventListener('push',e=>{
  let d={title:'Astra',body:'Something needs you.',tag:'astra',url:'./'};
  try{ if(e.data) d=Object.assign(d,e.data.json()); }catch(_){ if(e.data) d.body=e.data.text(); }
  e.waitUntil(self.registration.showNotification(d.title,{
    body:d.body, tag:d.tag, renotify:true, badge:'icon-192.png', icon:'icon-192.png',
    data:{url:d.url||'./'}
  }));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){ if('focus' in c) return c.focus().then(x=>x.navigate?x.navigate(url):x); }
    return clients.openWindow(url);
  }));
});
