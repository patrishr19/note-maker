import {sendNoteToServer, getNotesFromServer, pinNote, loadPage, refreshNotes, fetchSingleNote, deleteNote, archiveNote, updateNote, register, login, logout, updateProfile, updatePassword} from './fetch.js';
import {startEditor, getCreationNoteData, collapseEditor, expandEditor, setNoteMode, setTaskMode, openCreateModal, closeCreateModal, collapsePinned, expandPinned, collapseRecent, expandRecent, openMoreOptions, closeMoreOptions, renderNotes, updateNav, openUpdateModal, closeUpdateModal, loadDataToUpdate, getUpdateData, showInfo, hsc, openSearchModal, closeSearchModal, resetPfp, toggleOffline, loadUserData, openPasswordModal, closePasswordModal, getPasswordData, syncPref} from './ui.js';
import {reInitPage, initHome, initPinned} from './init.js';
import { views } from './views.js';

export const BASE = '/note-maker';

window.addEventListener('offline', () => {
    toggleOffline();
});

window.addEventListener('online', () => {
    toggleOffline();
});

$(document).on('click', 'button, a, .pinNote, .noteCard', (e) => {
    if (!navigator.onLine) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showInfo('Action disabled', 'error');
        return false;
    }
});


$(document).ready(() => {
    
    const user = localStorage.getItem('user');
    const userParse = JSON.parse(user);
    //console.log(navigator.onLine);
    function getPath(path) {
        return path.replace(BASE, '').replace(/\//g, '') || 'register';
    }
    const initialView = getPath(window.location.pathname);
    const valid = ['home', 'pinned', 'archive', 'profile', 'preferences', 'login', 'register'];
    
    if (!user && (initialView !== 'login' && initialView !== 'register') ) {
        loadPage('login', false, true);
        showInfo('Please login', 'error');
    } else if (user && (initialView === 'login' || initialView === 'register')) {1
        loadPage('home', false, true);
    } else if (!valid.includes(initialView)) {
        loadPage('login', false, true);
        showInfo('Please login', 'error');
    } else {
        loadPage(initialView, false);
        if (initialView === 'profile') {
            loadUserData(userParse);
        }
    }
    
    //console.log(user);
    $(document).on('click', '.nav-link', (e) => {
        e.preventDefault();
        let url = $(e.currentTarget).attr('href');
        const viewKey = getPath(url);

        if (!localStorage.getItem('user') && (viewKey !== 'login' || viewKey !== 'register')) {
            loadPage('login');
            showInfo('Please login', 'error');
            return;
        }

        const currentPath = getPath(window.location.pathname);

        if (viewKey !== currentPath) {
            loadPage(viewKey);
            if (viewKey === 'profile') {
                loadUserData(userParse);
            }
        }
    });

    window.onpopstate = () => {
        const path = getPath(window.location.pathname);
        loadPage(path, false);
    }
    if (user) {
        resetPfp();
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
            const clickedSearch = $(e.target).closest('#searchButton').length > 0;
            const isSearchHidden = $('#searchModal').hasClass('opacity-0');
            const insideSearchField = $(e.target).closest('#searchField').length > 0;
            if (clickedSearch) {
                if (isSearchHidden) {   
                    openSearchModal();
                } else {
                    closeSearchModal();
                }
                return;
            }
            if (!isSearchHidden) {
                if (!insideSearchField) {
                    closeSearchModal();
                }
            }
        });
        $(document).on('keydown', '#searchInput', (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                closeSearchModal();
            }
        })
        $(document).on('input', '#searchInput', (e) => {
            const find = $(e.currentTarget).val().toLowerCase().trim();
            
            $('#restoreSearch').toggle(find.length > 0);
            expandPinned();
            expandRecent();
            const notes = $('.noteCard').get();
            notes.forEach(card => {
                const $card = $(card);

                const title = $card.find('.noteCard-title').text().toLowerCase();
                const content = $card.find('.noteCard-content').text().toLowerCase();

                if (title.includes(find) || content.includes(find)) {
                    $card.show();
                } else { 
                    $card.hide();
                }
            });

        });

        $(document).on('click', '#restoreSearch', () =>  {
            $('#searchInput').val('');
            $('#restoreSearch').hide();
            $('.noteCard').show();
        });

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

        $(document).on('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey /* mac uzivatele*/) && e.key === 'k') {
                e.preventDefault();

                const isSearchHidden = $('#searchModal').hasClass('opacity-0');

                if (isSearchHidden) {
                    openSearchModal();
                } else {
                    closeSearchModal();
                }

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
                        //console.log(note);
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
                            showInfo('Note deleted', 'success');
                        }
                    } catch (error) {
                        showInfo('Failed to delete', 'error');
                        console.error('Failed', error)
                    }
                }
                if (clickedArchive) {
                    const id = $('#updateField').data('note-id');
                    const status = $('#updateField').data('note-status');
                    try {
                        const result = await archiveNote(id, status);
                        if (result.status === 'success') {
                            refreshNotes();
                            closeUpdateModal();
                            showInfo('Note archived', 'success');
                        }
                    } catch (error) {
                        showInfo('Failed to archive', 'error');
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
                            showInfo('Note updated', 'success');
                        }
                    } catch (error) {
                        showInfo('Failed to update', 'error');
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
                //console.log(result.status);
                //console.log(result.message);

                if (result.status === 'success') {
                    refreshNotes();
                    collapseEditor();
                    closeCreateModal();
                    showInfo('Note created', 'success');
                } else {
                    showInfo(result.message, 'error');
                }
            } catch (error) {
                showInfo('Failed to create', 'error');
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
                //console.log(message);
                
                if (result.status === 'success') {
                    const newPin = pinned == 0 ? 1 : 0;
                    note.data('pinned', newPin);
                    if (newPin === 1) {
                        note.prependTo('#pinnedNotes');
                        note.find('svg').removeClass('fill-none').addClass('fill-white');
                        showInfo('Note pinned', 'success');
                    } else {
                        note.prependTo('#recentNotes');
                        note.find('svg').removeClass('fill-white').addClass('fill-none');
                        showInfo('Note unpinned', 'success');
                    }
                }
            } catch (error) {
                console.error('Error at pinning note', error);
            }
        });

    // #endregion
    // #region Profile page
    $(document).on('click', (e) => {
        const clickedToggle = $(e.target).closest('#toggleChangePasswordModal').length > 0;
        const isModalHidden = $('#passwordModal').hasClass('opacity-0');
        const isInside = $(e.target).closest('#passwordField').length > 0;

        if (clickedToggle) {
            if (isModalHidden) {
                openPasswordModal();
            } else {
                closePasswordModal();
            }
        }

        if (!isModalHidden) {
            if (!isInside) {
                closePasswordModal();
            }
        }
    });
    $(document).on('submit', '#passwordField', async (e) => {
        e.preventDefault();
        const formData = getPasswordData();

        try {
            const result = await updatePassword(formData);
            const message = result.message;
            if (result.status === 'success') {
                showInfo(result.message, 'success')
                closePasswordModal();
            } else {
                showInfo(result.message, 'error');
            }
        } catch (error) {
            console.error("Failed to update password", error);
        }
    });

    $(document).on('submit', '#updateProfileForm', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const result = await updateProfile(formData);
            const message = result.message;

            if (result.status === 'success') {
                localStorage.setItem('user', JSON.stringify(result.user));

                resetPfp();

                showInfo(result.message, 'success');
            } else {
                showInfo(result.message, 'error');
            }
        } catch (error) {
            console.error('Failed at updating profile', error);
        }
    });

    // #endregion

    // #region Login/Register

    $(document).on('submit', '#registerForm', async (e) => {
        e.preventDefault();
        
        if ($('#password').val() !== $('#passRepeat').val()) {
            showInfo('Passwords do not match', 'error');
            return;
        }
        const formData = new FormData(e.target); // vezme vsechny inputy

        try {
            const result = await register(formData);
            const message = result.message;
            showInfo(message, result.status);

            if (result.status === 'success') {
                loadPage('login');
                showInfo('Registered', 'success');
            }
            //console.log(message);
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
            //console.log(message);
            showInfo(message, result.status);
            if (result.status === 'success') {
                localStorage.setItem('user', JSON.stringify(result.user));

                loadPage('home');
                showInfo('Logged in', 'success');
                resetPfp();
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
            //console.log(message);

            localStorage.removeItem('user');

            loadPage('login', false, true);
        } catch (error) {
            console.error('Logout failed', error);
        }
    });
    // #endregion
    // #region pref

    $(document).on('change', '#compactToggle', (e) => {
        localStorage.setItem('compactMode', e.target.checked);

        refreshNotes();
    });

    // #endregion
});

