<?php
// dice all'app chi sono: dal token ricavo l'id dell'utente e restituisco id, username e ruolo
// carico la classe dei token e la connessione al database
require_once 'tokenManager.php';
require_once '../DbConnector.php';

// leggo gli header della richiesta (in minuscolo così "Authorization" e "authorization" sono uguali)
$headers = array_change_key_case(getallheaders(), CASE_LOWER);

if ($headers['authorization']) {
    // l'header è "Bearer <token>": prendo solo la seconda parte
    $token = explode(' ', $headers['authorization'])[1];
    $tokenManager = new TokenManager();
    // se la firma non torna o il token è scaduto mi fermo qui
    if (!$tokenManager->validate($token)) {
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code(401);
        echo json_encode(["Error" => "Invalid Token"]);
        exit;
    }
    // il token è valido: ricavo l'id dell'utente che sta facendo la richiesta
    $userId = $tokenManager->extractID($token);
} else {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(401);
    echo json_encode(["Error" => "No Token Provided"]);
    exit;
}

$dbConnector = new DbConnector('localhost', 'root', 'root', 'itsumbria_coding');
$statement = $dbConnector->prepare('SELECT id, username, role FROM users WHERE id = :userId;');
$statement->bindParam(':userId', $userId);
$statement->execute();
$result = $statement->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json; charset=UTF-8');
if ($result) {
    http_response_code(200);
    $data = [
        // (int) perché PDO restituirebbe l'id come stringa e nel frontend lo confronto con user_id dei messaggi
        'user_id' => (int)$result['id'],
        'username' => $result['username'],
        'role' => $result['role'],
    ];
    echo json_encode($data);
} else {
    http_response_code(404);
    echo json_encode(["Error" => "User not found"]);
}
?>
