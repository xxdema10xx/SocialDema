<?php
require 'functions.php';
require_once '../DbConnector.php';
$dbConnector = new DbConnector ('localhost', 'root', 'root', 'itsumbria_coding');

$headers = getallheaders();

//error_log(print_r($headers, true));

if ($headers['Authorization']) {
    $token = explode(' ', $headers['Authorization'])[1];
    $userId = validateToken($token, 'miki1234');
    if ($userId === false){
        echo json_encode(["Error" => "Invalid Token"]);
        exit;
    }
} else {
     echo json_encode(["Error" => "No Token Provided"]);
    exit;
}

if(isset($_GET["page"]) && is_numeric($_GET["page"]) && $_GET["page"] >= 1) {
    $page = $_GET["page"];
} else {
    $page = 1;
}

$limit =10;
$start_from = ($page-1) * $limit;

$statement = $dbConnector->prepare('SELECT *, posts.id as post_id FROM posts JOIN users ON posts.user_id = users.id WHERE posts.deletion_date is NULL order by posts.creation_date DESC LIMIT :start_from,:limit;');
$statement->bindParam(':start_from', $start_from, PDO::PARAM_INT);
$statement->bindParam(':limit', $limit, PDO::PARAM_INT);
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

$stmt = $dbConnector->prepare('SELECT COUNT(id) AS total_posts FROM posts WHERE posts.deletion_date is NULL');
$stmt->execute();
$total_posts = $stmt->fetch(PDO::FETCH_ASSOC);

$print = [];

foreach ($results as $row) {
    $print[] = [
           'id' => $row['post_id'],
            'content' => $row['content'],
            'creation_date' => strtotime($row['creation_date']),
            'user_id' => $row['user_id'],
            'username' => $row['username']
    ];
}

$data = [
    'items' => $print,
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
