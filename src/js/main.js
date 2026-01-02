import {sendNoteToServer, getNotesFromServer, pinNote, loadPage, refreshNotes} from './fetch.js';
import {startEditor, getCreationNoteData, collapseEditor, expandEditor, setNoteMode, setTaskMode, openCreateModal, closeCreateModal, collapsePinned, expandPinned, collapseRecent, expandRecent, openMoreOptions, closeMoreOptions, renderNotes, updateNav} from './ui.js';
import {reInitPage, initHome, initPinned} from './init.js';
import { views } from './views.js';

export const BASE = '/note-maker';

$(document).ready(() => {
    function getPath(path) {
        return path.replace(BASE, '').replace(/\//g, '') || 'home';
    }
    const initialView = getPath(window.location.pathname);
    const valid = ['home', 'pinned', 'archive', 'profile', 'preferences'];
    
    if (!valid.includes(initialView)) {
        loadPage('home', false, true);
    } else {
        loadPage(initialView, false);
    }

    $(document).on('click', '.nav-link', (e) => {
        e.preventDefault();
        let url = $(e.currentTarget).attr('href');
        const viewKey = getPath(url);

        const currentPath = getPath(window.location.pathname);

        if (viewKey !== currentPath) {
            loadPage(viewKey);
        }
    });

    window.onpopstate = () => {
        const path = getPath(window.location.pathname);
        loadPage(path, false);
    }

  
    // #region All pages
    $(document).off('click').on('click', (e) => {
        const isInsideMore = $(e.target).closest('#toggleMoreOptions').length > 0;
        const isMoreHidden = $('#moreOptions').hasClass('opacity-0');

        if (isInsideMore && isMoreHidden) {
            openMoreOptions();
        } else if (!isInsideMore && !isMoreHidden) {    
            closeMoreOptions();
        }
    });
    // #endregion
    // #region Home Page
        $(document).on('click', (e) => {
            const modal = $('#mobileModal');
            const isModalHidden = modal.hasClass('opacity-0'); // Opacity
            const clickedToggleButton = $(e.target).closest('#modalToggleButton').length > 0;
            const isInside = $(e.target).closest('#createField').length > 0;
            const isHidden = $("#editorContainer").hasClass("note-hidden");

            if (clickedToggleButton) {
                if (isModalHidden) {
                    openCreateModal();
                } else {
                    closeCreateModal();
                }
                return;
            }
            if (!isModalHidden) {
                const isInsideModal = $(e.target).closest('#createField').length > 0;

                if (!isInsideModal) {
                    closeCreateModal();
                }
                return;
            }

            if (isInside && isHidden) {
                expandEditor();
            } 
            else if (!isInside && !isHidden) {
                collapseEditor();
                setNoteMode();
                $("#noteType").val('note');
            }

        });


        $(document).on('submit', '#createField' , async (event) => {
            event.preventDefault();

            const noteData = getCreationNoteData();

            try {
                const result = await sendNoteToServer(noteData);
                console.log(result.status);
                console.log(result.message);

                if (result.status === 'success') {
                    refreshNotes();
                    collapseEditor();
                    closeCreateModal();
                }
            } catch (error) {
                console.error('Fetch Failed', error)
            }
        });

        $(window).on('resize', () => {
            if ($(window).width() > 640 && !$("#mobileModal").hasClass('hidden')) {
                closeCreateModal();
            }
        });

        $('#collapsePinned').on('click', (e) => {
            const isPinnedHidden = $('#pinnedNotes').hasClass('hidden');

            if (isPinnedHidden) {
                expandPinned();
            } else {
                collapsePinned();
            }
        });

        $('#collapseRecent').on('click', (e) => {
            const isRecentHidden = $('#recentNotes').hasClass('hidden');

            if (isRecentHidden) {
                expandRecent();
            } else {
                collapseRecent();
            }
        });

        $('#noteTypeSwitch').on("click", () => {
            const currentType = $('#noteType').val();
            let newType = currentType;
            if (currentType === 'note') {
                newType = 'task';
                setTaskMode();
            }
            else {
                newType = 'note';
                setNoteMode();
            }
            $("#noteType").val(newType);
        })

        $(document).on('click', '.pinNote', async (e) => {
            const note = $(e.target).closest('.noteCard');
            const id = note.data('note-id');
            const pinned = note.data('pinned');

            try {
                const result = await pinNote(id, pinned);
                const message = result.message;
                console.log(message);
                
                if (result.status === 'success') {
                    const newPin = pinned == 0 ? 1 : 0;
                    note.data('pinned', newPin);
                    
                    if (newPin === 1) {
                        note.prependTo('#pinnedNotes');
                        note.find('svg').removeClass('fill-none').addClass('fill-white');
                    } else {
                        note.prependTo('#recentNotes');
                        note.find('svg').removeClass('fill-white').addClass('fill-none');
                    }
                }
            } catch (error) {
                console.error('Error at pinning note', error);
            }
        });
    // #endregion

});

// PRomenit vsechny stranky na funkce napr initHomePage() kde nahazime vsechny event listenery, + initGlobalPage() na navbar, profile dropdown atd.
