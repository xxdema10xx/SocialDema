<?php
require_once '../DbConnector.php';
require 'functions.php';

$data = [];

$json = file_get_contents('php://input');
$postData = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbConnector = new DbConnector ('localhost', 'root', 'root', 'message_board_db');
    $statement = $dbConnector->prepare('SELECT * FROM users WHERE username = :username;');
    $statement->bindParam(':username', $postData['username']);
    $statement->execute();
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        if (password_verify($postData['password'], $result['password'])) {
            http_response_code(200);
            $token = generateToken($result['id'], "miki1234");
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
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data);
