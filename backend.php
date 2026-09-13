<?php
// إعدادات الأمان ورؤوس الاتصال (CORS & Headers)
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

// ==========================================
// 🔐 إعدادات حساب فيسبوك
// ==========================================
// لا يوضع أي توكن أو معرف حساب هنا مباشرة داخل الكود إطلاقاً.
//
// الكود بيدور على ملف secure_config.php في مكانين بالترتيب:
// 1) نفس مجلد backend.php (مطلوب على استضافات زي InfinityFree اللي
//    بتمنعك من الوصول لأي مجلد برّه htdocs). في الحالة دي *لازم* يكون
//    فيه ملف .htaccess بجانبه يمنع فتحه من المتصفح مباشرة (مرفق معاك).
// 2) المجلد اللي فوق public_html/htdocs مباشرة (مناسب لاستضافات زي
//    Hostinger اللي بتسمح بالوصول لمجلد فوق الويب روت، وده أأمن اختيار
//    لو متاح عندك).
//
// لو محتاج تشتغل بمتغيرات بيئة (Environment Variables) بدل الملف، هو
// بيقرأها تلقائيًا لو الملف مش موجود.

$secureConfigCandidates = [
    __DIR__ . '/secure_config.php',    // نفس مجلد htdocs (InfinityFree)
    __DIR__ . '/../secure_config.php', // فوق public_html (Hostinger وغيرها)
];
foreach ($secureConfigCandidates as $secureConfigPath) {
    if (file_exists($secureConfigPath)) {
        require $secureConfigPath; // المفروض يعرّف الثوابت الثلاثة تحت
        break;
    }
}

$META_ACCESS_TOKEN   = defined('META_ACCESS_TOKEN')   ? META_ACCESS_TOKEN   : (getenv('META_ACCESS_TOKEN') ?: '');
$FACEBOOK_ACCOUNT_ID = defined('FACEBOOK_ACCOUNT_ID') ? FACEBOOK_ACCOUNT_ID : (getenv('FACEBOOK_ACCOUNT_ID') ?: '');
$FACEBOOK_PAGE_ID    = defined('FACEBOOK_PAGE_ID')    ? FACEBOOK_PAGE_ID    : (getenv('FACEBOOK_PAGE_ID') ?: '');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// 1. جلب الصور والفيديوهات من صفحة فيسبوك باستخدام التوكن المخزن بالباك إند
if ($action === 'get_media') {
    if (empty($META_ACCESS_TOKEN) || empty($FACEBOOK_PAGE_ID)) {
        // صور افتراضية احتياطية في حالة عدم ضبط التوكن بعد
        echo json_encode([
            'success' => true,
            'media' => [
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600'
            ]
        ]);
        exit;
    }

    $url = "https://graph.facebook.com/v19.0/{$FACEBOOK_PAGE_ID}/posts?fields=full_picture,message&access_token=" . urlencode($META_ACCESS_TOKEN);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $apiResult = json_decode($response, true);
    $mediaList = [];

    if (isset($apiResult['data'])) {
        foreach ($apiResult['data'] as $post) {
            if (!empty($post['full_picture'])) {
                $mediaList[] = $post['full_picture'];
            }
        }
    }

    // إذا لم تتوفر صور من المنشورات، نضع صور افتراضية بجانبها
    if (empty($mediaList)) {
        $mediaList = [
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600'
        ];
    }

    echo json_encode(['success' => true, 'media' => $mediaList]);
    exit;
}

// 2. إنشاء الحملة الإعلانية وإرسالها لـ Meta Graph API
if ($action === 'create_campaign') {
    $campName = $_POST['camp_name'] ?? 'Al-Hawary Campaign';
    $budget = $_POST['budget'] ?? 250;
    $adText = $_POST['ad_text'] ?? '';
    $mediaUrl = $_POST['media_url'] ?? '';

    if (empty($META_ACCESS_TOKEN) || empty($FACEBOOK_ACCOUNT_ID)) {
        echo json_encode(['success' => false, 'error' => 'التوكن أو معرف حساب الإعلانات غير مضبوط كمتغير بيئة على السيرفر (META_ACCESS_TOKEN / FACEBOOK_ACCOUNT_ID)']);
        exit;
    }

    // تجهيز طلب إنشاء الحملة لفيسبوك
    $url = "https://graph.facebook.com/v19.0/{$FACEBOOK_ACCOUNT_ID}/campaigns";
    
    $postData = [
        'name' => $campName,
        'objective' => 'OUTCOME_LEADS',
        'status' => 'ACTIVE',
        'special_ad_categories' => 'NONE',
        'access_token' => $META_ACCESS_TOKEN
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $apiResult = json_decode($response, true);

    if ($httpCode >= 200 && $httpCode < 300 && isset($apiResult['id'])) {
        // تسجيل العملية في السيرفر
        file_put_contents('campaign_logs.txt', "[" . date('Y-m-d H:i:s') . "] Created Campaign ID: " . $apiResult['id'] . "\n", FILE_APPEND);
        
        echo json_encode([
            'success' => true, 
            'campaign_id' => $apiResult['id'],
            'message' => 'تم إنشاء وإطلاق الحملة الإعلانية بنجاح عبر السيرفر!'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'error' => $apiResult['error']['message'] ?? 'فشل الاتصال بـ Meta Graph API'
        ]);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Invalid action']);
?>
