<?php
// registrazione di un nuovo utente: errorCode dice al frontend cosa è andato storto (1 = campo vuoto, 2 = username già in uso, 3 = password diverse)
require_once "../DbConnector.php";

$errorCode = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $registerData = json_decode(file_get_contents('php://input'), true);

    // controllo che nessuno dei tre campi sia vuoto
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
        // controllo che lo username non sia già usato da qualcun altro
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

                // nuovo utente: parte sempre con ruolo "Utente" (Moderatore/SuperAdmin si assegnano a mano dal DB)
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

// rispondo sempre in JSON
header('Content-Type: application/json; charset=UTF-8');
echo json_encode(["errorCode" => $errorCode]);
?>
