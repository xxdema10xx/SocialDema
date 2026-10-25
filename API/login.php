<?php
// carico la connessione al database e la classe che gestisce i token
require_once '../DbConnector.php';
require_once 'tokenManager.php';

$data = [];

// leggo il body della richiesta (JSON) e lo trasformo in array
$json = file_get_contents('php://input');
$postData = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbConnector = new DbConnector ('localhost', 'root', 'root', 'itsumbria_coding');
    // cerco l'utente con lo username ricevuto
    $statement = $dbConnector->prepare('SELECT * FROM users WHERE username = :username;');
    $statement->bindParam(':username', $postData['username']);
    $statement->execute();
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        // password_verify confronta la password scritta con quella salvata (hashata) nel database
        if (password_verify($postData['password'], $result['password'])) {
            http_response_code(200);
            // login giusto: creo il token con l'id dell'utente (dura 1 ora)
            $tokenManager = new TokenManager();
            $token = $tokenManager->generateToken((int)$result['id']);
            $data = [
                "token" => $token
            ];
        } else {
            http_response_code(401);
            $data["Error"] = "Password errata";
        }
    } else {
        http_response_code(404);
        $data["Error"] = "Username errato";
    }
}
// rispondo sempre in JSON
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data);
