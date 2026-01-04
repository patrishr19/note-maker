import {updateNav, renderNotes, syncPref} from './ui.js';
import {reInitPage} from './init.js';
import {BASE} from './main.js';
import {views} from './views.js';

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
export async function pinNote(id, isPinned) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'pinNotes',
            noteID: id,
            isPinned: isPinned
        })
    });
    return await response.json();
}
export async function refreshNotes() {
    try {
        const result = await getNotesFromServer();
        const notes = result.data;
        //console.log(notes);
        if (result.status === 'success') {
            $('#recentNotes').empty();
            $('#pinnedNotes').empty();
            $('#archiveNotes').empty();
            notes.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)); // Serazeni podle datum
            notes.forEach(note => {
                renderNotes(note);
            });
        }
    } catch (error) {
        console.error('Loading notes failed', error)
    }
}
export function loadPage(url, pushState = true, replace = false) {
    let viewKey = url.replace(BASE, '').replace(/\//g, '') || 'register';
    if (viewKey === 'index.html') {
        viewKey = 'register';
    }

    const view = views[viewKey];
    
    if (!view) {
        console.log('Page not found', viewKey);
        return;
    }
    if (viewKey === 'login' || viewKey === 'register') {
        $('#mainNavbar, #sidebar').addClass('hidden');
    } else {
        $('#mainNavbar, #sidebar').removeClass('hidden');
    }

    $('#contentContainer').html(view.content);
    $('#dynamic').html(view.dynamic);
    
    const fullUrl = viewKey === 'register' ? `${BASE}/` : `${BASE}/${viewKey}`;

    if (replace) {
        window.history.replaceState({}, '',fullUrl);
    } else if (pushState) {
        window.history.pushState({}, '',fullUrl);
    }
    //console.log(viewKey);
    updateNav(viewKey);
    reInitPage(viewKey);
    syncPref();
}
export async function fetchSingleNote(id) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'fetchSingleNote',
            note_id: id
        })
    });

    return await response.json();
}

export async function deleteNote(id) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'deleteNote',
            note_id: id
        })
    });
    
    return await response.json();
}

export async function archiveNote(id, status) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'archiveNote',
            note_id: id,
            status: status
        })
    });
    
    return await response.json();
}

export async function updateNote(id, data) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'updateNote',
            note_id: id,
            ...data
        })
    });

    return await response.json();
}


export async function register(formData) {
    formData.append('action', 'register');
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        body: formData
    });
    return await response.json();
}

export async function login(data) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'login',
            ...data
        })
    });
    return await response.json();
}

export async function logout() {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'logout'
        })
    });
    return await response.json();
}

export async function updateProfile(formData) {
    formData.append('action', 'updateProfile');
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

export async function updatePassword(formData) {
    const response = await fetch('http://localhost/note-maker/src/api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'updatePassword',
            ...formData
        })
    });
    return await response.json();
}