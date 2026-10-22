<?php
require_once '../DbConnector.php';
require 'functions.php';

$headers = getallheaders();
if ($headers['Authorization']) {
    $token = explode(' ', $headers['Authorization'])[1];
    $userId = validateToken($token, 'miki1234');
    if ($userId === false){
        header('Current-Type: application/json; charset=UTF-8');
        json_encode(["Error" => "Invalid Token"]);
        exit;
    }
} else {
    header('Current-Type: application/json; charset=UTF-8');
    json_encode(["Error" => "No Token Provided"]);
    exit;
}

$json = file_get_contents('php://input');
$postData = json_decode($json, true);

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $dbConnector = new DbConnector('localhost', 'root', 'root', 'message_board_db');
    $statement = $dbConnector->prepare('UPDATE post SET deleted_at = NOW() WHERE id = :id AND user_id = :user_id');
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
