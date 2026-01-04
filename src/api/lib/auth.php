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
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
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
    if (empty($password) || strlen(trim($password)) <= 9) {
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

        unset($user['password_hash']);
        echo json_encode([
            "status" => "success",
            "message" => "Logged in",
            "user" => $user
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

function updateProfile($data, $files) {
    global $db;

    $pfpResult = true;
    $baseResult = false;

    $userID = $_SESSION['user_id'];
    $firstName = $data['firstName'] ?? '';
    $lastName = $data['lastName'] ?? '';
    $email = $data['email'] ?? '';

    $sql = "SELECT email FROM users WHERE ID = :uid";
    $comm = $db->prepare($sql);
    $comm->bindParam(':uid', $userID, PDO::PARAM_INT);
    $comm->execute();
    $currentEmail = $comm->fetch(PDO::FETCH_ASSOC);

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email"
        ]);
        exit;
    }
    if ($email !== $currentEmail['email']) {
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

    $sql = "UPDATE users SET first_name = :fName, last_name = :lName, email = :email WHERE ID = :uid";
    $comm = $db->prepare($sql);
    $comm->bindParam(":fName", $firstName, PDO::PARAM_STR);
    $comm->bindParam(":lName", $lastName, PDO::PARAM_STR);
    $comm->bindParam(":email", $email, PDO::PARAM_STR);
    $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
    if ($comm->execute()) {
        $baseResult = true;
    } else {
        $baseResult = false;
    }

    if (!empty($files['profilePic']['name']) || $files['profilePic']['error'] === 0) {
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

        $sql = "UPDATE users SET profile_picture = :pfp WHERE ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(":pfp", $profilePicture, PDO::PARAM_STR);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
        if ($comm->execute()) {
            $pfpResult = true;
        } else {
            $pfpResult = false;
        }
    }

    if ($baseResult == false || $pfpResult == false) {
        echo json_encode([
            "status" => "error",
            "message" => "Something went wrong while updating profile"
        ]);
        exit;
    } else {
        $sql = "SELECT * FROM users WHERE ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
        $comm->execute();
        $updatedUser = $comm->fetch(PDO::FETCH_ASSOC);
        unset($updatedUser['password_hash']); // heslo

        echo json_encode([
            "status" => "success",
            "message" => "Profile updated",
            "user" => $updatedUser
        ]);
    }
    
}

function updatePassword($data) {
    global $db;
    $userID = $_SESSION['user_id'];
    $curr = $data['currentPassword'] ?? '';
    $new = $data['newPassword'] ?? '';
    if (empty($curr) || empty($new) || strlen(trim($curr)) <= 9) {
        echo json_encode([
            "status" => "error",
            "message" => "Password needs to be at least 10 characters long"
        ]);
        exit;
    }
    $sql = "SELECT password_hash FROM users WHERE ID = :uid";
    $comm = $db->prepare($sql);
    $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
    $comm->execute();
    $oldHash = $comm->fetch(PDO::FETCH_ASSOC);

    if (!password_verify($curr, $oldHash['password_hash'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Your current password is wrong"
        ]);
        exit;
    }

    if ($curr === $new) {
        echo json_encode([
            "status" => "error",
            "message" => "Password cannot be the same"
        ]);
        exit;
    } else {
        $hash = password_hash($new, PASSWORD_DEFAULT);
        $sql = "UPDATE users SET password_hash = :hash WHERE ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(":hash", $hash, PDO::PARAM_STR);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
        if ($comm->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Password changed"
            ]);
            exit;
        }
    }
    echo json_encode([
        "status" => "error",
        "message" => "Failed to change password"
    ]);
    exit;
}

?>