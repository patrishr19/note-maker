import {updateNav} from './ui.js';
import {reInitPage} from './init.js';
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

export async function loadPage(url, pushState = true, replace = false) {
    const file = (url === '' || url === 'index' || url === 'index.html') ? 'home.html' : url + '.html';
    try {
        const response = await fetch(file);
        if (!response.ok) {
            alert('Page not found');
            return;
        }
        const htmlText = await response.text();
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        
        const newContent = doc.querySelector('#contentContainer'); // jquery nejde
        if (newContent) {
            $('#contentContainer').replaceWith(newContent.outerHTML);
        }

        const dynamicDiv = $('#dynamic');
        dynamicDiv.empty();
        // home stuff
        const modalBtn = doc.querySelector('#modalToggleButton');
        const modal = doc.querySelector('#mobileModal');
        if (modalBtn) {
            dynamicDiv.append(modalBtn);
        }
        if (modal) {
            dynamicDiv.append(modal);
        }
        // browser
        if (replace) {
            window.history.replaceState({}, '', url);
        } else if (pushState) {
            window.history.pushState({}, '', url)
        }

        updateNav(url);

        reInitPage(file);

    } catch (error) {
        console.log("Navigation failed", error);
    }

}