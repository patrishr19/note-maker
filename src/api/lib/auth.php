<?php

function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            "status" => "error", 
            "message" => "Please log in"
        ]);
        exit;
    }
}

function register($data, $files) {
    global $db;

    $firstName = $data['firstName'] ?? '';
    $lastName = $data['lastName'] ?? '';
    $email= $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $passRepeat = $data['passRepeat'] ?? '';
    if (empty($email) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email"
        ]);
        exit;
    } else {
        $sql = "SELECT email FROM users WHERE email = :email";
        $comm = $db->prepare($sql);
        $comm->bindParam(":email", $email, PDO::PARAM_STR);
        $comm->execute();
        $data = $comm->fetch(PDO::FETCH_ASSOC);

        if (!empty($data)) {
            echo json_encode([
                "status" => "error",
                "message" => "Email is already used"
            ]);
            exit;
        }
    }
    if (empty($firstName) || strlen(trim($firstName)) <= 2) {
        echo json_encode([
            "status" => "error",
            "message" => "First name needs to be at least 3 characters long"
        ]);
        exit;
    }
    if (empty($lastName) || strlen(trim($lastName)) <= 2) {
        echo json_encode([
            "status" => "error",
            "message" => "Last name needs to be at least 3 characters long"
        ]);
        exit;
    }
    if (empty($password) OR strlen(trim($password)) <= 9) {
        echo json_encode([
            "status" => "error",
            "message" => "Password needs to be at least 10 characters long"
        ]);
        exit;
    }
    if (empty($passRepeat) || $password !== $passRepeat) {
        echo json_encode([
            "status" => "error",
            "message" => "Passwords do not match"
        ]);
        exit;
    }
    // inputs fine
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $profilePicture = 'default.png';
    if (isset($files['profilePic']) && $files['profilePic']['error'] === 0) {
        $valid = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $pathInfo = pathinfo($files['profilePic']['name'], PATHINFO_EXTENSION);

        if (in_array($pathInfo, $valid)) {
            $profilePicture = uniqid() . '.' . $pathInfo;
            move_uploaded_file($files['profilePic']['tmp_name'], '../uploads/' . $profilePicture);
        } else {
            echo json_encode([
            "status" => "error",
            "message" => "Invalid file type"
        ]);
        exit;
        }
    }

    $sql = "INSERT INTO users (first_name, last_name, email, password_hash, profile_picture) VALUES (:fName, :lName, :email, :pHash, :pfp)";
    $comm = $db->prepare($sql);
    $comm->bindParam(":email", $email, PDO::PARAM_STR);
    $comm->bindParam(":fName", $firstName, PDO::PARAM_STR);
    $comm->bindParam(":lName", $lastName, PDO::PARAM_STR);
    $comm->bindParam(":pHash", $hash, PDO::PARAM_STR);
    $comm->bindParam(":pfp", $profilePicture, PDO::PARAM_STR);
    
    if ($comm->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Registered"
        ]);
        exit;
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed at registering"
        ]);
        exit;
    }

}

function login($data) {
    global $db;
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    // najit
    $sql = "SELECT * FROM users WHERE email = :email";
    $comm = $db->prepare($sql);
    $comm->bindParam(":email", $email, PDO::PARAM_STR);
    if ($comm->execute()) {
        $user = $comm->fetch(PDO::FETCH_ASSOC);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed at logging in"
        ]);
        exit;
    }
    
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['ID'];
        $_SESSION['user_name'] = $user['first_name'];;

        echo json_encode([
            "status" => "success",
            "message" => "Logged in",
            "user" => [
                "name" => $user['first_name'],
                "pfp" => $user['profile_picture']
            ]
        ]);
        exit;
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email or password"
        ]);
        exit;
    }
}

function logout() {
    session_unset();
    session_destroy();

    echo json_encode([
        "status" => "success",
        "message" => "Logged out"
    ]);
    exit;
}

?>