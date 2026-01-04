<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    include "db.php";
    include "lib/note.php";
    include "lib/auth.php";
    include "lib/pref.php";

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo "Forbidden";
        exit(header("location: http://localhost/note-maker/"));
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true) ?? $_POST;

    
    if (!isset($data['action']) || empty($data['action'])) {
        echo "Bad Request";
        exit(header("location: http://localhost/note-maker/"));
    }

    $action = $data['action'] ?? '';
    if ($action !== 'login' && $action !== 'register') {
        checkAuth();
    }

    switch ($action) {
        case 'createNote':
            $validData = checkNoteInput($data);
            insertNote($validData);

            break;
        case 'fetchNotes':
            fetchNotes();

            break;
        case 'pinNotes':
            pinNotes($data['noteID'], $data['isPinned']);
            
            break;
        case 'fetchSingleNote':
            fetchSingleNote($data['note_id']);

            break;
        case 'deleteNote':
            deleteNote($data['note_id']);
            break;
        case 'archiveNote':
            $newStatus = $data['status'] === 'active' ? 'archive' : 'active';
            archiveNote($data['note_id'], $newStatus);

            break;
        case 'updateNote':
            $validData = checkNoteInput($data);
            updateNote($data['note_id'], $data);

            break;
        case 'register':
            register($data, $_FILES);
            break;
        case 'login':
            login($data);

            break;
        case 'logout':
            logout();

            break;
        case 'updateProfile':
            updateProfile($data, $_FILES);

            break;
        case 'updatePassword';
            updatePassword($data);  
              
            break;
        default:
            echo json_encode([
                "status" => "error",
                "message" => "Action failed"
            ]);
            exit;
    }

    //echo json_encode($response);
?>