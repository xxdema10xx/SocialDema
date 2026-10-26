<?php

require_once "../DbConnector.php";

$errorCode = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $registerData = json_decode(file_get_contents('php://input'), true);

    if (array_key_exists("username", $registerData) && strlen($registerData['username']) === 0){
        $errorCode = '1';
    }

    if (array_key_exists("password", $registerData) && strlen($registerData['password']) === 0) {
        $errorCode = '1';
    }

    if (array_key_exists("password2", $registerData) && strlen($registerData['password2']) === 0) {
        $errorCode = '1';
    }

    if (!$errorCode) {
        $connection = new DbConnector("localhost", "root", "root", "itsumbria_coding");
        $statement = $connection->prepare ("SELECT * FROM users WHERE users.username = :username");
        $statement->bindParam(':username', $registerData['username']);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if (!empty($result)) {
            $errorCode = '2';

        } else {

            if($registerData['password'] == $registerData['password2']){

                // hasho la password prima di salvarla, così login.php (password_verify) la riconosce
                $hashedPassword = password_hash($registerData['password'], PASSWORD_DEFAULT);

                $statement = $connection->prepare("
                INSERT INTO users (username, password, role) VALUES (:username, :password, 'Utente')");
                $statement->bindParam(':username', $registerData['username']);
                $statement->bindParam(':password', $hashedPassword);
                $statement->execute();

            } else {

                $errorCode = '3';
            }
        }
    }
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode(["errorCode" => $errorCode]);
?>
