// ===== SHIQ App v2.3.0 - إصلاح شامل لمشكلة عرض الصور =====

// إعدادات التطبيق
const CONFIG = {
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzc9ojokNkOcmtINeXR9ijzc5HCfq5Ljgcp_4WIpW5JLGSnJryRvnyZqH8EEwB7tbHk/exec',
    MAIN_SHEET_ID: '1ap6gkoczUsqvf0KMoxXroo2uP_wycDGxyg6r-UPFgBQ',
    WHATSAPP_NUMBER: '9647862799748',
    PHONE_NUMBER: '07862799748',
    APP_VERSION: '2.3.0',
    APP_URL: 'https://peacepanel.github.io/shein-baghdad/',
    NOTIFICATIONS_ENABLED: true,
    FREE_DELIVERY_THRESHOLD: 50000,
    DELIVERY_FEE: 5000,
    STORAGE_KEYS: {
        USER_DATA: 'shiq_user_data_v2',
        CART_DATA: 'shiq_cart_v2',
        PREFERENCES: 'shiq_preferences_v2',
        DEVICE_ID: 'shiq_device_id',
        NOTIFICATIONS_STATUS: 'shiq_notifications_status'
    }
};

// إعدادات Google Sheets API
const apiKey = 'AIzaSyATs-nWgTonTFEKCi_4F5lQ_Ao0vnJ5Xmk';

