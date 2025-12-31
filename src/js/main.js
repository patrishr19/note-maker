import {sendNoteToServer, getNotesFromServer} from './fetch.js';
import {startEditor, getCreationNoteData, collapseEditor, expandEditor, setNoteMode, setTaskMode, openCreateModal, closeCreateModal, collapsePinned, expandPinned, collapseRecent, expandRecent, openMoreOptions, closeMoreOptions, renderNotes} from './ui.js';


// all pages
$(document).on('click', (e) => {
    const isInsideMore = $(e.target).closest('#toggleMoreOptions').length > 0;
    const isMoreHidden = $('#moreOptions').hasClass('opacity-0');

    if (isInsideMore && isMoreHidden) {
        openMoreOptions();
    } else if (!isInsideMore && !isMoreHidden) {
        closeMoreOptions();
    }
});

// home page
if ($('#editorContainer').length > 0) {
    startEditor();

    const createForm = $('#createField');

    createForm.on('submit', async (event) => {
        event.preventDefault();

        const noteData = getCreationNoteData();

        try {
            const result = await sendNoteToServer(noteData);
            console.log(result.status);
            console.log(result.message);

            if (result.status === 'success') {
                const result = await getNotesFromServer();
                const notes = result.data;

                if (result.status === 'success') {
                    $('#recentNotes').empty();
                    $('#pinnedNotes').empty();
                    notes.forEach(note => {
                        renderNotes(note);
                    });
                    collapseEditor();
                    closeCreateModal();
                }
            }
        } catch (error) {
            console.error('Fetch Failed', error)
        }

    });


    $(document).on("click", (e) => {
        const modal = $('#mobileModal');
        const isModalHidden = modal.hasClass('opacity-0'); // Opacity
        const clickedToggleButton = $(e.target).closest('#modalToggleButton').length > 0;

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

        const isInside = $(e.target).closest('#createField').length > 0;
        const isHidden = $("#editorContainer").hasClass("note-hidden");


        if (isInside && isHidden) {
            expandEditor();
        } 
        else if (!isInside && !isHidden) {
            collapseEditor();
            setNoteMode();
            $("#noteType").val('note');
        }


    });

    $(window).on('resize', () =>{
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
    const $noteTypeSwitch = $('#noteTypeSwitch');

    $noteTypeSwitch.on("click", () => {
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
}

$(document).ready(async () => {
        try {
            const result = await getNotesFromServer();
            const notes = result.data;
            //console.log(notes);
            
            if (result.status === 'success') {
                $('#recentNotes').empty();
                $('#pinnedNotes').empty();
    
                notes.forEach(note => {
                    renderNotes(note);
                });
            }
        } catch (error) {
            console.error('Loading notes failed', error)
        }
});