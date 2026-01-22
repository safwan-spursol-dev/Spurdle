<?php
include '../db.php';
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['name']) && isset($data['email'])) {
    $stmt = $conn->prepare("UPDATE game_sessions SET full_name = :name, email = :email WHERE id = :id");
    $stmt->execute([
        'name' => $data['name'],
        'email' => $data['email'],
        'id' => $data['id']
    ]);
    echo json_encode(['status' => 'success']);
}
?>