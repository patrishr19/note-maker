export async function sendNoteToServer(noteData) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'createNote',
            ...noteData
        })
    });

    return await response.json();
}

export async function getNotesFromServer() {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'fetchNotes'
        })
    });
    
    return await response.json();
}