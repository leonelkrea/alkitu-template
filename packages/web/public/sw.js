// Service Worker for Push Notifications
const CACHE_NAME = 'alkitu-notifications-v1';
const urlsToCache = ['/', '/dashboard', '/dashboard/notifications'];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'notification',
    data: {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/favicon.ico',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    requireInteraction: false,
    silent: false,
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        ...notificationData,
        title: payload.title || notificationData.title,
        body: payload.message || payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        tag: payload.tag || payload.type || notificationData.tag,
        data: payload.data || payload,
        actions: payload.actions || notificationData.actions,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
      };
    } catch (error) {
      console.error('Error parsing push notification data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      vibrate: [200, 100, 200],
      timestamp: Date.now(),
    }),
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'dismiss') {
    return;
  }

  // Default action or 'view' action
  const urlToOpen =
    notificationData.link || notificationData.url || '/dashboard/notifications';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }

        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);

  // Optional: Track notification close events
  const notificationData = event.notification.data;
  if (notificationData && notificationData.trackClose) {
    // Send analytics or tracking data
    fetch('/api/notifications/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'close',
        notificationId: notificationData.id,
        timestamp: Date.now(),
      }),
    }).catch((error) => {
      console.error('Error tracking notification close:', error);
    });
  }
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(
      // Sync any pending notifications when back online
      syncPendingNotifications(),
    );
  }
});

async function syncPendingNotifications() {
  try {
    // Get any pending notifications from IndexedDB or localStorage
    // This would be implemented based on your offline storage strategy
    console.log('Syncing pending notifications...');
  } catch (error) {
    console.error('Error syncing notifications:', error);
  }
}

// Fetch event - handle network requests (optional caching strategy)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for caching
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    }),
  );
});
