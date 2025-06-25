// ===== Service Worker لتطبيق شي ان العراق v2.0 =====

const CACHE_NAME = 'shiq-v2.0.0';
const API_CACHE_NAME = 'shiq-api-v2.0.0';
const IMAGES_CACHE_NAME = 'shiq-images-v2.0.0';

// ملفات التطبيق الأساسية
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

// URLs للـ API والبيانات الخارجية
const API_URLS = [
  // سيتم إضافة Google Apps Script URL هنا
];

// إعدادات التخزين المؤقت
const CACHE_CONFIG = {
  // مدة صلاحية التخزين المؤقت (بالمللي ثانية)
  API_CACHE_TIME: 5 * 60 * 1000, // 5 دقائق
  IMAGES_CACHE_TIME: 24 * 60 * 60 * 1000, // 24 ساعة
  OFFLINE_FALLBACK_TIME: 3000 // 3 ثواني
};

// ===== تثبيت Service Worker =====
self.addEventListener('install', event => {
  console.log('🔧 [ServiceWorker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // تخزين ملفات التطبيق الأساسية
      caches.open(CACHE_NAME).then(cache => {
        console.log('💾 [ServiceWorker] Caching app shell');
        return cache.addAll(APP_SHELL).catch(error => {
          console.error('❌ [ServiceWorker] Failed to cache app shell:', error);
          // تخزين الملفات واحد تلو الآخر في حالة فشل التخزين الجماعي
          return Promise.allSettled(
            APP_SHELL.map(url => cache.add(url).catch(err => {
              console.warn(`⚠️ [ServiceWorker] Failed to cache ${url}:`, err);
            }))
          );
        });
      }),
      
      // إنشاء caches إضافية
      caches.open(API_CACHE_NAME),
      caches.open(IMAGES_CACHE_NAME)
    ]).then(() => {
      console.log('✅ [ServiceWorker] Installation complete');
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ [ServiceWorker] Installation failed:', error);
    })
  );
});

// ===== تفعيل Service Worker =====
self.addEventListener('activate', event => {
  console.log('🚀 [ServiceWorker] Activating...');
  
  event.waitUntil(
    Promise.all([
      // تنظيف الـ caches القديمة
      cleanOldCaches(),
      
      // السيطرة على جميع العملاء
      self.clients.claim()
    ]).then(() => {
      console.log('✅ [ServiceWorker] Activation complete');
      
      // إرسال رسالة للعملاء بأن SW جاهز
      return notifyClientsOfUpdate();
    }).catch(error => {
      console.error('❌ [ServiceWorker] Activation failed:', error);
    })
  );
});

// ===== معالجة طلبات الشبكة =====
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // تجاهل طلبات غير HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // تجاهل طلبات POST/PUT للـ APIs الخارجية
  if (request.method !== 'GET' && isExternalAPI(url)) {
    return;
  }
  
  console.log('🌐 [ServiceWorker] Fetching:', request.url);
  
  // توجيه الطلبات حسب النوع
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleDefaultRequest(request));
  }
});

// ===== معالجة الإشعارات =====
self.addEventListener('push', event => {
  console.log('📨 [ServiceWorker] Push notification received');
  
  let notificationData = getDefaultNotificationData();
  
  // معالجة بيانات الإشعار
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('❌ [ServiceWorker] Error parsing push data:', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }
  
  // إعدادات الإشعار
  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    image: notificationData.image,
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: notificationData.url || './',
      timestamp: Date.now(),
      ...notificationData.data
    },
    requireInteraction: notificationData.requireInteraction || false,
    silent: false,
    tag: notificationData.tag || `shiq-${Date.now()}`,
    actions: [
      {
        action: 'open',
        title: '🛍️ تصفح المنتجات',
        icon: './icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: '❌ إغلاق'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
      .then(() => {
        console.log('✅ [ServiceWorker] Notification displayed');
        // تسجيل إحصائية عرض الإشعار
        trackNotificationEvent('displayed', notificationData);
      })
      .catch(error => {
        console.error('❌ [ServiceWorker] Error showing notification:', error);
      })
  );
});

