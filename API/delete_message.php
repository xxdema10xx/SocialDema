<?php
require_once '../DbConnector.php';
require 'functions.php';

$headers = array_change_key_case(getallheaders(), CASE_LOWER);
if ($headers['authorization']) {
    $token = explode(' ', $headers['authorization'])[1];
    $userId = validateToken($token, 'miki1234');
    if ($userId === false){
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(["Error" => "Invalid Token"]);
        exit;
    }
} else {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["Error" => "No Token Provided"]);
    exit;
}

$json = file_get_contents('php://input');
$postData = json_decode($json, true);

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $dbConnector = new DbConnector('localhost', 'root', 'root', 'itsumbria_coding');
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
