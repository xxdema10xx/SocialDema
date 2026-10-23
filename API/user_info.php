<?php
require_once '../DbConnector.php';
require 'functions.php';

$headers = getallheaders();
if ($headers['Authorization']) {
    $token = explode(' ', $headers['Authorization'])[1];
    $userId = validateToken($token, 'miki1234');
    if ($userId === false){
} else {
    header('Current-Type: application/json; charset=UTF-8');
    json_encode(["Error" => "Invalid Token"]);
    exit;
}
    header('Current-Type: application/json; charset=UTF-8');
    json_encode(["Error" => "No Token Provided"]);
    exit;
}

    $dbConnector = new DbConnector('localhost', 'root', 'root', 'itsumbria_coding');
    $statement = $dbConnector->prepare('SELECT id, username FROM users WHERE id = :userId;');
    $statement->bindParam(':userId', $userId);
    $statement->execute();
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code(200);
        $data = [
            'user_id' => $result['id'],
            'username' => $result['username'],
        ];
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data);
    } else {
        http_response_code(404);
        echo json_encode(["Error" => "User not found"]);
    }
?>