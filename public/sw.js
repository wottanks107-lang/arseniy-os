const CACHE_NAME = 'arseniy-os-v1';
const urlsToCache = [
  '/',
  '/admin',
  '/admin/dashboard',
  '/admin/dashboard/tasks',
  '/admin/dashboard/finance',
  '/admin/dashboard/wishlist',
  '/admin/dashboard/notes',
  '/admin/dashboard/reminders',
  '/admin/dashboard/flashcards',
  '/admin/dashboard/links',
  '/admin/dashboard/habits',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/admin/dashboard/reminders');
      }
    })
  );
});