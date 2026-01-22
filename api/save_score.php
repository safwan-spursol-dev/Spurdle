<?php
include '../db.php';
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['score'])) {
    $stmt = $conn->prepare("INSERT INTO game_sessions (score) VALUES (:score)");
    $stmt->execute(['score' => $data['score']]);
    // Wapis ID bhej rahe hain taake aglay step mai name update kar sakein
    echo json_encode(['id' => $conn->lastInsertId()]); 
}
?>