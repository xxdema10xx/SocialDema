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
$timestamp = time();
$date = date('Y-m-d H:i:s', $timestamp);

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dbConnector = new DbConnector('localhost', 'root', 'root', 'itsumbria_coding');
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

        $nameStatement = $dbConnector->prepare('SELECT username FROM users WHERE id = :userId;');
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
