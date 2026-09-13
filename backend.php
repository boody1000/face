<?php
// إعدادات الأمان ورؤوس الاتصال (CORS & Headers)
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

// ==========================================
// 🔐 إعدادات حساب فيسبوك (توضع هنا فقط بأمان تام)
// ==========================================
$META_ACCESS_TOKEN = "EAAdHlDS8H6ABSU4ZA67refEA4bmnvBbAldPwCQZCyMXG2ZCHPWC5GPzZB5RDU1vkqJYPUJL1vJo14oLAdMeg2ZB5RodFfPeqT7Uj3WlqXZAzwcWj5ptsrc1YNTjBmcbvw0nHntgNZAQujvrq5BuMk2Dr6fVnanQHoTyEANdvudhLGwM5fZC9mZCZCI8grYdgfoM6OPXdNMicQ341ZBkLdZCd1ZBVEU7FPGZCdDxS4F"; 
$FACEBOOK_ACCOUNT_ID = "act_123456789"; // معرف حساب الإعلانات
$FACEBOOK_PAGE_ID = "123456789012345";    // معرف صفحة الفيسبوك الخاصة بشركة الهواري

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// 1. جلب الصور والفيديوهات من صفحة فيسبوك باستخدام التوكن المخزن بالباك إند
if ($action === 'get_media') {
    if (empty($META_ACCESS_TOKEN) || str_starts_with($META_ACCESS_TOKEN, "ضع_التوكن")) {
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

    if (empty($META_ACCESS_TOKEN) || str_starts_with($META_ACCESS_TOKEN, "ضع_التوكن")) {
        echo json_encode(['success' => false, 'error' => 'يرجى إدخال التوكن الصحيح داخل ملف backend.php']);
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