// ===== معالجة النقر على الإشعارات =====
self.addEventListener('notificationclick', event => {
  console.log('👆 [ServiceWorker] Notification clicked:', event.action);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  let targetUrl = notificationData.url || './';
  
  // معالجة الإجراءات المختلفة
  switch (event.action) {
    case 'open':
      targetUrl = './';
      break;
    case 'close':
      trackNotificationEvent('dismissed', notificationData);
      return;
    default:
      // النقر على الإشعار نفسه
      break;
  }
  
  // تسجيل إحصائية النقر
  trackNotificationEvent('clicked', notificationData);
  
  // فتح أو التركيز على التطبيق
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // البحث عن نافذة مفتوحة
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // إرسال رسالة للتطبيق
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            data: notificationData,
            action: event.action
          });
          
          return client.focus();
        }
      }
      
      // فتح نافذة جديدة إذا لم توجد
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }).catch(error => {
      console.error('❌ [ServiceWorker] Error handling notification click:', error);
    })
  );
});

// ===== معالجة الرسائل =====
self.addEventListener('message', event => {
  console.log('💬 [ServiceWorker] Message received:', event.data);
  
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0]?.postMessage({ success: true });
      });
      break;
      
    case 'SCHEDULE_NOTIFICATION':
      scheduleLocalNotification(data);
      break;
      
    case 'UPDATE_USER_INFO':
      updateUserInfo(data.userInfo);
      break;
      
    case 'TRACK_EVENT':
      trackUserEvent(data.eventType, data.eventData);
      break;
      
    default:
      console.warn('⚠️ [ServiceWorker] Unknown message type:', type);
  }
});

// ===== Background Sync =====
self.addEventListener('sync', event => {
  console.log('🔄 [ServiceWorker] Background sync:', event.tag);
  
  switch (event.tag) {
    case 'sync-orders':
      event.waitUntil(syncPendingOrders());
      break;
      
    case 'sync-user-data':
      event.waitUntil(syncUserData());
      break;
      
    case 'sync-analytics':
      event.waitUntil(syncAnalytics());
      break;
      
    default:
      console.warn('⚠️ [ServiceWorker] Unknown sync tag:', event.tag);
  }
});

// ===== Periodic Background Sync =====
self.addEventListener('periodicsync', event => {
  console.log('⏰ [ServiceWorker] Periodic sync:', event.tag);
  
  switch (event.tag) {
    case 'update-products':
      event.waitUntil(updateProductsCache());
      break;
      
    case 'cleanup-cache':
      event.waitUntil(cleanupExpiredCache());
      break;
      
    default:
      console.warn('⚠️ [ServiceWorker] Unknown periodic sync tag:', event.tag);
  }
});

// ===== دوال مساعدة =====

// تنظيف الـ caches القديمة
async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    (name.startsWith('shiq-') && name !== CACHE_NAME && 
     name !== API_CACHE_NAME && name !== IMAGES_CACHE_NAME)
  );
  
  console.log('🧹 [ServiceWorker] Cleaning old caches:', oldCaches);
  
  return Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
}

// معالجة طلبات الصور
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGES_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // التحقق من صلاحية الصورة المحفوظة
      const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date') || 0);
      const isExpired = Date.now() - cachedDate.getTime() > CACHE_CONFIG.IMAGES_CACHE_TIME;
      
      if (!isExpired) {
        console.log('📸 [ServiceWorker] Serving cached image:', request.url);
        return cachedResponse;
      }
    }
    
    // جلب الصورة من الشبكة
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      // إضافة timestamp للـ response
      const responseToCache = response.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-date', new Date().toISOString());
      
      const modifiedResponse = new Response(await responseToCache.blob(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse.clone());
      return response;
    }
    
    // في حالة فشل الجلب، إرجاع الصورة المحفوظة إن وجدت
    return cachedResponse || createPlaceholderImage();
    
  } catch (error) {
    console.error('❌ [ServiceWorker] Error handling image request:', error);
    return createPlaceholderImage();
  }
}

