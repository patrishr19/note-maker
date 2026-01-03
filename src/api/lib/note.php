<?php
    function checkNoteInput($data) {
        $type = $data['type'];
        $title = $data['title'] ?? '';
        $content = $data['content'] ?? '';
        $deadline = $data['deadline'] ?? '';
        if ($type !== "note" && $type !== "task") {
            echo json_encode([
                "status" => "error",
                "message" => "Invalid note type"
            ]);
            exit;
        }
        elseif (empty($title)) {
            echo json_encode([
                "status" => "error",
                "message" => "Invalid or empty title"
            ]);
            exit;
        }
        elseif ($type === "task" && empty($deadline)) {
            echo json_encode([
                "status" => "error",
                "message" => "Invalid task deadline"
            ]);
            exit;
        }

        return [
            'title' => $title,
            'content' => $content,
            'type' => $type,
            'deadline' => $deadline
        ];
    }

    function insertNote($data) {
        global $db;
        $userID = $_SESSION['user_id'];

        $status = 'active';
        $result = false;

        // NOTE
        $sql = 'INSERT INTO note (title, content, type, status, user_ID) VALUES (:title, :content, :type, :status, :uid)';
        $comm = $db->prepare($sql);
        $comm->bindParam(":title", $data['title'], PDO::PARAM_STR);
        $comm->bindParam(":content", $data['content'], PDO::PARAM_STR);
        $comm->bindParam(":type", $data['type'], PDO::PARAM_STR);
        $comm->bindParam(":status", $status, PDO::PARAM_STR);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);

        if($comm->execute()) {
            $result = true;
            $lastID = $db->lastInsertId();
        }
        else {
            $result = false;
            echo json_encode([
                "status" => "error",
                "message" => "Problem at inserting"
            ]);
            exit;
        }

        // EXTRA TASK ATR
        if ($data['type'] === 'task' && $result == true) {
            $sql = 'INSERT INTO task (note_ID, deadline) VALUES (:note_id, :deadline)';
            $comm = $db->prepare($sql);
            $comm->bindParam(":note_id", $lastID, PDO::PARAM_INT);
            $comm->bindParam(":deadline", $data['deadline'], PDO::PARAM_STR);
            
            if ($comm->execute()) {
                $result = true;
            }
            else {
                $result = false;
                $sql = "DELETE FROM note WHERE ID = :id";
                $comm = $db->prepare($sql);
                $comm->bindParam(":id", $lastID, PDO::PARAM_INT);
                $comm->execute();
                echo json_encode([
                    "status" => "error",
                    "message" => "Problem at inserting"
                ]);
                exit;
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Data inserted"
            ]);
        exit;
    }

    function fetchNotes() {
        global $db;
        $userID = $_SESSION['user_id'];

        $sql = "SELECT * FROM note WHERE user_ID = :uid ORDER BY created_date DESC";
        $comm = $db->prepare($sql);
        $comm->bindParam(':uid', $userID, PDO::PARAM_INT);
        $comm->execute();

        $notes = $comm->fetchAll(PDO::FETCH_ASSOC);

        $fullNotes = [];
        foreach ($notes as $item) { // Uplne Nahovno Zpusob Ale Funguje
            if ($item['type'] === 'task') {
                $note_id = $item['ID'];
                $sql = "SELECT * FROM task WHERE note_ID = :note_id";
                $comm = $db->prepare($sql);
                $comm->bindParam(":note_id", $note_id, PDO::PARAM_INT);
                $comm->execute();
                $taskData = $comm->fetch(PDO::FETCH_ASSOC);
                $item['deadline'] = $taskData['deadline'] ?? '';
            }
            $fullNotes[] = $item;
        }

        echo json_encode([
            "status" => "success",
            "data" => $fullNotes
        ]);
        exit;
    }

    function pinNotes($id, $isPinned) {
        global $db;
        $userID = $_SESSION['user_id'];

        $noteID = $id ?? '';
        $pinned = $isPinned ?? '';
        $validPinned = ['0', '1', 0, 1];
        $result = false;

        if (!filter_var($noteID, FILTER_VALIDATE_INT) || !in_array($pinned, $validPinned)) {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to pin the note"
            ]);
            exit;
        }
        $newPin = (int)$pinned == 0 ? 1 : 0;
 
        $sql = "UPDATE note SET is_pinned = :pin WHERE ID = :id AND user_ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(':pin', $newPin, PDO::PARAM_INT);
        $comm->bindParam(':id', $noteID, PDO::PARAM_INT);
        $comm->bindParam(':uid', $userID, PDO::PARAM_INT);

        if ($comm->execute()) {
            $result = true;
            $message = (int)$newPin == 0 ? 'Note unpinned' : 'Note pinned';
        }
        else {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to pin the note"
            ]);
            exit;
        }

        echo json_encode([
            "status" => "success",
            "message" => $message
        ]);
        exit;
    }

    function fetchSingleNote($id) {
        global $db;
        $userID = $_SESSION['user_id'];

        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to fetch note"
            ]);
            exit;
        }

        $sql = "SELECT * FROM note WHERE ID = :id AND user_ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(':id', $id, PDO::PARAM_INT);
        $comm->bindParam(':uid', $userID, PDO::PARAM_INT);
        $comm->execute();

        $note = $comm->fetch(PDO::FETCH_ASSOC);
        $fullNote = "";
        if ($note['type'] === 'task') {
            $sql = "SELECT * FROM task WHERE note_ID = :id";
            $comm = $db->prepare($sql);
            $comm->bindParam(":id", $id, PDO::PARAM_INT);
            $comm->execute();
            $taskData = $comm->fetch(PDO::FETCH_ASSOC);
            $note['deadline'] = $taskData['deadline'] ?? '';
        }
        $fullNote = $note;

        echo json_encode([
            "status" => "success",
            "data" => $fullNote
        ]);
        exit;
    }

    function deleteNote($id) {
        global $db;
        $userID = $_SESSION['user_id'];

        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to delete"
            ]);
            exit;
        }
        $sql = "SELECT type FROM note WHERE ID = :id AND user_ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(":id", $id, PDO::PARAM_INT);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
        $comm->execute();
        $type = $comm->fetch(PDO::FETCH_ASSOC);
        
        $sql = "DELETE FROM note WHERE ID = :id AND user_ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(":id", $id, PDO::PARAM_INT);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
        $comm->execute();

        if ($type === 'task') {
            $sql = "DELETE FROM task WHERE note_ID = :id";
            $comm = $db->prepare($sql);
            $comm->bindParam(":id", $id, PDO::PARAM_INT);
            $comm->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Note deleted"
        ]);
        exit;
    }

    function archiveNote($id, $status) {
        global $db;
        $userID = $_SESSION['user_id'];

        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to delete"
            ]);
            exit;
        }

        $sql = "UPDATE note SET status = :status WHERE ID = :id AND user_ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(":status", $status, PDO::PARAM_STR);
        $comm->bindParam(":id", $id, PDO::PARAM_INT);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
        $comm->execute();

        echo json_encode([
            "status" => "success",
            "message" => "Note deleted"
        ]);
        exit;
    }

    function updateNote($id, $data) {
        global $db;
        $userID = $_SESSION['user_id'];

        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to delete"
            ]);
            exit;
        }

        $sql = "UPDATE note SET title = :title, content = :content, type = :type WHERE ID = :id AND user_ID = :uid";
        $comm = $db->prepare($sql);
        $comm->bindParam(":title", $data['title'], PDO::PARAM_STR);
        $comm->bindParam(":content", $data['content'], PDO::PARAM_STR);
        $comm->bindParam(":type", $data['type'], PDO::PARAM_STR);
        $comm->bindParam(":id", $id, PDO::PARAM_INT);
        $comm->bindParam(":uid", $userID, PDO::PARAM_INT);
        $comm->execute();

        if ($data['type'] === 'task') {
            $sql = "INSERT INTO task (note_ID, deadline) VALUES (:note_ID, :deadline) ON DUPLICATE KEY UPDATE deadline = :deadline2"; // pokud tam uz je tak jenom update deadlinu
            $comm = $db->prepare($sql);
            $comm->bindParam(':note_ID', $id, PDO::PARAM_INT);
            $comm->bindParam(':deadline', $data['deadline'], PDO::PARAM_STR);
            $comm->bindParam(':deadline2', $data['deadline'], PDO::PARAM_STR);
            $comm->execute();
        } else {
            $sql = "DELETE FROM task WHERE note_ID = :note_id";
            $comm = $db->prepare($sql);
            $comm->bindParam(':note_id', $id, PDO::PARAM_INT);
            $comm->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Note updated"
        ]);
        exit;
    }
?>