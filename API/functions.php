<?php
function generateToken($userId, $secretKey){
    $payload = base64_encode(json_encode([
        'id' => $userId,
        'expiring_time' => time() + 3600,
    ]));
    $signature = hash_hmac('sha256', $payload, $secretKey);
    return "$payload.$signature";
}
function validateToken($token, $secretKey){
    $parts = explode('.', $token);
    if (count($parts) !== 2){
        return false;
    }
    $signature = hash_hmac('sha256', $parts[0], $secretKey);

    if(!hash_equals($parts[1], $signature)){
        return false;
    }
    $payload = $parts[0];
    $json = base64_decode($payload);
    $data = json_decode($json, true);
    return $data['id'];
}
?>