<?php
require_once '../DbConnector.php';
require_once 'tokenManager.php';

// leggo gli header della richiesta (in minuscolo così "Authorization" e "authorization" sono uguali)
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
if ($headers['authorization']) {
    // l'header è "Bearer <token>": prendo solo la seconda parte
    $token = explode(' ', $headers['authorization'])[1];
    $tokenManager = new TokenManager();
    // se la firma non torna o il token è scaduto mi fermo qui
    if (!$tokenManager->validate($token)) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(["Error" => "Invalid Token"]);
        exit;
    }
    // il token è valido: ricavo l'id dell'utente che sta facendo la richiesta
    $userId = $tokenManager->extractID($token);
} else {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["Error" => "No Token Provided"]);
    exit;
}

// leggo il body della richiesta (JSON) e lo trasformo in array
$json = file_get_contents('php://input');
$postData = json_decode($json, true);

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $dbConnector = new DbConnector('localhost', 'root', 'root', 'itsumbria_coding');
    // eliminazione "morbida": non cancello la riga, scrivo solo la data di eliminazione (solo se il messaggio è mio)
    $statement = $dbConnector->prepare('UPDATE posts SET deletion_date = NOW() WHERE id = :id AND user_id = :user_id');
    $statement->bindParam('id', $postData['post_id']);
    $statement->bindParam('user_id', $userId);

    if ($statement->execute()) {
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code(201);
        echo 'Messaggio eliminato con successo';
    } else {
        http_response_code(401);
    }
}
?>
