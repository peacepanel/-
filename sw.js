const CACHE_NAME = 'shiq-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  // Add other static assets here
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('[ServiceWorker] Found in cache', event.request.url);
          return response;
        }

        console.log('[ServiceWorker] Network request', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Fallback to offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// Background sync for offline orders
self.addEventListener('sync', event => {
  console.log('[ServiceWorker] Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise((resolve) => {
    // Handle offline orders or data sync here
    console.log('[ServiceWorker] Performing background sync');
    resolve();
  });
}

// Push notifications - معالجة الإشعارات الواردة
self.addEventListener('push', event => {
    console.log('[ServiceWorker] Push notification received');
    
    let notificationData = {
        title: 'شي ان العراق',
        body: 'عروض جديدة متاحة الآن!',
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-72x72.png',
        image: '', // صورة كبيرة اختيارية
        data: {
            url: './',
            timestamp: Date.now(),
            userId: null
        }
    };
    
    // إذا كان هناك بيانات في الإشعار
    if (event.data) {
        try {
            const payload = event.data.json();
            notificationData = {
                ...notificationData,
                ...payload
            };
        } catch (e) {
            notificationData.body = event.data.text();
        }
    }
    
    const notificationOptions = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        image: notificationData.image,
        vibrate: [200, 100, 200, 100, 200], // نمط الاهتزاز
        data: notificationData.data,
        requireInteraction: true, // يبقى الإشعار حتى يتفاعل المستخدم
        silent: false,
        renotify: false,
        tag: notificationData.tag || 'shiq-notification',
        actions: [
            {
                action: 'open',
                title: '🛍️ تصفح المنتجات',
                icon: './icons/icon-96x96.png'
            },
            {
                action: 'close',
                title: '❌ إغلاق',
                icon: './icons/icon-96x96.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationOptions)
    );
});

// Notification click event - معالجة النقر على الإشعار
self.addEventListener('notificationclick', event => {
    console.log('[ServiceWorker] Notification click received');
    
    event.notification.close();
    
    const notificationData = event.notification.data || {};
    let targetUrl = notificationData.url || './';
    
    // معالجة الإجراءات المختلفة
    if (event.action === 'open') {
        targetUrl = './';
    } else if (event.action === 'close') {
        // تسجيل إحصائية الإغلاق
        console.log('Notification closed by user');
        return;
    }
    
    // فتح التطبيق أو التركيز عليه
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clientList => {
            // البحث عن نافذة مفتوحة للتطبيق
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    // إرسال رسالة للتطبيق بأن المستخدم فتح الإشعار
                    client.postMessage({
                        type: 'NOTIFICATION_CLICKED',
                        data: notificationData
                    });
                    return client.focus();
                }
            }
            
            // إذا لم توجد نافذة مفتوحة، افتح جديدة
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
    
    // تسجيل إحصائية النقر
    console.log('Notification clicked:', {
        action: event.action || 'default',
        timestamp: Date.now(),
        notificationData: notificationData
    });
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    console.log('[ServiceWorker] Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // إشعارات مجدولة محلياً
    if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
        const { title, body, delay, image, userId } = event.data;
        
        setTimeout(() => {
            self.registration.showNotification(title, {
                body: body,
                icon: './icons/icon-192x192.png',
                badge: './icons/icon-72x72.png',
                image: image || '',
                vibrate: [200, 100, 200],
                data: { 
                    url: './', 
                    userId: userId,
                    timestamp: Date.now(),
                    type: 'scheduled_local'
                },
                tag: 'scheduled-notification',
                requireInteraction: false,
                actions: [
                    {
                        action: 'open',
                        title: '🛍️ تصفح الآن'
                    },
                    {
                        action: 'close',
                        title: '❌ إغلاق'
                    }
                ]
            });
        }, delay);
    }
    
    // تحديث معلومات المستخدم
    if (event.data && event.data.type === 'UPDATE_USER_INFO') {
        self.currentUserInfo = event.data.userInfo;
        console.log('User info updated in SW:', self.currentUserInfo);
    }
});

// إشعارات ذكية حسب سلوك المستخدم
function sendSmartNotification(type, userInfo = {}) {
    const notifications = {
        'cart_abandoned': {
            title: '🛒 لا تنس سلة التسوق!',
            body: `${userInfo.name || 'عزيزي العميل'}، منتجاتك في انتظارك`,
            image: ''
        },
        'welcome_back': {
            title: `🎉 أهلاً بعودتك ${userInfo.name || ''}!`,
            body: 'منتجات جديدة وصلت خصيصاً لك',
            image: ''
        },
        'daily_deals': {
            title: '🔥 عروض اليوم الحصرية',
            body: `خصومات مميزة لسكان ${userInfo.governorate || 'العراق'}`,
            image: ''
        },
        'new_arrivals': {
            title: '✨ منتجات جديدة وصلت',
            body: 'تصفح أحدث المجموعات في فئاتك المفضلة',
            image: ''
        }
    };
    
    const notification = notifications[type];
    if (notification) {
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: './icons/icon-192x192.png',
            badge: './icons/icon-72x72.png',
            image: notification.image,
            vibrate: [200, 100, 200],
            data: { 
                url: './', 
                userId: userInfo.id,
                timestamp: Date.now(),
                type: 'smart_notification',
                category: type
            },
            tag: `smart-${type}`,
            requireInteraction: false
        });
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

function updateContent() {
  return new Promise((resolve) => {
    // Update product data or sync with server
    console.log('[ServiceWorker] Updating content in background');
    resolve();
  });
}