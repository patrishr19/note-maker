import {startEditor, getCreationNoteData, collapseEditor, expandEditor, setNoteMode, setTaskMode, openCreateModal, closeCreateModal, collapsePinned, expandPinned, collapseRecent, expandRecent, openMoreOptions, closeMoreOptions, renderNotes, updateNav, startUpdateEditor, removeAddSearch, loadUserData} from './ui.js';
import {sendNoteToServer, getNotesFromServer, pinNote, loadPage, refreshNotes} from './fetch.js';
import { BASE } from './main.js';
import { views } from './views.js';

export function reInitPage(viewKey) {
    if (viewKey === 'home') {
        initHome();
    } else if (viewKey === 'pinned') {
        initPinned();
    } else if (viewKey === 'archive') {
        initArchive();
    } else if (viewKey === 'profile') {
        initProfile();
    } else if (viewKey === 'preferences') {
        initPref();
    }
}

export function initHome() {
    startEditor();
    startUpdateEditor();
    refreshNotes();
    removeAddSearch(false);
}

export function initPinned() {
    startUpdateEditor();
    refreshNotes();
    removeAddSearch(false);

    $(document).on('click', '.pinNote', async (e) => {
        const note = $(e.target).closest('.noteCard');
        const id = note.data('note-id');
        const pinned = note.data('pinned');

        try {
            const result = await pinNote(id, pinned);
            const message = result.message;
            //console.log(message);
            
            if (result.status === 'success') {
                const newPin = pinned == 0 ? 1 : 0;
                note.data('pinned', newPin);

                if (newPin === 1) {
                    note.prependTo('#pinnedNotes');
                    note.find('svg').removeClass('fill-none').addClass('fill-white');
                } else {
                    note.remove();
                }
            }
        } catch (error) {
            console.error('Error at pinning note', error);
        }
    });
}

export function initArchive() {
    startUpdateEditor();
    refreshNotes();
    removeAddSearch(false);
}

export function initProfile() {
    removeAddSearch(true);
}
export function initPref() {
    removeAddSearch(true);
    
}