// معالجة طلبات API
async function handleAPIRequest(request) {
  try {
    // محاولة جلب البيانات من الشبكة أولاً
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), CACHE_CONFIG.OFFLINE_FALLBACK_TIME)
      )
    ]);
    
    if (networkResponse && networkResponse.ok) {
      // حفظ الاستجابة في الـ cache
      const cache = await caches.open(API_CACHE_NAME);
      const responseToCache = networkResponse.clone();
      
      // إضافة timestamp
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-date', new Date().toISOString());
      
      const modifiedResponse = new Response(await responseToCache.text(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
      return networkResponse;
    }
  } catch (error) {
    console.warn('⚠️ [ServiceWorker] Network request failed, trying cache:', error.message);
  }
  
  // في حالة فشل الشبكة، محاولة الحصول على البيانات من الـ cache
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date') || 0);
    const isExpired = Date.now() - cachedDate.getTime() > CACHE_CONFIG.API_CACHE_TIME;
    
    if (!isExpired) {
      console.log('💾 [ServiceWorker] Serving cached API response:', request.url);
      return cachedResponse;
    }
  }
  
  // إرسال استجابة خطأ مع بيانات افتراضية
  return new Response(JSON.stringify({
    error: 'offline',
    message: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
    timestamp: new Date().toISOString()
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// معالجة طلبات التنقل
async function handleNavigationRequest(request) {
  try {
    // محاولة جلب الصفحة من الشبكة
    const response = await fetch(request);
    
    if (response && response.ok) {
      return response;
    }
  } catch (error) {
    console.warn('⚠️ [ServiceWorker] Navigation request failed:', error.message);
  }
  
  // في حالة الفشل، إرجاع الصفحة الرئيسية من الـ cache
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match('./index.html');
  
  if (cachedResponse) {
    console.log('🏠 [ServiceWorker] Serving cached index.html for navigation');
    return cachedResponse;
  }
  
  // في حالة عدم وجود صفحة محفوظة، إنشاء صفحة offline
  return createOfflinePage();
}

// معالجة الطلبات الافتراضية
async function handleDefaultRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 [ServiceWorker] Serving from cache:', request.url);
      
      // جلب نسخة جديدة في الخلفية
      fetch(request).then(response => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // تجاهل أخطاء التحديث في الخلفية
      });
      
      return cachedResponse;
    }
    
    // جلب من الشبكة وحفظ في الـ cache
    const response = await fetch(request);
    
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (error) {
    console.error('❌ [ServiceWorker] Error in default request handler:', error);
    return new Response('خطأ في الشبكة', { status: 500 });
  }
}

// دوال التحقق من نوع الطلب
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

function isAPIRequest(request) {
  return request.url.includes('script.google.com') ||
         request.url.includes('/api/') ||
         API_URLS.some(url => request.url.includes(url));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isExternalAPI(url) {
  return url.hostname !== self.location.hostname;
}

// إنشاء صورة placeholder
function createPlaceholderImage() {
  const svg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial">
        🖼️ صورة غير متاحة
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

// إنشاء صفحة offline
function createOfflinePage() {
  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>غير متصل - شي ان العراق</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .offline-container {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; margin-bottom: 30px; }
        button {
          background: #8B5CF6;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 1.1rem;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1>🛍️ شي ان العراق</h1>
        <h2>📡 غير متصل</h2>
        <p>لا يمكن الوصول للإنترنت حالياً</p>
        <p>يرجى التحقق من الاتصال والمحاولة مرة أخرى</p>
        <button onclick="window.location.reload()">🔄 إعادة المحاولة</button>
      </div>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// بيانات الإشعار الافتراضية
function getDefaultNotificationData() {
  return {
    title: 'شي ان العراق',
    body: 'عروض جديدة متاحة الآن!',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    image: '',
    url: './',
    requireInteraction: false,
    tag: 'shiq-notification'
  };
}

// جدولة إشعار محلي
function scheduleLocalNotification(data) {
  const { title, body, delay, image, userId } = data;
  
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
      tag: `scheduled-${Date.now()}`,
      requireInteraction: false,
      actions: [
        { action: 'open', title: '🛍️ تصفح الآن' },
        { action: 'close', title: '❌ إغلاق' }
      ]
    });
  }, delay || 0);
}

