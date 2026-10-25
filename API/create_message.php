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
// data e ora attuali, nel formato che vuole il database
$timestamp = time();
$date = date('Y-m-d H:i:s', $timestamp);

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dbConnector = new DbConnector('localhost', 'root', 'root', 'itsumbria_coding');
    // salvo il nuovo messaggio con il testo, l'autore (preso dal token) e la data
    $statement = $dbConnector->prepare('INSERT INTO posts (content, user_id, creation_date)
                                                    VALUES (
                                                        :userContent,
                                                        :userId,
                                                        :publish_date
                                                            )');
    $statement->bindParam(':userContent', $postData['user_message']);
    $statement->bindParam(':userId', $userId);
    $statement->bindParam(':publish_date',$date);
    if($statement->execute()) {

        // messaggio salvato: cerco lo username dell'autore per rispondere con i dati completi
        $nameStatement =$dbConnector->prepare('SELECT username FROM users WHERE id = :userId;');
        $nameStatement->bindParam(':userId', $userId);
        $nameStatement->execute();
        $nameResult = $nameStatement->fetchColumn();

        $data = [
                'content' => $postData['user_message'],
                'creation_date' => $timestamp,
                'user_id' => $userId,
                'username' => $nameResult
        ];
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code(201);
        echo json_encode($data);
    } else {
        http_response_code(401);
    }
}
?>
