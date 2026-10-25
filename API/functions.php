<?php
// vecchie funzioni per i token (formato payload.firma), ora sostituite dalla classe TokenManager
// le usa ancora solo user_info.php
function generateToken($userId, $secretKey){
    // il payload contiene l'id dell'utente e la scadenza, in base64
    $payload = base64_encode(json_encode([
        'id' => $userId,
        'expiring_time' => time() + 3600,
    ]));
    // la firma serve a capire se il token è stato modificato
    $signature = hash_hmac('sha256', $payload, $secretKey);
    return "$payload.$signature";
}
function validateToken($token, $secretKey){
    // divido il token in payload e firma
    $parts = explode('.', $token);
    if (count($parts) !== 2){
        return false;
    }
    // ricalcolo la firma e la confronto con quella ricevuta
    $signature = hash_hmac('sha256', $parts[0], $secretKey);

    if(!hash_equals($parts[1], $signature)){
        return false;
    }
    // la firma è giusta: ritorno l'id dell'utente scritto nel payload
    $payload = $parts[0];
    $json = base64_decode($payload);
    $data = json_decode($json, true);
    return $data['id'];
}
?>
