import {sendNoteToServer, getNotesFromServer, pinNote, loadPage} from './fetch.js';
import {startEditor, getCreationNoteData, collapseEditor, expandEditor, setNoteMode, setTaskMode, openCreateModal, closeCreateModal, collapsePinned, expandPinned, collapseRecent, expandRecent, openMoreOptions, closeMoreOptions, renderNotes, updateNav} from './ui.js';
import {reInitPage, initHome} from './init.js';



$(document).ready(() => {
    let initialPath = window.location.pathname.split('/').pop();

    if (initialPath === '' || initialPath === 'index.html') {
        loadPage('home.html', false, true);
    } else {
        loadPage(initialPath, false);
    }

    const currentPage = $('.navbar a[aria-current="page"]').attr('href');
    console.log(currentPage);
    $(document).on('click', '.nav-link', (e) => {
        e.preventDefault();
        const url = $(e.currentTarget).attr('href');
        loadPage(url);
    });
  
    // #region All pages
    $(document).on('click', (e) => {
        const isInsideMore = $(e.target).closest('#toggleMoreOptions').length > 0;
        const isMoreHidden = $('#moreOptions').hasClass('opacity-0');

        if (isInsideMore && isMoreHidden) {
            openMoreOptions();
        } else if (!isInsideMore && !isMoreHidden) {    
            closeMoreOptions();
        }
    });
    // #endregion

})

// PRomenit vsechny stranky na funkce napr initHomePage() kde nahazime vsechny event listenery, + initGlobalPage() na navbar, profile dropdown atd.