// تكوين الفئات - النسخة الناجحة
const categories = {
    'اكسسوارات نسائية': {
        sheetId: '1Tf1B4HqO5lnwxP8oSqzRMwmvegnIDJam-DMhQc8s5S8',
        sheets: ['تراجي', 'ساعات', 'سوار', 'كلادة', 'محابس', 'قراصات', 'اكسسوار جسم', 'شفقات', 'احزمة', 'مداليات', 'نضارات', 'مهفات'],
        imageCol: 'F',
        priceCol: 'I'
    },
    'احذية وحقائب متنوعة': {
        sheetId: '1saUoR7Z7xYI-WCUZNTs3YRZ6jEdnM6S03M15tgw-QiQ',
        sheets: ['جزدان', 'حقائب', 'سلبر نسائي', 'احذية نسائي', 'اكسسوارات اطفال', 'احذية اطفال'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'G'
    },
    'ربطات وشالات': {
        sheetId: '17mlV_BaJFQZoz-Cof1wJG6e-2X1QCRs9usoIWXmQGI8',
        sheets: ['جواريب', 'اكمام كفوف', 'شالات', 'شال كتف', 'سكارف', 'بروشات', 'ياخه'],
        imageCol: 'F',
        priceCol: 'I'
    },
    'شيكلام': {
        sheetId: '1K08r0X7XQ6ZUkUYjR8QI_91X1hX6v7K8e6181Vuz4os',
        sheets: ['اظافر', 'صبغ اظافر', 'شعر', 'فرش', 'مكياج', 'وشم', 'حقائب مكياج', 'منوع'],
        imageCol: 'F',
        priceCol: 'I'
    },
    'منزلية': {
        sheetId: '1aLXBPsxTixs28wFi55P9ZRNU2RhqzFfjxg8Cbp4m8Rw',
        sheets: ['منوع', 'ديكورات', 'ادوات منزلية'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'J'
    },
    'مفروشات': {
        sheetId: '1s1WVVjA--0BqHfzE-ANm5pq43xkRD1vaDyNeGUAXFLk',
        sheets: ['شراشف', 'ستائر', 'ارضيات', 'وجه كوشات', 'مناشف', 'تلبيسه لحاف', 'اغطية', 'مقاعد تلبيس', 'اخرى'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'J'
    },
    'اطفالي صيفي': {
        sheetId: '1Rhbilfz7VaHTR-qCxdjNK_5zk52kdglYd-ADK2Mn2po',
        sheets: ['3 - 0 M', '6 - 3 M', '9 - 6 M', '12 - 9 M', '18 - 12 M', '24 - 18 M', '1 Y', '2 Y', '3 Y', '4 Y', '5 Y', '6 Y', '7 Y', '8 Y', '9 Y', '10 Y', '11 Y', '12 Y', '13 Y', '14 Y'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'I'
    },
    'اطفالي شتائي': {
        sheetId: '1JAI7pfkQiPAL-6H6DBjryPHGAPoRacY3TTajEJHy8HQ',
        sheets: ['3 - 0 M', '6 - 3 M', '9 - 6 M', '12 - 9 M', '18 - 12 M', '24 - 18 M', '1 Y', '2 Y', '3 Y', '4 Y', '5 Y', '6 Y', '7 Y', '8 Y', '9 Y', '10 Y', '11 Y', '12 Y', '13 Y', '14 Y'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'I'
    },
    'نسائي شتائي': {
        sheetId: '1cXt49H5Wy1jGB0jrutp8JviLq3qSHo7VQuCoBclDRAI',
        sheets: ['5XL', '4XL', '3XL', '2XL', '1XL', '0XL', 'XL', 'L', 'M', 'S', 'XS', 'one size'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'D'
    },
    'نسائي صيفي': {
        sheetId: '1POUe8K4EadYctDbTr1hnpKJ_r6slAVaX6VWyfbGYBFE',
        sheets: ['5XL', '4XL', '3XL', '2XL', '1XL', '0XL', 'XL', 'L', 'M', 'S', 'XS', 'one size'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'D'
    },
    'مستلزمات موبايل': {
        sheetId: '1xMFXIY4EjjbEnGVK-8m_Q8G9Ng-2NJ93kPkdpfVQuGk',
        sheets: ['كفرات موبايل', 'ملحقات اخرى'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'G'
    }
};

// متغيرات عامة
let selectedProducts = [];
let currentUser = null;
let deviceId = null;
let currentCategory = '';
let isOnline = navigator.onLine;

// عناصر DOM
const categoryContainer = document.getElementById('categoryContainer');
const categoryNav = document.getElementById('category-nav');
const workbookContainer = document.getElementById('workbook-container');
const productContainer = document.getElementById('product-container');
const searchBox = document.getElementById('searchBox');

// ===== دوال مساعدة بسيطة =====
function getColumnIndex(colLetter) {
    if (!colLetter || typeof colLetter !== 'string') return 0;
    return colLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, etc.
}

// ===== نظام معرف الجهاز والإشعارات =====
function generateDeviceId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const fingerprint = navigator.userAgent + navigator.language + screen.width + screen.height;
    const hash = btoa(fingerprint).slice(0, 8);
    return `SHIQ_DEVICE_${timestamp}_${hash}_${random}`;
}

function getOrCreateDeviceId() {
    let storedDeviceId = localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID);
    if (!storedDeviceId) {
        storedDeviceId = generateDeviceId();
        localStorage.setItem(CONFIG.STORAGE_KEYS.DEVICE_ID, storedDeviceId);
        sendDeviceRegistration(storedDeviceId);
    }
    return storedDeviceId;
}

async function sendDeviceRegistration(deviceId) {
    try {
        const deviceData = {
            deviceId: deviceId,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            installDate: new Date().toISOString(),
            appVersion: CONFIG.APP_VERSION
        };
        
        const payload = {
            action: 'register_device',
            deviceData: deviceData
        };
        
        await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log('✅ تم تسجيل الجهاز:', deviceId);
    } catch (error) {
        console.error('❌ خطأ في تسجيل الجهاز:', error);
    }
}

async function initializeNotifications() {
    try {
        if (!('Notification' in window)) {
            console.log('المتصفح لا يدعم الإشعارات');
            return false;
        }
        
        const notificationStatus = localStorage.getItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS_STATUS);
        
        if (notificationStatus === 'granted') {
            console.log('✅ الإشعارات مفعلة مسبقاً');
            return true;
        }
        
        if (notificationStatus === 'denied') {
            console.log('❌ المستخدم رفض الإشعارات مسبقاً');
            return false;
        }
        
        const permission = await Notification.requestPermission();
        localStorage.setItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS_STATUS, permission);
        
        if (permission === 'granted') {
            console.log('✅ تم تفعيل الإشعارات تلقائياً');
            
            setTimeout(() => {
                new Notification('🎉 مرحباً بك في شي ان العراق!', {
                    body: 'ستصلك أحدث العروض والمنتجات الجديدة',
                    icon: './icons/icon-192x192.png',
                    tag: 'welcome-auto'
                });
            }, 2000);
            
            updateDeviceNotificationStatus(deviceId, true);
            return true;
        } else {
            console.log('❌ المستخدم رفض الإشعارات');
            return false;
        }
    } catch (error) {
        console.error('❌ خطأ في تهيئة الإشعارات:', error);
        return false;
    }
}

async function updateDeviceNotificationStatus(deviceId, enabled) {
    try {
        const payload = {
            action: 'update_device_notifications',
            deviceId: deviceId,
            notificationsEnabled: enabled,
            timestamp: new Date().toISOString()
        };
        
        await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log('✅ تم تحديث حالة الإشعارات للجهاز');
    } catch (error) {
        console.error('❌ خطأ في تحديث حالة الإشعارات:', error);
    }
}

// ===== تحميل صور الفئات - مُصحح تماماً =====
async function loadCategoryImages() {
    if (!categoryContainer) return;

    console.log('🖼️ بدء تحميل صور الفئات...');

    for (const [categoryName, categoryConfig] of Object.entries(categories)) {
        try {
            console.log('🔍 البحث عن صورة للفئة: ' + categoryName);
            
            const imageUrl = await getCategoryImageFromSheets(categoryConfig);
            
            if (imageUrl) {
                console.log('✅ تم العثور على صورة للفئة "' + categoryName + '": ' + imageUrl.substring(0, 50) + '...');
                categoryImagesCache[categoryName] = imageUrl;
            } else {
                console.warn('⚠️ لم يتم العثور على صورة للفئة "' + categoryName + '"');
                categoryImagesCache[categoryName] = null;
            }
            
            createCategoryElement(categoryName, categoryImagesCache[categoryName]);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل صورة الفئة "' + categoryName + '":', error);
            createCategoryElement(categoryName, null);
        }
    }
}

async function getCategoryImageFromSheets(categoryConfig) {
    const { sheetId, sheets, imageCol, priceCol } = categoryConfig;
    
    if (!imageCol || !sheets || sheets.length === 0) {
        console.warn('⚠️ إعدادات الفئة غير مكتملة');
        return null;
    }

    // البحث في جميع أوراق العمل للفئة
    for (const sheetName of sheets) {
        try {
            console.log('🔍 البحث في ورقة العمل: ' + sheetName);
            
            // جلب البيانات من الأعمدة المطلوبة فقط
            const range = `${sheetName}!${imageCol}2:${priceCol}20`; // جلب 19 صف من البيانات
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.values && data.values.length > 0) {
                console.log('📊 تم جلب ' + data.values.length + ' صف من ' + sheetName);
                
                // البحث عن أول صورة صالحة مع سعر
                for (let i = 0; i < data.values.length; i++) {
                    const row = data.values[i];
                    const imageColIndex = getColumnIndex(imageCol);
                    const priceColIndex = getColumnIndex(priceCol);
                    
                    // حساب الفهرس النسبي للسعر (نسبة إلى عمود الصورة)
                    const relativePriceIndex = priceColIndex - imageColIndex;
                    
                    const imageUrl = row[0]; // عمود الصورة دائماً في الفهرس 0 للنطاق المحدد
                    const price = row[relativePriceIndex]; // عمود السعر
                    
                    console.log('🔍 فحص الصف ' + (i + 2) + ': صورة="' + (imageUrl ? imageUrl.substring(0, 30) + '...' : 'فارغ') + '", سعر="' + price + '"');
                    
                    // التحقق من وجود صورة وسعر معاً
                    if (imageUrl && price && validateImageUrl(imageUrl)) {
                        const directUrl = convertToDirectLink(imageUrl);
                        console.log('✅ تم العثور على صورة صالحة في ' + sheetName + ': ' + directUrl.substring(0, 50) + '...');
                        return directUrl;
                    }
                }
            } else {
                console.log('⚠️ لا توجد بيانات في ورقة ' + sheetName);
            }
            
        } catch (error) {
            console.error('❌ خطأ في جلب البيانات من ' + sheetName + ':', error);
            continue; // الانتقال لورقة العمل التالية
        }
    }
    
    console.warn(`⚠️ لم يتم العثور على صورة صالحة في أي ورقة عمل للفئة`);
    return null;
}

function createCategoryElement(categoryName, imageUrl) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiPvCfm43vuI88L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiPtiy2YjYsdipINi62YrYsSDZhdiq2KfYrdipPC90ZXh0Pjwvc3ZnPg==';
    
    const finalImageUrl = imageUrl || defaultImage;
    
    categoryDiv.innerHTML = `
        <img src="${finalImageUrl}" alt="${categoryName}" onerror="this.src='${defaultImage}'" loading="lazy">
        <div class="category-name">${categoryName}</div>
    `;
    
    categoryDiv.onclick = () => loadWorkbooks(categoryName);
    categoryContainer.appendChild(categoryDiv);
}

function createCategoryNav() {
    if (!categoryNav) return;
    
    Object.keys(categories).forEach((categoryName, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = 'nav-category-btn';
        navBtn.textContent = categoryName;
        navBtn.onclick = () => {
            // Remove active class from all buttons
            document.querySelectorAll('.nav-category-btn').forEach(btn => 
                btn.classList.remove('active'));
            // Add active class to clicked button
            navBtn.classList.add('active');
            // Load workbooks for this category
            loadWorkbooks(categoryName);
        };
        categoryNav.appendChild(navBtn);
    });
}

// Load workbooks for a category
function loadWorkbooks(categoryName) {
    console.log('🎯 تم اختيار الفئة:', categoryName);
    currentCategory = categoryName;
    
    if (!workbookContainer || !productContainer) return;
    
    workbookContainer.innerHTML = '';
    productContainer.innerHTML = '<div class="default-message">اختر قسماً من الأقسام أعلاه لعرض المنتجات <span class="emoji-icon">👆</span></div>';
    
    // Clear previous search
    if (searchBox) {
        searchBox.value = '';
        
        // Show search box only for specific categories
        if (categoryName === 'احذية وحقائب متنوعة') {
            searchBox.style.display = 'block';
            searchBox.placeholder = '🔍 ابحث بالمقاس أو نوع الحذاء...';
        } else if (categoryName === 'مستلزمات موبايل') {
            searchBox.style.display = 'block';
            searchBox.placeholder = '🔍 ابحث بنوع الموبايل أو الاكسسوار...';
        } else {
            searchBox.style.display = 'none';
        }
    }

    const workbooks = categories[categoryName].sheets;
    workbooks.forEach(workbook => {
        const workbookDiv = document.createElement('button');
        workbookDiv.className = 'workbook-button';
        workbookDiv.textContent = workbook;
        workbookDiv.onclick = () => loadProducts(categoryName, workbook);
        workbookContainer.appendChild(workbookDiv);
    });

    // Smooth scroll to workbooks section
    workbookContainer.scrollIntoView({ behavior: 'smooth' });
    
    trackAction('select_category', { category: categoryName });
}

// ===== تحميل المنتجات - النسخة الناجحة =====
function loadProducts(categoryName, workbook) {
    console.log('📖 تحميل دفتر العمل:', workbook, 'من الفئة:', categoryName);
    
    const sheetId = categories[categoryName].sheetId;
    const range = workbook + '!A1:O';
    const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '/values/' + range + '?key=' + apiKey;
    const imageCol = categories[categoryName].imageCol;
    const priceCol = categories[categoryName].priceCol;
    const sizeCol = categories[categoryName].sizeCol || null;

    productContainer.innerHTML = '<div class="loading">جار التحميل...</div>';
    
    // Clear previous search
    if (searchBox) {
        searchBox.value = '';
        
        // Show search box only for specific categories
        if (categoryName === 'احذية وحقائب متنوعة') {
            searchBox.style.display = 'block';
            searchBox.placeholder = '🔍 ابحث بالمقاس أو نوع الحذاء...';
        } else if (categoryName === 'مستلزمات موبايل') {
            searchBox.style.display = 'block';
            searchBox.placeholder = '🔍 ابحث بنوع الموبايل أو الاكسسوار...';
        } else {
            searchBox.style.display = 'none';
        }
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const products = data.values ? data.values.slice(1) : [];
            productContainer.innerHTML = '';

            if (products.length === 0) {
                productContainer.innerHTML = '<div class="default-message">لا توجد منتجات في هذا القسم حالياً <span class="emoji-icon">😔</span></div>';
                return;
            }

            products.forEach(product => {
                if (!product[0] || !product[imageCol.charCodeAt(0) - 65]) return;
                createProductElement(product, imageCol, priceCol, sizeCol);
            });

            updateCartButtons();
            // Smooth scroll to products section
            productContainer.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productContainer.innerHTML = '<div class="default-message">حدث خطأ في تحميل المنتجات <span class="emoji-icon">😞</span></div>';
        });
        
    trackAction('load_workbook', { category: categoryName, workbook: workbook });
}

// Create product element - معدلة للعمل مع نظام السلة الجديد
function createProductElement(product, imageCol, priceCol, sizeCol) {
    const defaultProductImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7YtdmI2LHYqSDYrdin2YTZiNeKPC90ZXh0Pjwvc3ZnPic=';
    
    const productName = product[0];
    const productPrice = product[priceCol.charCodeAt(0) - 65];
    const productImage = product[imageCol.charCodeAt(0) - 65];
    const productSize = sizeCol ? (product[sizeCol.charCodeAt(0) - 65] || 'غير محدد') : null;
    
    // تحقق من وجود المنتج في السلة
    const isInCart = selectedProducts.some(p => p.name === productName);
    
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
    // تنظيف النصوص للاستخدام في الـ JavaScript
    const cleanProductName = productName.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const cleanImageUrl = productImage.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    productDiv.innerHTML = `
        <img src="${productImage}" alt="Product Image" 
             onclick="enlargeImage('${cleanImageUrl}')"
             onerror="this.src='${defaultProductImage}'" loading="lazy">
        <div class="product-info">
            <div class="product-code">${productName}</div>
            <div class="product-price">
                <span class="price-icon">💰</span>
                ${parseInt(productPrice).toLocaleString()} دينار
            </div>
            ${sizeCol ? `<div class="product-size">
                <span class="size-icon">📏</span>
                المقاس: ${productSize}
            </div>` : ''}
            <button class="add-to-cart-btn ${isInCart ? 'selected' : ''}" 
                    data-product-name="${productName}"
                    onclick="addToCart('${cleanProductName}', '${productPrice}', '${cleanImageUrl}')">
                ${isInCart ? '✅ في السلة' : '🛒 أضف للسلة'}
            </button>
        </div>
    `;
    productContainer.appendChild(productDiv);
}

// Search products - النسخة البسيطة
function searchProduct() {
    if (!searchBox || !productContainer) return;
    
    const query = searchBox.value.toLowerCase();
    const productDivs = productContainer.getElementsByClassName('product');

    Array.from(productDivs).forEach(div => {
        const allText = div.textContent.toLowerCase();
        
        if (allText.includes(query)) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
    
    // تتبع البحث
    trackAction('search_products', { query: query, category: currentCategory });
}

// Enlarge image - النسخة البسيطة
function enlargeImage(src) {
    const overlay = document.getElementById('overlay');
    const enlargedImage = document.getElementById('enlargedImage');
    
    if (overlay && enlargedImage) {
        enlargedImage.src = src;
        overlay.style.display = 'flex';
        
        // Prevent body scroll when overlay is open
        document.body.style.overflow = 'hidden';
        
        trackAction('view_enlarged_image', { imageUrl: src });
    }
}

// Close enlarged image - النسخة البسيطة
function closeEnlargedImage() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== إدارة المستخدمين =====

function generateUserId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `SHIQ_USER_${timestamp}_${random}`;
}

function loadUserData() {
    try {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        if (userData) {
            const user = JSON.parse(userData);
            user.lastActive = new Date().toISOString();
            currentUser = user;
            updateUserWelcome();
            return user;
        }
        return null;
    } catch (error) {
        console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
        return null;
    }
}

function saveUserData(userData) {
    try {
        if (!userData.id) {
            userData.id = generateUserId();
        }
        
        if (!userData.registrationDate) {
            userData.registrationDate = new Date().toISOString();
        }
        userData.lastActive = new Date().toISOString();
        userData.version = CONFIG.APP_VERSION;
        userData.deviceId = deviceId;
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        currentUser = userData;
        updateUserWelcome();
        
        console.log('✅ تم حفظ بيانات المستخدم محلياً');
        return userData.id;
    } catch (error) {
        console.error('❌ خطأ في حفظ بيانات المستخدم:', error);
        return null;
    }
}

function updateUserWelcome() {
    const welcomeDiv = document.getElementById('userWelcome');
    const profileBtn = document.getElementById('userProfileBtn');
    
    if (currentUser && welcomeDiv) {
        const firstName = currentUser.name.split(' ')[0];
        welcomeDiv.innerHTML = 'مرحباً ' + firstName + ' من ' + currentUser.governorate + ' 👋';
        welcomeDiv.style.display = 'block';
        
        if (profileBtn) {
            profileBtn.classList.add('show');
        }
    }
}

// ===== إدارة السلة =====

function saveCartToStorage() {
    try {
        const cartData = {
            products: selectedProducts,
            lastUpdated: new Date().toISOString(),
            version: CONFIG.APP_VERSION,
            userId: currentUser?.id || null,
            deviceId: deviceId
        };
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.CART_DATA, JSON.stringify(cartData));
        updateCartButton();
        console.log('✅ تم حفظ السلة');
    } catch (error) {
        console.error('❌ خطأ في حفظ السلة:', error);
    }
}

function loadCartFromStorage() {
    try {
        const cartData = localStorage.getItem(CONFIG.STORAGE_KEYS.CART_DATA);
        if (cartData) {
            const parsedCart = JSON.parse(cartData);
            selectedProducts = parsedCart.products || [];
            console.log('✅ تم تحميل السلة:', selectedProducts.length, 'منتج');
        }
        updateCartButton();
    } catch (error) {
        console.error('❌ خطأ في تحميل السلة:', error);
        selectedProducts = [];
    }
}

function addToCart(name, price, imageUrl) {
    const existingProductIndex = selectedProducts.findIndex(p => p.name === name);
    
    if (existingProductIndex !== -1) {
        selectedProducts[existingProductIndex].quantity = (selectedProducts[existingProductIndex].quantity || 1) + 1;
        selectedProducts[existingProductIndex].lastUpdated = new Date().toISOString();
        showNotificationSuccess('📦 تم زيادة كمية "' + name + '" في السلة');
    } else {
        const product = {
            id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: name,
            price: parseFloat(price) || 0,
            imageUrl: imageUrl,
            quantity: 1,
            addedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        selectedProducts.push(product);
        showNotificationSuccess('✅ تم إضافة "' + name + '" للسلة');
    }
    
    saveCartToStorage();
    updateAddToCartButton(name, true);
    trackAction('add_to_cart', { productName: name, productPrice: price, cartTotal: selectedProducts.length });
}

function removeFromCart(productName, index = null) {
    if (index !== null && selectedProducts[index]) {
        selectedProducts.splice(index, 1);
    } else {
        selectedProducts = selectedProducts.filter(product => product.name !== productName);
    }
    
    saveCartToStorage();
    updateAddToCartButton(productName, false);
    showNotificationSuccess(`🗑️ تم حذف المنتج من السلة`);
    trackAction('remove_from_cart', { productName: productName, cartTotal: selectedProducts.length });
}

function updateAddToCartButton(productName, isAdded) {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-product-name') === productName) {
            if (isAdded) {
                btn.classList.add('selected');
                btn.innerHTML = '✅ في السلة';
            } else {
                btn.classList.remove('selected');
                btn.innerHTML = '🛒 أضف للسلة';
            }
        }
    });
}

