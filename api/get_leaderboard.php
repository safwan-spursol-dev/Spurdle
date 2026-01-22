<?php
include '../db.php';
$stmt = $conn->prepare("SELECT full_name, score FROM game_sessions WHERE full_name IS NOT NULL ORDER BY score DESC");
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($results);
?>