// تحديث معلومات المستخدم
function updateUserInfo(userInfo) {
  self.currentUserInfo = userInfo;
  console.log('👤 [ServiceWorker] User info updated:', userInfo?.name);
}

// تتبع أحداث الإشعارات
async function trackNotificationEvent(eventType, notificationData) {
  try {
    // يمكن إرسال الإحصائيات للخادم هنا
    console.log('📊 [ServiceWorker] Notification event:', eventType, notificationData.title);
  } catch (error) {
    console.error('❌ [ServiceWorker] Error tracking notification event:', error);
  }
}

// تتبع أحداث المستخدم
async function trackUserEvent(eventType, eventData) {
  try {
    console.log('📊 [ServiceWorker] User event:', eventType, eventData);
    // يمكن حفظ الأحداث محلياً وإرسالها لاحقاً
  } catch (error) {
    console.error('❌ [ServiceWorker] Error tracking user event:', error);
  }
}

// مزامنة الطلبات المعلقة
async function syncPendingOrders() {
  try {
    console.log('🔄 [ServiceWorker] Syncing pending orders...');
    // تنفيذ مزامنة الطلبات
  } catch (error) {
    console.error('❌ [ServiceWorker] Error syncing orders:', error);
  }
}

// مزامنة بيانات المستخدم
async function syncUserData() {
  try {
    console.log('🔄 [ServiceWorker] Syncing user data...');
    // تنفيذ مزامنة بيانات المستخدم
  } catch (error) {
    console.error('❌ [ServiceWorker] Error syncing user data:', error);
  }
}

// مزامنة الإحصائيات
async function syncAnalytics() {
  try {
    console.log('🔄 [ServiceWorker] Syncing analytics...');
    // تنفيذ مزامنة الإحصائيات
  } catch (error) {
    console.error('❌ [ServiceWorker] Error syncing analytics:', error);
  }
}

// تحديث cache المنتجات
async function updateProductsCache() {
  try {
    console.log('📦 [ServiceWorker] Updating products cache...');
    // تنفيذ تحديث cache المنتجات
  } catch (error) {
    console.error('❌ [ServiceWorker] Error updating products cache:', error);
  }
}

// تنظيف cache منتهي الصلاحية
async function cleanupExpiredCache() {
  try {
    console.log('🧹 [ServiceWorker] Cleaning expired cache...');
    
    const cacheNames = [API_CACHE_NAME, IMAGES_CACHE_NAME];
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const cachedDate = new Date(response.headers.get('sw-cached-date') || 0);
          const maxAge = cacheName === IMAGES_CACHE_NAME ? 
            CACHE_CONFIG.IMAGES_CACHE_TIME : 
            CACHE_CONFIG.API_CACHE_TIME;
          
          if (Date.now() - cachedDate.getTime() > maxAge) {
            await cache.delete(request);
            console.log('🗑️ [ServiceWorker] Removed expired cache:', request.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ [ServiceWorker] Error cleaning expired cache:', error);
  }
}

// مسح جميع الـ caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🧹 [ServiceWorker] All caches cleared');
  } catch (error) {
    console.error('❌ [ServiceWorker] Error clearing caches:', error);
  }
}

// إشعار العملاء بالتحديث
async function notifyClientsOfUpdate() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        version: CACHE_NAME
      });
    });
  } catch (error) {
    console.error('❌ [ServiceWorker] Error notifying clients:', error);
  }
}

// رسالة بدء التشغيل
console.log('🚀 [ServiceWorker] SHIQ v2.0 Service Worker loaded successfully!');

// تسجيل معلومات النظام
console.log('ℹ️ [ServiceWorker] Cache configuration:', CACHE_CONFIG);
console.log('ℹ️ [ServiceWorker] Cache names:', {
  app: CACHE_NAME,
  api: API_CACHE_NAME,
  images: IMAGES_CACHE_NAME
});