import {sendNoteToServer, getNotesFromServer, pinNote, loadPage, refreshNotes, fetchSingleNote, deleteNote, archiveNote, updateNote, register, login, logout} from './fetch.js';
import {startEditor, getCreationNoteData, collapseEditor, expandEditor, setNoteMode, setTaskMode, openCreateModal, closeCreateModal, collapsePinned, expandPinned, collapseRecent, expandRecent, openMoreOptions, closeMoreOptions, renderNotes, updateNav, openUpdateModal, closeUpdateModal, loadDataToUpdate, getUpdateData} from './ui.js';
import {reInitPage, initHome, initPinned} from './init.js';
import { views } from './views.js';

export const BASE = '/note-maker';

$(document).ready(() => {
    const user = localStorage.getItem('user');

    function getPath(path) {
        return path.replace(BASE, '').replace(/\//g, '') || 'register';
    }
    const initialView = getPath(window.location.pathname);
    const valid = ['home', 'pinned', 'archive', 'profile', 'preferences', 'login', 'register'];
    
    if (!user && (initialView !== 'login' || initialView !== 'register') ) {
        loadPage('login', false, true);
    } else if (user && (initialView === 'login' || initialView === 'register')) {
        loadPage('home', false, true);
    } else if (!valid.includes(initialView)) {
        loadPage('login', false, true);
    } else {
        loadPage(initialView, false);
    }

    $(document).on('click', '.nav-link', (e) => {
        e.preventDefault();
        let url = $(e.currentTarget).attr('href');
        const viewKey = getPath(url);

        if (!localStorage.getItem('user') && (viewKey !== 'login' || viewKey !== 'register')) {
            loadPage('login');
            return;
        }

        const currentPath = getPath(window.location.pathname);

        if (viewKey !== currentPath) {
            loadPage(viewKey);
        }
    });

    window.onpopstate = () => {
        const path = getPath(window.location.pathname);
        loadPage(path, false);
    }
    if (user) {
        const pfp = JSON.parse(user).pfp;
        $('#profilePictureUrl, #profilePictureMain').attr('src', `${BASE}/src/uploads/${pfp}`);
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
                setNoteMode($('#noteTypeSwitch'), $('#taskDeadlineText'), $('#taskDeadline'));
                $("#noteType").val('note');
            }

        });

        $(document).on('click', async (e) => {
            const clickedCard = $(e.target).closest('.noteCard').length > 0;
            const insideUpdateField = $(e.target).closest('#updateField').length > 0;
            const isModalHidden = $('#updateModal').hasClass('opacity-0');
            const clickedSwitch = $(e.target).closest('#noteUpdateTypeSwitch').length > 0;
            const clickedDelete = $(e.target).closest('#noteUpdateDelete').length > 0;
            const clickedArchive = $(e.target).closest('#noteUpdateArchive').length > 0;
            const clickedUpdate = $(e.target).closest('#noteUpdateSubmit').length > 0;
            if (clickedCard) {
                let note;
                const targetNote = $(e.target).closest('.noteCard');
                const noteID = targetNote.data('note-id');
                
                try {
                    const result = await fetchSingleNote(noteID);
                    if (result.status === 'success') {
                        note = result.data;
                        console.log(note);
                    }

                } catch (error) {
                    console.error('Failed', error)
                }


                if (isModalHidden) {
                    loadDataToUpdate(note);
                    if (note.type === 'task') {
                        setTaskMode($('#noteUpdateTypeSwitch'), $('#taskUpdateDeadlineText'));
                    } else {
                        setNoteMode($('#noteUpdateTypeSwitch'), $('#taskUpdateDeadlineText'), $('#taskUpdateDeadline'));
                    }
                    openUpdateModal();
                } else {
                    closeUpdateModal();
                }
                return;
            }

            if (!isModalHidden) {
                if (clickedSwitch) {
                    //console.log($('#noteUpdateType').val());
                    let nextType;
                    if ($('#noteUpdateType').val() === 'note') {
                        setTaskMode($('#noteUpdateTypeSwitch'), $('#taskUpdateDeadlineText'));
                        nextType = 'task';
                    } else {
                        setNoteMode($('#noteUpdateTypeSwitch'), $('#taskUpdateDeadlineText'), $('#taskUpdateDeadline'));
                        nextType = 'note';
                    }
                    $('#noteUpdateType').val(nextType);
                }
                if (clickedDelete) {
                    const id = $('#updateField').data('note-id');
                    try {
                        const result = await deleteNote(id);

                        if (result.status === 'success') {
                            refreshNotes();
                            closeUpdateModal();
                        }
                    } catch (error) {
                        console.error('Failed', error)
                    }
                }
                if (clickedArchive) {
                    const id = $('#updateField').data('note-id');
                    const status = $('#updateField').data('note-status');
                    console.log('clik');
                    try {
                        const result = await archiveNote(id, status);
                        if (result.status === 'success') {
                            refreshNotes();
                            closeUpdateModal();
                        }
                    } catch (error) {
                        console.error('Failed', error)
                    }
                }
                if (clickedUpdate) {
                    const id = $('#updateField').data('note-id');
                    const updateData = getUpdateData();

                    try {
                        const result = await updateNote(id, updateData);

                        if (result.status === 'success') {
                            refreshNotes();
                            closeUpdateModal();
                        }
                    } catch (error) {
                        console.error('Failed', error);
                    }
                }
                if (!insideUpdateField) {
                    closeUpdateModal();
                }
                return;
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
                setTaskMode($('#noteTypeSwitch'), $('#taskDeadlineText'));
            }
            else {
                newType = 'note';
                setNoteMode($('#noteTypeSwitch'), $('#taskDeadlineText'), $('#taskDeadline'));
            }
            $("#noteType").val(newType);
        })

        $(document).on('click', '.pinNote', async (e) => {
            e.stopPropagation();
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
    // #region Login/Register

    $(document).on('submit', '#registerForm', async (e) => {
        e.preventDefault();
        
        if ($('#password').val() !== $('#passRepeat').val()) {
            alert("Passwords do not match!");
            return;
        }
        const formData = new FormData(e.target); // vezme vsechny inputy

        try {
            const result = await register(formData);
            const message = result.message;
            console.log(message);
        } catch (error) {
            console.error('Failed at register', error)
        }
    });

    $(document).on('submit', '#loginForm', async (e) => {
        e.preventDefault();

        const data = {
            email: $('#email').val(),
            password: $('#password').val()
        }
        try {
            const result = await login(data);
            const message = result.message;
            console.log(message);
            if (result.status === 'success') {
                localStorage.setItem('user', JSON.stringify(result.user));

                loadPage('home');
            }
        } catch (error) {
            console.error('Failed at logging in', error)
        }
    })

    $(document).on('click', '#logoutBtn', async (e) => {
        e.preventDefault();

        try {
            const result = await logout();
            const message = result.message;
            console.log(message);

            localStorage.removeItem('user');

            loadPage('login', false, true);
        } catch (error) {
            console.error('Logout failed', error);
        }
    })
    // #endregion
});

// PRomenit vsechny stranky na funkce napr initHomePage() kde nahazime vsechny event listenery, + initGlobalPage() na navbar, profile dropdown atd.
