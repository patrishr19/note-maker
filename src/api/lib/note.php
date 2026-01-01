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

        $status = 'active';
        $result = false;

        // NOTE
        $sql = 'INSERT INTO note (title, content, type, status) VALUES (:title, :content, :type, :status)';
        $comm = $db->prepare($sql);
        $comm->bindParam(":title", $data['title'], PDO::PARAM_STR);
        $comm->bindParam(":content", $data['content'], PDO::PARAM_STR);
        $comm->bindParam(":type", $data['type'], PDO::PARAM_STR);
        $comm->bindParam(":status", $status, PDO::PARAM_STR);

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
            $state = 'to do';
            $sql = 'INSERT INTO task (note_ID, deadline, status) VALUES (:note_id, :deadline, :status)';
            $comm = $db->prepare($sql);
            $comm->bindParam(":note_id", $lastID, PDO::PARAM_INT);
            $comm->bindParam(":deadline", $data['deadline'], PDO::PARAM_STR);
            $comm->bindParam(":status", $state, PDO::PARAM_STR);
            
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
        $status = 'active';
        $sql = "SELECT * FROM note WHERE status = :status ORDER BY ID DESC";
        $comm = $db->prepare($sql);
        $comm->bindParam(":status", $status, PDO::PARAM_STR);
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
                $item['deadline'] = $taskData['deadline'];
                $item['taskStatus'] = $taskData['status'];
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
 
        $sql = "UPDATE note SET is_pinned = :pin WHERE ID = :id";
        $comm = $db->prepare($sql);
        $comm->bindParam(':pin', $newPin, PDO::PARAM_INT);
        $comm->bindParam(':id', $noteID, PDO::PARAM_INT);

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
?>