function updateCartButtons() {
    selectedProducts.forEach(product => {
        updateAddToCartButton(product.name, true);
    });
}

function updateCartButton() {
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        const totalItems = selectedProducts.reduce((sum, product) => sum + (product.quantity || 1), 0);
        const totalPrice = selectedProducts.reduce((sum, product) => 
            sum + (parseFloat(product.price) || 0) * (product.quantity || 1), 0
        );
        
        if (totalItems > 0) {
            cartButton.innerHTML = `
                <span>🛒</span>
                <span>السلة (` + totalItems + `)</span>
                <span style="font-size: 0.9em; opacity: 0.9;">` + totalPrice.toLocaleString() + ` د.ع</span>
            `;
            cartButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        } else {
            cartButton.innerHTML = `
                <span>🛒</span>
                <span>السلة فارغة</span>
            `;
            cartButton.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
        }
    }
}

function openCart() {
    if (selectedProducts.length === 0) {
        showNotificationError('🛒 السلة فارغة! أضف بعض المنتجات أولاً');
        return;
    }
    
    createCartReviewWindow();
    trackAction('open_cart', { itemsCount: selectedProducts.length });
}

function createCartReviewWindow() {
    const subtotal = selectedProducts.reduce((sum, product) => 
        sum + (parseFloat(product.price) || 0) * (product.quantity || 1), 0
    );
    const deliveryFee = subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CONFIG.DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    
    let productsHtml = '';
    selectedProducts.forEach((product, index) => {
        const itemTotal = (parseFloat(product.price) || 0) * (product.quantity || 1);
        const cleanProductName = product.name.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        
        productsHtml += `
            <div class="cart-item" style="display: flex; align-items: center; padding: 15px; border: 2px solid #e5e7eb; margin: 10px 0; border-radius: 15px; background: #f9fafb;">
                <img src="${product.imageUrl}" alt="${cleanProductName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; margin-left: 15px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; color: #1f2937;">${product.name}</h4>
                    <p style="margin: 0; color: #ef4444; font-weight: bold;">${(parseFloat(product.price) || 0).toLocaleString()} د.ع × ${product.quantity || 1}</p>
                    <p style="margin: 5px 0 0 0; color: #059669; font-weight: bold;">المجموع: ${itemTotal.toLocaleString()} د.ع</p>
                </div>
                <div style="text-align: center;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <button onclick="changeQuantity(${index}, ${(product.quantity || 1) - 1})" style="width: 30px; height: 30px; border: none; background: #ef4444; color: white; border-radius: 50%; cursor: pointer;">-</button>
                        <span style="font-weight: bold; min-width: 20px; text-align: center;">${product.quantity || 1}</span>
                        <button onclick="changeQuantity(${index}, ${(product.quantity || 1) + 1})" style="width: 30px; height: 30px; border: none; background: #10b981; color: white; border-radius: 50%; cursor: pointer;">+</button>
                    </div>
                    <button onclick="removeFromCartReview(${index})" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 10px; cursor: pointer;">🗑️ حذف</button>
                </div>
            </div>
        `;
    });
    
    let customerInfo = '';
    if (currentUser) {
        customerInfo = `
            <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #8B5CF6;">
                <h3 style="color: #8B5CF6; margin-bottom: 15px;">👤 معلومات العميل</h3>
                <p><strong>الاسم:</strong> ${currentUser.name}</p>
                <p><strong>الهاتف:</strong> ${currentUser.phone}</p>
                <p><strong>المحافظة:</strong> ${currentUser.governorate}</p>
                <p><strong>العنوان:</strong> ${currentUser.address}</p>
                <p><strong>معرف العميل:</strong> ${currentUser.id}</p>
            </div>
        `;
    } else {
        customerInfo = `
            <div style="background: #fef3c7; padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #f59e0b;">
                <h3 style="color: #d97706; margin-bottom: 15px;">⚠️ يرجى تسجيل بياناتك</h3>
                <p>لإتمام الطلب، يرجى تسجيل بياناتك أولاً</p>
                <button onclick="window.opener.showUserRegistration(); window.close();" style="background: #8B5CF6; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; margin-top: 10px;">📝 تسجيل البيانات</button>
            </div>
        `;
    }
    
    const cartWindow = window.open('', '_blank', 'width=800,height=700,scrollbars=yes');
    cartWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🛒 مراجعة سلة التسوق - شي ان العراق</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    direction: rtl; 
                    margin: 0;
                    min-height: 100vh;
                }
                .container { 
                    background: white; 
                    border-radius: 20px; 
                    padding: 25px; 
                    max-width: 900px; 
                    margin: 0 auto; 
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                }
                h1 { 
                    text-align: center; 
                    color: #1f2937; 
                    margin-bottom: 30px; 
                    font-size: 2rem; 
                }
                .summary { 
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); 
                    padding: 20px; 
                    border-radius: 15px; 
                    margin: 20px 0; 
                    border: 2px solid #8B5CF6;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    font-size: 1.1rem;
                }
                .total-row {
                    font-weight: bold;
                    font-size: 1.3rem;
                    color: #1f2937;
                    border-top: 2px solid #8B5CF6;
                    padding-top: 10px;
                    margin-top: 15px;
                }
                .btn-primary { 
                    display: block; 
                    width: 100%; 
                    text-align: center; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 50px; 
                    margin: 25px 0; 
                    font-size: 1.2rem; 
                    font-weight: 700; 
                    transition: all 0.3s ease; 
                    border: none;
                    cursor: pointer;
                }
                .btn-primary:hover { 
                    background: linear-gradient(135deg, #128C7E 0%, #25D366 100%); 
                    transform: translateY(-3px); 
                    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4); 
                }
                .btn-secondary {
                    background: #6b7280;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    margin: 0 5px;
                }
                .delivery-note {
                    background: #fef3c7;
                    border: 2px solid #f59e0b;
                    color: #92400e;
                    padding: 10px;
                    border-radius: 10px;
                    margin: 10px 0;
                    text-align: center;
                }
                .free-delivery-note {
                    background: #d1fae5;
                    border: 2px solid #10b981;
                    color: #047857;
                    padding: 10px;
                    border-radius: 10px;
                    margin: 10px 0;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🛒 مراجعة سلة التسوق</h1>
                
                ${customerInfo}
                
                <div style="margin: 20px 0;">
                    <h3>📦 المنتجات المطلوبة (${selectedProducts.length} منتج)</h3>
                    ${productsHtml}
                </div>
                
                <div class="summary">
                    <h3 style="color: #8B5CF6; margin-bottom: 15px;">📊 ملخص الطلب</h3>
                    <div class="summary-row">
                        <span>المجموع الفرعي:</span>
                        <span>${subtotal.toLocaleString()} د.ع</span>
                    </div>
                    <div class="summary-row">
                        <span>رسوم التوصيل:</span>
                        <span>${deliveryFee === 0 ? 'مجاني 🎉' : deliveryFee.toLocaleString() + ' د.ع'}</span>
                    </div>
                    ${deliveryFee === 0 
                        ? '<div class="free-delivery-note">🎉 تم تفعيل التوصيل المجاني للطلبات أكثر من 50,000 د.ع!</div>' 
                        : `<div class="delivery-note">💡 أضف ${(CONFIG.FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} د.ع للحصول على توصيل مجاني!</div>`
                    }
                    <div class="summary-row total-row">
                        <span>المجموع الكلي:</span>
                        <span>${total.toLocaleString()} د.ع</span>
                    </div>
                </div>
                
                ${currentUser ? `
                    <button class="btn-primary" onclick="sendToWhatsApp()">
                        📱 إرسال الطلب عبر واتساب
                    </button>
                ` : ''}
                
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn-secondary" onclick="window.opener.clearCart(); window.close();">🧹 تفريغ السلة</button>
                    <button class="btn-secondary" onclick="window.close();">❌ إغلاق</button>
                </div>
            </div>
            
            <script>
                function changeQuantity(index, newQuantity) {
                    if (newQuantity <= 0) {
                        if (confirm('هل تريد حذف هذا المنتج من السلة؟')) {
                            window.opener.removeFromCart('', index);
                            window.location.reload();
                        }
                    } else {
                        window.opener.selectedProducts[index].quantity = newQuantity;
                        window.opener.saveCartToStorage();
                        window.location.reload();
                    }
                }
                
                function removeFromCartReview(index) {
                    if (confirm('هل تريد حذف هذا المنتج من السلة؟')) {
                        window.opener.removeFromCart('', index);
                        window.location.reload();
                    }
                }
                
                function sendToWhatsApp() {
                    window.opener.proceedToWhatsAppFromReview();
                    window.close();
                }
            </script>
        </body>
        </html>
    `);
}

function proceedToWhatsAppFromReview() {
    if (!currentUser) {
        showUserRegistration();
        return;
    }
    
    const subtotal = selectedProducts.reduce((sum, product) => 
        sum + (parseFloat(product.price) || 0) * (product.quantity || 1), 0
    );
    const deliveryFee = subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CONFIG.DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    
    const orderData = {
        userId: currentUser.id,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        governorate: currentUser.governorate,
        address: currentUser.address,
        products: selectedProducts,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        deviceId: deviceId,
        status: 'whatsapp_pending',
        orderDate: new Date().toISOString()
    };
    
    sendOrderToSheets(orderData);
    
    let message = '🛍️ طلب جديد من تطبيق شي ان العراق v' + CONFIG.APP_VERSION + '\n\n';
    message += `👤 معلومات العميل:\n`;
    message += '📛 الاسم: ' + currentUser.name + '\n';
    message += '📞 الهاتف: ' + currentUser.phone + '\n';
    message += '🏠 المحافظة: ' + currentUser.governorate + '\n';
    message += '📍 العنوان التفصيلي: ' + currentUser.address + '\n';
    message += '🆔 معرف العميل: ' + currentUser.id + '\n\n';
    
    message += `🛒 تفاصيل الطلب:\n`;
    message += '📦 عدد المنتجات: ' + selectedProducts.length + ' منتج\n';
    message += '📊 إجمالي القطع: ' + selectedProducts.reduce((sum, p) => sum + p.quantity, 0) + ' قطعة\n\n';
    
    message += `🏷️ المنتجات المطلوبة:\n`;
    selectedProducts.forEach((product, index) => {
        const itemTotal = (parseFloat(product.price) || 0) * (product.quantity || 1);
        message += '\n' + (index + 1) + '. ' + product.name + '\n';
        message += '   💰 السعر: ' + (parseFloat(product.price) || 0).toLocaleString() + ' د.ع\n';
        message += '   📦 الكمية: ' + (product.quantity || 1) + '\n';
        message += '   💵 المجموع: ' + itemTotal.toLocaleString() + ' د.ع\n';
        message += '   🔗 الصورة: ' + product.imageUrl + '\n';
    });

    message += `\n📊 ملخص الطلب:\n`;
    message += '💰 المجموع الفرعي: ' + subtotal.toLocaleString() + ' د.ع\n';
    message += '🚚 رسوم التوصيل: ' + (deliveryFee === 0 ? 'مجاني 🎉' : deliveryFee.toLocaleString() + ' د.ع') + '\n';
    message += '💵 المجموع الكلي: ' + total.toLocaleString() + ' د.ع\n\n';
    
    message += `📋 معلومات إضافية:\n`;
    message += `📅 تاريخ الطلب: ${new Date().toLocaleDateString('ar-IQ')}\n`;
    message += `⏰ وقت الطلب: ${new Date().toLocaleTimeString('ar-IQ')}\n`;
    message += `💳 طريقة الدفع: دفع عند الاستلام\n`;
    message += `🚚 التوصيل: خدمة التوصيل العادية\n\n`;
    
    message += `✅ يرجى تأكيد الطلب وتحديد موعد التسليم.\n`;
    message += '🚚 التوصيل متاح لجميع مناطق ' + currentUser.governorate + '\n';
    message += '📞 للاستفسار: ' + CONFIG.PHONE_NUMBER + '\n';
    message += '🌐 التطبيق: ' + CONFIG.APP_URL;

    const whatsappLink = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    
    trackAction('send_order_whatsapp', {
        orderId: orderData.userId + '_' + Date.now(),
        totalAmount: total,
        itemsCount: selectedProducts.length,
        deliveryFee: deliveryFee,
        governorate: currentUser.governorate
    });
    
    window.open(whatsappLink, '_blank');
    
    setTimeout(() => {
        showNotificationSuccess('📱 تم إرسال طلبك عبر واتساب! سيتم التواصل معك قريباً');
        
        setTimeout(() => {
            if (confirm('هل تريد تفريغ السلة بعد إرسال الطلب؟')) {
                clearCart();
            }
        }, 3000);
    }, 1000);
}

function clearCart() {
    selectedProducts = [];
    saveCartToStorage();
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.innerHTML = '🛒 أضف للسلة';
    });
    
    showNotificationSuccess('🧹 تم تفريغ السلة');
    trackAction('clear_cart', { cartWasEmpty: false });
}

// ===== إدارة التسجيل =====

function showUserRegistration() {
    const modal = document.getElementById('userRegistrationModal');
    if (modal) {
        modal.classList.add('show');
        trackAction('open_registration_form', { trigger: 'order_attempt' });
    }
}

function closeUserRegistration() {
    const modal = document.getElementById('userRegistrationModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

async function handleUserRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const interests = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const userData = {
        id: generateUserId(),
        name: formData.get('userName').trim(),
        phone: formData.get('userPhone').trim(),
        governorate: formData.get('userGovernorate'),
        address: formData.get('userAddress').trim(),
        gender: formData.get('userGender') || '',
        interests: interests,
        notificationsEnabled: localStorage.getItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS_STATUS) === 'granted',
        registrationDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        version: CONFIG.APP_VERSION,
        deviceId: deviceId
    };
    
    if (!userData.name || !userData.phone || !userData.governorate || !userData.address) {
        showNotificationError('❌ يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!/^07[0-9]{9}$/.test(userData.phone)) {
        showNotificationError('❌ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 07 ويتكون من 11 رقم');
        return;
    }
    
    if (saveUserData(userData)) {
        await sendUserDataToSheets(userData);
        closeUserRegistration();
        
        const firstName = userData.name.split(' ')[0];
        showNotificationSuccess('🎉 مرحباً ' + firstName + '! تم تسجيلك بنجاح في شي ان العراق');
        
        trackAction('user_registered', {
            governorate: userData.governorate,
            interests: userData.interests,
            notificationsEnabled: userData.notificationsEnabled
        });
        
        setTimeout(() => {
            openCart();
        }, 1000);
    }
}

// ===== إرسال البيانات =====

async function sendUserDataToSheets(userData) {
    try {
        const payload = {
            action: 'save_user',
            userData: {
                ...userData,
                timestamp: new Date().toISOString(),
                source: 'web_app_v2.3'
            }
        };
        
        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('✅ تم إرسال بيانات المستخدم للنظام');
        }
        
        return result;
    } catch (error) {
        console.error('❌ خطأ في إرسال بيانات المستخدم:', error);
        return { success: false, error: error.message };
    }
}

async function sendOrderToSheets(orderData) {
    try {
        const payload = {
            action: 'save_order',
            orderData: {
                ...orderData,
                timestamp: new Date().toISOString(),
                source: 'web_app_v2.3'
            }
        };
        
        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('✅ تم إرسال بيانات الطلب للنظام');
        }
        
        return result;
    } catch (error) {
        console.error('❌ خطأ في إرسال بيانات الطلب:', error);
        return { success: false, error: error.message };
    }
}

// ===== دوال مساعدة =====

function trackAction(actionType, actionData = {}) {
    try {
        const eventData = {
            deviceId: deviceId,
            userId: currentUser?.id || null,
            actionType: actionType,
            actionData: {
                ...actionData,
                timestamp: new Date().toISOString(),
                url: window.location.href
            }
        };
        
        fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'track_event',
                eventData: eventData
            })
        }).catch(() => {
            // تجاهل أخطاء التتبع
        });
        
        console.log('📊 تتبع الحدث:', actionType, actionData);
    } catch (error) {
        console.log('خطأ في تتبع الحدث:', error);
    }
}

function showNotificationSuccess(message) {
    createToast(message, 'success');
}

function showNotificationError(message) {
    createToast(message, 'error');
}

function showNotificationInfo(message) {
    createToast(message, 'info');
}

function createToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const colors = {
        success: 'linear-gradient(135deg, #10B981, #059669)',
        error: 'linear-gradient(135deg, #EF4444, #DC2626)',
        info: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
    };
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        line-height: 1.4;
        white-space: pre-line;
    `;
    
    toast.innerHTML = `${icons[type]} ${message}`;
    document.body.appendChild(toast);
    
    const duration = type === 'error' ? 7000 : (type === 'info' ? 4000 : 3000);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function enlargeImage(imageUrl) {
    const overlay = document.getElementById('overlay');
    const enlargedImage = document.getElementById('enlargedImage');
    
    if (overlay && enlargedImage) {
        enlargedImage.src = imageUrl;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        trackAction('view_enlarged_image', { imageUrl: imageUrl });
    }
}

function closeEnlargedImage() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== الملف الشخصي =====

function openUserProfile() {
    if (!currentUser) {
        showUserRegistration();
        return;
    }
    
    const modal = document.getElementById('userProfileModal');
    const content = document.getElementById('userProfileContent');
    
    if (modal && content) {
        content.innerHTML = `
            <div class="user-profile-info">
                <div class="profile-section">
                    <h3>📋 المعلومات الأساسية</h3>
                    <p><strong>الاسم:</strong> ${currentUser.name}</p>
                    <p><strong>الهاتف:</strong> ${currentUser.phone}</p>
                    <p><strong>المحافظة:</strong> ${currentUser.governorate}</p>
                    <p><strong>العنوان:</strong> ${currentUser.address}</p>
                    <p><strong>الجنس:</strong> ${currentUser.gender || 'غير محدد'}</p>
                </div>
                
                <div class="profile-section">
                    <h3>🎯 الاهتمامات</h3>
                    <div class="interests-list">
                        ${currentUser.interests && currentUser.interests.length > 0 
                            ? currentUser.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')
                            : '<p>لا توجد اهتمامات محددة</p>'
                        }
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3>🔔 الإشعارات</h3>
                    <p>حالة الإشعارات: ${currentUser.notificationsEnabled ? '✅ مفعلة' : '❌ غير مفعلة'}</p>
                    <p>إذن المتصفح: ${Notification.permission === 'granted' ? '✅ مسموح' : '❌ غير مسموح'}</p>
                </div>
                
                <div class="profile-section">
                    <h3>📊 إحصائيات الحساب</h3>
                    <p><strong>تاريخ التسجيل:</strong> ${new Date(currentUser.registrationDate).toLocaleDateString('ar-IQ')}</p>
                    <p><strong>آخر نشاط:</strong> ${new Date(currentUser.lastActive).toLocaleDateString('ar-IQ')}</p>
                    <p><strong>معرف العميل:</strong> ${currentUser.id}</p>
                    <p><strong>معرف الجهاز:</strong> ${deviceId}</p>
                </div>
                
                <div class="profile-section">
                    <h3>🛒 إحصائيات التسوق</h3>
                    <p><strong>منتجات في السلة:</strong> ${selectedProducts.length}</p>
                    <p><strong>قيمة السلة:</strong> ${selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()} د.ع</p>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        trackAction('view_profile', {});
    }
}

function closeUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function editUserProfile() {
    closeUserProfile();
    showUserRegistration();
    
    if (currentUser) {
        setTimeout(() => {
            document.getElementById('userName').value = currentUser.name;
            document.getElementById('userPhone').value = currentUser.phone;
            document.getElementById('userGovernorate').value = currentUser.governorate;
            document.getElementById('userAddress').value = currentUser.address;
            document.getElementById('userGender').value = currentUser.gender || '';
            
            if (currentUser.interests) {
                currentUser.interests.forEach(interest => {
                    const checkbox = document.querySelector(`input[value="${interest}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }, 100);
    }
    
    trackAction('edit_profile', {});
}

// ===== إعداد الأحداث =====

function setupEventListeners() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeEnlargedImage();
            }
        });
    }

    const enlargedImage = document.getElementById('enlargedImage');
    if (enlargedImage) {
        enlargedImage.addEventListener('click', function(e) {
            e.stopPropagation();
            closeEnlargedImage();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEnlargedImage();
        }
    });

    window.addEventListener('online', () => {
        isOnline = true;
        showNotificationSuccess('🌐 تم استعادة الاتصال بالإنترنت');
    });

    window.addEventListener('offline', () => {
        isOnline = false;
        showNotificationError('📡 انقطع الاتصال بالإنترنت');
    });
}

