<?php
// uso il fuso orario italiano: MySQL salva/legge i timestamp con questo fuso (SYSTEM), senza questo PHP li interpreta come UTC
date_default_timezone_set('Europe/Rome');

// carico la classe dei token e la connessione al database
require_once 'tokenManager.php';
require_once '../DbConnector.php';
$dbConnector = new DbConnector ('localhost', 'root', 'root', 'itsumbria_coding');

// leggo gli header della richiesta (in minuscolo così "Authorization" e "authorization" sono uguali)
$headers = array_change_key_case(getallheaders(), CASE_LOWER);

//error_log(print_r($headers, true));

if ($headers['authorization']) {
    // l'header è "Bearer <token>": prendo solo la seconda parte
    $token = explode(' ', $headers['authorization'])[1];
    $tokenManager = new TokenManager();
    // se la firma non torna o il token è scaduto mi fermo qui
    if (!$tokenManager->validate($token)) {
        echo json_encode(["Error" => "Invalid Token"]);
        exit;
    }
    // il token è valido: ricavo l'id dell'utente che sta facendo la richiesta
    $userId = $tokenManager->extractID($token);
} else {
     echo json_encode(["Error" => "No Token Provided"]);
    exit;
}

// paginazione: leggo il numero di pagina dall'url (?page=2), se manca o non è valido uso la pagina 1
if(isset($_GET["page"]) && is_numeric($_GET["page"]) && $_GET["page"] >= 1) {
    $page = $_GET["page"];
} else {
    $page = 1;
}

// 10 messaggi per pagina, start_from = da quale messaggio iniziare
$limit =10;
$start_from = ($page-1) * $limit;

// ruolo dell'utente che ha fatto la richiesta: serve al frontend per decidere quali bottoni mostrare
$roleStatement = $dbConnector->prepare('SELECT role FROM users WHERE id = :userId;');
$roleStatement->bindParam(':userId', $userId);
$roleStatement->execute();
$userRole = $roleStatement->fetchColumn();

// prendo i messaggi non eliminati (deletion_date vuota) con il nome di chi li ha scritti, dal più recente

$statement = $dbConnector->prepare('SELECT *, posts.id as post_id FROM posts JOIN users ON posts.user_id = users.id WHERE posts.deletion_date is NULL order by posts.creation_date DESC LIMIT :start_from,:limit;');
$statement->bindParam(':start_from', $start_from, PDO::PARAM_INT);
$statement->bindParam(':limit', $limit, PDO::PARAM_INT);
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

// conto quanti messaggi ci sono in totale (serve per sapere quante pagine esistono)
$stmt = $dbConnector->prepare('SELECT COUNT(id) AS total_posts FROM posts WHERE posts.deletion_date is NULL');
$stmt->execute();
$total_posts = $stmt->fetch(PDO::FETCH_ASSOC);

// preparo solo i campi che servono all'app
$print = [];

foreach ($results as $row) {
    $print[] = [
           'id' => $row['post_id'],
            'content' => $row['content'],
            'creation_date' => strtotime($row['creation_date']),
            'user_id' => (int)$row['user_id'],
            'username' => $row['username']
    ];
}

// risposta finale: i messaggi (items) e le info sulla paginazione
$data = [
    'items' => $print,
    'current_user' => [
        'id' => (int)$userId,
        'role' => $userRole
    ],
    'pagination' => [
        'current_page' => $page,
        'total_items' => $total_posts['total_posts'],
        'items_per_page' => $limit,
        'items_count' => count($print),
        'total_pages' => ceil($total_posts['total_posts'] / $limit)
    ]
];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data);
?>