// ===== تحميل التطبيق =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 شي ان العراق v' + CONFIG.APP_VERSION + ' يتم تحميله...');
    
    // 1. إنشاء/تحميل معرف الجهاز
    deviceId = getOrCreateDeviceId();
    console.log('📱 معرف الجهاز:', deviceId);
    
    // 2. تهيئة الإشعارات التلقائية
    await initializeNotifications();
    
    // 3. تحميل بيانات المستخدم (إن وجدت)
    currentUser = loadUserData();
    
    // 4. تحميل السلة من التخزين المحلي
    loadCartFromStorage();
    
    // 5. تحديث أزرار السلة
    updateCartButton();
    
    // 6. إنشاء شريط تنقل الفئات
    createCategoryNav();
    
    // 7. تحميل صور الفئات - الدالة المُصححة
    loadCategoryImages();
    
    // 8. إخفاء مربع البحث في البداية
    if (searchBox) {
        searchBox.style.display = 'none';
    }
    
    // 9. إعداد نموذج التسجيل
    const registrationForm = document.getElementById('userRegistrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleUserRegistration);
    }
    
    // 10. إعداد أحداث أخرى
    setupEventListeners();
    
    // 11. عرض رسالة ترحيب مناسبة
    if (currentUser) {
        currentUser.lastActive = new Date().toISOString();
        saveUserData(currentUser);
        
        const firstName = currentUser.name.split(' ')[0];
        setTimeout(() => {
            showNotificationSuccess('أهلاً بعودتك ' + firstName + ' 👋');
        }, 1000);
        
        trackAction('user_returned', {
            daysSinceLastActive: Math.floor((Date.now() - new Date(currentUser.lastActive).getTime()) / (1000 * 60 * 60 * 24))
        });
    } else {
        setTimeout(() => {
            showNotificationInfo('👋 مرحباً بك في شي ان العراق! تصفح المنتجات واستمتع بالتسوق');
        }, 2000);
        
        trackAction('new_visitor', { deviceId: deviceId });
    }
    
    // 12. تحديث أزرار المنتجات المضافة للسلة
    setTimeout(() => {
        updateCartButtons();
    }, 1000);
    
    console.log('✅ شي ان العراق v' + CONFIG.APP_VERSION + ' جاهز للاستخدام!');
    console.log('📊 إحصائيات التطبيق:');
    console.log('- معرف الجهاز:', deviceId);
    console.log('- المستخدم:', currentUser ? currentUser.name : 'غير مسجل');
    console.log('- السلة:', selectedProducts.length, 'منتج');
    console.log('- الإشعارات:', Notification.permission);
    console.log('- الاتصال:', isOnline ? 'متصل' : 'غير متصل');
});

// إعداد Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM جاهز، بدء تنفيذ الكود...');
    loadCategoryImages();
    createCategoryNav();
    loadCartFromStorage();
    loadUserData();
});
